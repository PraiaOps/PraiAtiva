import { db } from '@/config/firebase';
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
  startAfter
} from 'firebase/firestore';
import { EnrollmentStatus } from '@/types';
import { Notification } from '@/types';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'enrollment' | 'activity' | 'payment' | 'system' | 'status' | 'message' | 'rating';
  read: boolean;
  createdAt: Date | string;
  data?: any;
}

class NotificationService {
  private notificationsCollection = 'notifications';

  /**
   * Cria uma notificação
   */
  async createNotification(notification: Omit<Notification, 'id'>): Promise<string> {
    try {
      const notificationRef = await addDoc(collection(db, this.notificationsCollection), {
        ...notification,
        createdAt: serverTimestamp(),
        read: false
      });

      return notificationRef.id;
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
      data: { chatId }
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
      data: { ratingId }
    });
  }

  /**
   * Cria notificação de nova inscrição
   */
  async createEnrollmentNotification(
    userId: string,
    studentName: string,
    activityName: string,
    enrollmentId: string
  ): Promise<string> {
    return this.createNotification({
      userId,
      type: 'enrollment',
      title: 'Nova inscrição',
      message: `${studentName} se inscreveu na sua aula "${activityName}"`,
      data: { enrollmentId }
    });
  }

  /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, this.notificationsCollection, notificationId);
      await updateDoc(notificationRef, {
        read: true
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
        collection(db, this.notificationsCollection),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);

      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
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
    limit: number = 20
  ): Promise<Notification[]> {
    try {
      let q = query(
        collection(db, this.notificationsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      if (lastNotificationId) {
        const lastNotificationDoc = await getDoc(doc(db, this.notificationsCollection, lastNotificationId));
        q = query(q, startAfter(lastNotificationDoc));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      throw error;
    }
  }

  /**
   * Escuta notificações em tempo real
   */
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, this.notificationsCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
        collection(db, this.notificationsCollection),
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
      const notificationRef = doc(db, this.notificationsCollection, notificationId);
      await notificationRef.delete();
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
        collection(db, this.notificationsCollection),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);

      const batch = db.batch();
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
   * Cria uma notificação de nova matrícula
   */
  async createEnrollmentNotification(
    instructorId: string,
    studentName: string,
    activityName: string,
    enrollmentId: string
  ): Promise<void> {
    try {
      await addDoc(collection(db, this.notificationsCollection), {
        userId: instructorId,
        type: 'enrollment',
        title: 'Nova Matrícula',
        message: `${studentName} se matriculou em ${activityName}`,
        read: false,
        createdAt: serverTimestamp(),
        data: {
          enrollmentId,
          activityName,
          studentName
        }
      });
    } catch (error) {
      console.error('Erro ao criar notificação de matrícula:', error);
    }
  }

  /**
   * Cria uma notificação de mudança de status
   */
  async createEnrollmentStatusNotification(
    studentId: string,
    activityName: string,
    status: EnrollmentStatus,
    enrollmentId: string
  ): Promise<void> {
    try {
      const statusMessages = {
        pending: 'Aguardando confirmação',
        confirmed: 'Confirmada',
        cancelled: 'Cancelada',
        completed: 'Concluída',
        refunded: 'Reembolsada'
      };

      await addDoc(collection(db, this.notificationsCollection), {
        userId: studentId,
        type: 'status',
        title: 'Status da Matrícula Atualizado',
        message: `Sua matrícula em ${activityName} foi ${statusMessages[status]}`,
        read: false,
        createdAt: serverTimestamp(),
        data: {
          enrollmentId,
          activityName,
          status
        }
      });
    } catch (error) {
      console.error('Erro ao criar notificação de status:', error);
    }
  }

  /**
   * Cria uma notificação de pagamento
   */
  async createPaymentNotification(
    studentId: string,
    amount: number,
    status: 'pending' | 'paid' | 'refunded',
    enrollmentId: string
  ): Promise<void> {
    try {
      const statusMessages = {
        pending: 'pendente',
        paid: 'confirmado',
        refunded: 'reembolsado'
      };

      await addDoc(collection(db, this.notificationsCollection), {
        userId: studentId,
        type: 'payment',
        title: 'Status do Pagamento Atualizado',
        message: `Seu pagamento de R$ ${amount.toFixed(2)} foi ${statusMessages[status]}`,
        read: false,
        createdAt: serverTimestamp(),
        data: {
          enrollmentId,
          amount,
          status
        }
      });
    } catch (error) {
      console.error('Erro ao criar notificação de pagamento:', error);
    }
  }

  // Notificações específicas para atividades
  async createActivityNotification(
    instructorId: string,
    activityName: string,
    message: string,
    activityId: string
  ) {
    return this.createNotification({
      userId: instructorId,
      title: 'Atualização de Atividade',
      message: `Atividade "${activityName}": ${message}`,
      type: 'activity',
      data: { activityId },
    });
  }

  async createActivityUpdateNotification(
    studentId: string,
    activityName: string,
    message: string,
    activityId: string
  ) {
    return this.createNotification({
      userId: studentId,
      title: 'Atividade Atualizada',
      message: `A atividade "${activityName}" foi atualizada: ${message}`,
      type: 'activity',
      data: { activityId },
    });
  }

  // Notificações do sistema
  async createSystemNotification(userId: string, title: string, message: string) {
    return this.createNotification({
      userId,
      title,
      message,
      type: 'system',
    });
  }
}

export const notificationService = new NotificationService();
