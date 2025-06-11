import { getFirebaseInstance } from '@/config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  getDocs,
  getDoc,
  limit,
  startAfter,
  writeBatch,
} from 'firebase/firestore';
import { EnrollmentStatus, NotificationType, type Notification } from '@/types';

class NotificationService {
  private get db() {
    return getFirebaseInstance().db;
  }
  private notificationsCollection = 'notifications';

  /**
   * Cria uma notificação base com tratamento de erros
   */
  private async createBaseNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<string> {
    try {
      const notification: Omit<Notification, 'id'> = {
        ...data,
        read: false,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      const docRef = await addDoc(
        collection(this.db, this.notificationsCollection),
        notification
      );
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  /**
   * Cria uma notificação
   */
  async createNotification(data: {
    type: NotificationType;
    userId: string;
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<string> {
    try {
      return await this.createBaseNotification(data);
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  /**
   * Cria notificação de nova mensagem
   */
  async createMessageNotification(
    userId: string,
    senderName: string,
    messageText: string,
    chatId: string
  ): Promise<string> {
    return this.createNotification({
      userId,
      type: 'message',
      title: 'Nova mensagem',
      message: `${senderName} enviou uma mensagem: ${messageText}`,
      data: { chatId },
    });
  }

  /**
   * Cria notificação de nova avaliação
   */
  async createRatingNotification(
    userId: string,
    studentName: string,
    activityName: string,
    ratingId: string
  ): Promise<string> {
    return this.createNotification({
      userId,
      type: 'rating',
      title: 'Nova avaliação',
      message: `${studentName} avaliou sua aula "${activityName}"`,
      data: { ratingId },
    });
  }

  /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(
        this.db,
        this.notificationsCollection,
        notificationId
      );
      await updateDoc(notificationRef, {
        read: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(this.db, this.notificationsCollection),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(this.db);

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          read: true,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw error;
    }
  }

  /**
   * Lista notificações de um usuário
   */
  async listUserNotifications(
    userId: string,
    lastNotificationId?: string,
    pageSize: number = 20
  ): Promise<Notification[]> {
    try {
      let q = query(
        collection(this.db, this.notificationsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastNotificationId) {
        const lastNotificationDoc = await getDoc(
          doc(this.db, this.notificationsCollection, lastNotificationId)
        );
        if (lastNotificationDoc.exists()) {
          q = query(q, startAfter(lastNotificationDoc));
        }
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      throw error;
    }
  }

  /**
   * Escuta notificações em tempo real
   */
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ) {
    const q = query(
      collection(this.db, this.notificationsCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, snapshot => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      callback(notifications);
    });
  }

  /**
   * Conta notificações não lidas
   */
  async countUnreadNotifications(userId: string): Promise<number> {
    try {
      const q = query(
        collection(this.db, this.notificationsCollection),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      throw error;
    }
  }

  /**
   * Deleta uma notificação
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(
        this.db,
        this.notificationsCollection,
        notificationId
      );
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  }

  /**
   * Deleta todas as notificações de um usuário
   */
  async deleteAllUserNotifications(userId: string): Promise<void> {
    try {
      const q = query(
        collection(this.db, this.notificationsCollection),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(this.db);

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Erro ao deletar todas as notificações:', error);
      throw error;
    }
  }

  /**
   * Cria notificação com retry para inscrição
   */
  async createEnrollmentNotification(
    instructorId: string,
    studentName: string,
    activityName: string,
    enrollmentId: string
  ): Promise<string> {
    return this.createNotification({
      userId: instructorId,
      type: 'enrollment',
      title: 'Nova Matrícula',
      message: `${studentName} se matriculou em ${activityName}`,
      data: {
        enrollmentId,
        activityName,
        studentName,
      },
    });
  }

  /**
   * Cria uma notificação de mudança de status
   */
  async createEnrollmentStatusNotification(
    studentId: string,
    activityName: string,
    status: EnrollmentStatus,
    enrollmentId: string
  ): Promise<string> {
    const statusMessages = {
      pending: 'Aguardando confirmação',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Concluída',
    };

    return this.createNotification({
      userId: studentId,
      type: 'enrollment',
      title: 'Status da Matrícula Atualizado',
      message: `Sua matrícula em ${activityName} foi ${statusMessages[status]}`,
      data: {
        enrollmentId,
        activityName,
        status,
      },
    });
  }

  /**
   * Cria uma notificação de pagamento
   */
  async createPaymentNotification(
    studentId: string,
    amount: number,
    status: 'pending' | 'paid' | 'refunded',
    enrollmentId: string
  ): Promise<string> {
    const statusMessages = {
      pending: 'pendente',
      paid: 'confirmado',
      refunded: 'reembolsado',
    };

    return this.createNotification({
      userId: studentId,
      type: 'payment',
      title: 'Status do Pagamento Atualizado',
      message: `Seu pagamento de R$ ${amount.toFixed(2)} foi ${
        statusMessages[status]
      }`,
      data: {
        enrollmentId,
        amount,
        status,
      },
    });
  }

  /**
   * Cria notificação de atividade
   */
  async createActivityNotification(
    instructorId: string,
    activityName: string,
    message: string,
    activityId: string
  ): Promise<string> {
    return this.createNotification({
      userId: instructorId,
      title: 'Atualização de Atividade',
      message: `Atividade "${activityName}": ${message}`,
      type: 'activity',
      data: { activityId },
    });
  }

  /**
   * Cria notificação de atualização de atividade
   */
  async createActivityUpdateNotification(
    studentId: string,
    activityName: string,
    message: string,
    activityId: string
  ): Promise<string> {
    return this.createNotification({
      userId: studentId,
      title: 'Atividade Atualizada',
      message: `A atividade "${activityName}" foi atualizada: ${message}`,
      type: 'activity',
      data: { activityId },
    });
  }

  /**
   * Cria notificação do sistema
   */
  async createSystemNotification(
    userId: string,
    title: string,
    message: string
  ): Promise<string> {
    return this.createNotification({
      userId,
      title,
      message,
      type: 'system',
    });
  }
}

export const notificationService = new NotificationService();
