import { db } from '@/config/firebase';
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
  private chatsCollection = 'chats';
  private messagesCollection = 'messages';

  /**
   * Cria um novo chat
   */
  async createChat(chat: Omit<Chat, 'id'>): Promise<string> {
    try {
      const chatRef = await addDoc(collection(db, this.chatsCollection), {
        ...chat,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
      });

      return chatRef.id;
    } catch (error) {
      console.error('Erro ao criar chat:', error);
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
      const messageRef = await addDoc(collection(db, this.messagesCollection), {
        ...message,
        chatId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        read: false,
      });

      // Atualizar última mensagem do chat
      const chatRef = doc(db, this.chatsCollection, chatId);
      await updateDoc(chatRef, {
        lastMessage: {
          text: message.text,
          senderId: message.senderId,
          senderName: message.senderName,
          createdAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });

      // Notificar o destinatário
      await notificationService.createMessageNotification(
        message.receiverId,
        message.senderName,
        message.text,
        chatId
      );

      return messageRef.id;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * Marca mensagens como lidas
   */
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('chatId', '==', chatId),
        where('receiverId', '==', userId),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
      throw error;
    }
  }

  /**
   * Busca um chat pelo ID
   */
  async getChat(id: string): Promise<Chat | null> {
    try {
      const chatRef = doc(db, this.chatsCollection, id);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        return {
          id: chatDoc.id,
          ...chatDoc.data(),
        } as Chat;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar chat:', error);
      throw error;
    }
  }

  /**
   * Lista chats de um usuário
   */
  async listUserChats(userId: string): Promise<Chat[]> {
    try {
      const q = query(
        collection(db, this.chatsCollection),
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];
    } catch (error) {
      console.error('Erro ao listar chats:', error);
      throw error;
    }
  }

  /**
   * Lista mensagens de um chat
   */
  async listChatMessages(
    chatId: string,
    lastMessageId?: string,
    pageSize: number = 20
  ): Promise<Message[]> {
    try {
      let q = query(
        collection(db, this.messagesCollection),
        where('chatId', '==', chatId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(pageSize)
      );

      if (lastMessageId) {
        const lastMessageDoc = await getDoc(
          doc(db, this.messagesCollection, lastMessageId)
        );
        q = query(q, startAfter(lastMessageDoc));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Message[];
    } catch (error) {
      console.error('Erro ao listar mensagens:', error);
      throw error;
    }
  }

  /**
   * Escuta chats em tempo real
   */
  subscribeToChats(userId: string, callback: (chats: Chat[]) => void) {
    const q = query(
      collection(db, this.chatsCollection),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, snapshot => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];

      callback(chats);
    });
  }

  /**
   * Escuta mensagens em tempo real
   */
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, this.messagesCollection),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, snapshot => {
      const messages = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Message[];

      callback(messages);
    });
  }

  /**
   * Busca chat entre dois usuários
   */
  async getChatBetweenUsers(
    userId1: string,
    userId2: string
  ): Promise<Chat | null> {
    try {
      const q = query(
        collection(db, this.chatsCollection),
        where('participants', 'array-contains', userId1)
      );

      const snapshot = await getDocs(q);

      for (const doc of snapshot.docs) {
        const chat = doc.data() as Chat;
        if (chat.participants.includes(userId2)) {
          return {
            id: doc.id,
            ...chat,
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar chat entre usuários:', error);
      throw error;
    }
  }

  /**
   * Deleta um chat
   */
  async deleteChat(chatId: string): Promise<void> {
    try {
      // Deletar todas as mensagens do chat
      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('chatId', '==', chatId)
      );

      const messagesSnapshot = await getDocs(messagesQuery);

      const batch = writeBatch(db);
      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Deletar o chat
      batch.delete(doc(db, this.chatsCollection, chatId));

      await batch.commit();
    } catch (error) {
      console.error('Erro ao deletar chat:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
