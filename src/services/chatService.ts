import { getFirebaseInstance } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit as firestoreLimit,
  startAfter,
  writeBatch,
} from 'firebase/firestore';
import { Chat, Message } from '@/types';
import { notificationService } from './notificationService';

class ChatService {
  private get db() {
    return getFirebaseInstance().db;
  }
  private chatsCollection = 'chats';
  private messagesCollection = 'messages';

  /**
   * Cria um novo chat
   */
  async createChat(participants: string[]): Promise<string> {
    try {
      const chatRef = await addDoc(collection(this.db, this.chatsCollection), {
        participants,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
      });

      // Notify participants about new chat
      for (const participantId of participants) {
        await notificationService.createNotification({
          userId: participantId,
          type: 'message',
          title: 'Novo chat criado',
          message: 'Você foi adicionado a uma nova conversa',          data: {
            chatId: chatRef.id,
          },
        });
      }

      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  /**
   * Envia uma mensagem
   */
  async sendMessage(
    chatId: string,
    message: Omit<Message, 'id'>
  ): Promise<string> {
    try {
      const messageRef = await addDoc(collection(this.db, this.messagesCollection), {
        ...message,
        chatId,
        createdAt: serverTimestamp(),
      });

      // Update chat's last message and timestamp
      const chatRef = doc(this.db, this.chatsCollection, chatId);
      await updateDoc(chatRef, {
        lastMessage: {
          text: message.text,
          senderId: message.senderId,
          senderName: message.senderName,
          createdAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });

      // Notify other participants
      const chat = await this.getChat(chatId);
      if (chat) {
        const otherParticipants = chat.participants.filter(
          (p) => p !== message.senderId
        );
        for (const participantId of otherParticipants) {
          await notificationService.createNotification({
            userId: participantId,
            type: 'message',
            title: 'Nova mensagem',
            message: `${message.senderName} enviou uma mensagem`,
            data: {              chatId,
              messageId: messageRef.id,
              senderId: message.senderId,
            },
          });
        }
      }

      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Marca mensagens como lidas
   */
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    try {
      const q = query(
        collection(this.db, this.messagesCollection),
        where('chatId', '==', chatId),
        where('readBy', 'not-in', [userId])
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(this.db);

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        batch.update(doc.ref, {
          readBy: [...(data.readBy || []), userId],
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  /**
   * Busca um chat pelo ID
   */
  async getChat(id: string): Promise<Chat | null> {
    try {
      const chatRef = doc(this.db, this.chatsCollection, id);
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
        return null;
      }
      const data = chatDoc.data();
      return {
        id: chatDoc.id,
        participants: data.participants,
        lastMessage: data.lastMessage,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Chat;
    } catch (error) {
      console.error('Error getting chat:', error);
      throw error;
    }
  }

  /**
   * Lista chats de um usuário
   */
  async getChats(userId: string, limit = 20, lastChatId?: string): Promise<Chat[]> {
    try {
      let q = query(
        collection(this.db, this.chatsCollection),
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc'),
        firestoreLimit(limit)
      );

      if (lastChatId) {
        const lastDoc = await getDoc(doc(this.db, this.messagesCollection, lastChatId));
        if (lastDoc.exists()) {
          q = query(q, startAfter(lastDoc));
        }
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          participants: data.participants,
          lastMessage: data.lastMessage,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Chat;
      });
    } catch (error) {
      console.error('Error getting chats:', error);
      throw error;
    }
  }

  /**
   * Lista mensagens de um chat
   */
  async getMessages(
    chatId: string,
    limit = 50,
    lastMessageId?: string
  ): Promise<Message[]> {
    try {
      let q = query(
        collection(this.db, this.messagesCollection),
        where('chatId', '==', chatId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );

      if (lastMessageId) {
        const lastDoc = await getDoc(
          doc(this.db, this.messagesCollection, lastMessageId)
        );
        if (lastDoc.exists()) {
          q = query(q, startAfter(lastDoc));
        }
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          chatId: data.chatId,
          senderId: data.senderId,
          receiverId: data.receiverId,
          senderName: data.senderName,
          text: data.text,
          read: data.read,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Message;
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  /**
   * Escuta chats em tempo real
   */
  watchChats(userId: string, callback: (chats: Chat[]) => void) {
    const q = query(
      collection(this.db, this.chatsCollection),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          participants: data.participants,
          lastMessage: data.lastMessage,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Chat;
      });
      callback(chats);
    });
  }

  /**
   * Escuta mensagens em tempo real
   */
  watchMessages(chatId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(this.db, this.messagesCollection),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          chatId: data.chatId,
          senderId: data.senderId,
          receiverId: data.receiverId,
          senderName: data.senderName,
          text: data.text,
          read: data.read,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Message;
      });
      callback(messages);
    });
  }

  /**
   * Deleta um chat
   */
  async deleteChat(chatId: string): Promise<void> {
    try {
      const batch = writeBatch(this.db);

      // Delete messages
      const messagesQuery = query(
        collection(this.db, this.messagesCollection),
        where('chatId', '==', chatId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      messagesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

      // Delete chat
      batch.delete(doc(this.db, this.chatsCollection, chatId));

      await batch.commit();
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
