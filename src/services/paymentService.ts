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
  deleteDoc,
  DocumentReference,
  CollectionReference,
  writeBatch,
} from 'firebase/firestore';
import { Payment, PaymentStatus } from '@/types';
import { notificationService } from './notificationService';

class PaymentService {
  private paymentsCollection = 'payments';

  private async commitWithRetry(batch: any): Promise<void> {
    let retries = 3;
    while (retries > 0) {
      try {
        await batch.commit();
        return;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Cria um novo pagamento e simula pagamento PIX aprovado automaticamente
   */
  async createPayment(
    payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<string> {
    try {
      // Create document reference
      const paymentRef = doc(collection(db, this.paymentsCollection));
      const batch = writeBatch(db);

      // Add payment to batch
      batch.set(paymentRef, {
        ...payment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending' as PaymentStatus,
      });

      // Commit batch with retries
      await this.commitWithRetry(batch);

      // Simulate PIX payment after successful creation
      setTimeout(async () => {
        try {
          await this.updatePaymentStatus(
            paymentRef.id,
            'paid',
            payment.enrollmentId
          );
        } catch (error) {
          console.error('Erro ao simular pagamento:', error);
        }
      }, 2000);

      // Create notification in a separate try-catch
      try {
        await notificationService.createNotification({
          type: 'payment',
          userId: payment.instructorId,
          title: 'Novo Pagamento',
          message: `${payment.studentName} iniciou um pagamento para ${payment.activityName}`,
          data: {
            paymentId: paymentRef.id,
            amount: payment.amount,
          },
        });
      } catch (error) {
        console.error('Erro ao criar notificação:', error);
        // Don't throw - payment was created successfully
      }

      return paymentRef.id;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status do pagamento e sincroniza com a matrícula
   */
  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    enrollmentId: string
  ): Promise<void> {
    try {
      const batch = writeBatch(db);
      const paymentRef = doc(db, this.paymentsCollection, paymentId);
      const paymentDoc = await getDoc(paymentRef);

      if (!paymentDoc.exists()) {
        throw new Error('Pagamento não encontrado');
      }

      const payment = paymentDoc.data() as Payment;

      // Add payment update to batch
      batch.update(paymentRef, {
        status,
        updatedAt: serverTimestamp(),
        ...(status === 'paid' ? { paidAt: serverTimestamp() } : {}),
      });

      // Commit batch with retries
      await this.commitWithRetry(batch);

      // Update enrollment in a separate try-catch
      try {
        const { enrollmentService } = await import('./enrollmentService');

        if (status === 'paid') {
          await enrollmentService.confirmEnrollment(enrollmentId);
        } else if (status !== 'pending') {
          await enrollmentService.cancelEnrollment(enrollmentId);
        }
      } catch (error) {
        console.error('Erro ao atualizar matrícula:', error);
      }

      // Create notification in a separate try-catch
      try {
        await notificationService.createNotification({
          type: 'payment',
          userId: payment.studentId,
          title: 'Status do Pagamento Atualizado',
          message: `Seu pagamento para ${payment.activityName} foi ${
            status === 'paid'
              ? 'confirmado'
              : status === 'pending'
              ? 'registrado'
              : 'cancelado'
          }`,
          data: {
            paymentId,
            amount: payment.amount,
            status,
            enrollmentId,
          },
        });
      } catch (error) {
        console.error('Erro ao criar notificação:', error);
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      throw error;
    }
  }

  /**
   * Busca um pagamento pelo ID
   */
  async getPayment(id: string): Promise<Payment | null> {
    try {
      const paymentRef = doc(db, this.paymentsCollection, id);
      const paymentDoc = await getDoc(paymentRef);

      if (paymentDoc.exists()) {
        return {
          id: paymentDoc.id,
          ...paymentDoc.data(),
        } as Payment;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      throw error;
    }
  }

  /**
   * Lista pagamentos com filtros
   */
  async listPayments(filters?: {
    studentId?: string;
    instructorId?: string;
    activityId?: string;
    enrollmentId?: string;
    status?: PaymentStatus;
  }): Promise<Payment[]> {
    try {
      const paymentsRef = collection(db, this.paymentsCollection);
      const constraints = [];

      if (filters?.studentId) {
        constraints.push(where('studentId', '==', filters.studentId));
      }

      if (filters?.instructorId) {
        constraints.push(where('instructorId', '==', filters.instructorId));
      }

      if (filters?.activityId) {
        constraints.push(where('activityId', '==', filters.activityId));
      }

      if (filters?.enrollmentId) {
        constraints.push(where('enrollmentId', '==', filters.enrollmentId));
      }

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      const q =
        constraints.length > 0
          ? query(paymentsRef, ...constraints, orderBy('createdAt', 'desc'))
          : query(paymentsRef, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      throw error;
    }
  }

  /**
   * Deleta um pagamento (apenas se estiver pendente)
   */
  async deletePayment(id: string): Promise<void> {
    try {
      const payment = await this.getPayment(id);
      if (!payment) {
        throw new Error('Pagamento não encontrado');
      }

      if (payment.status !== 'pending') {
        throw new Error('Apenas pagamentos pendentes podem ser deletados');
      }

      await deleteDoc(doc(db, this.paymentsCollection, id));
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
      throw error;
    }
  }

  /**
   * Escuta pagamentos em tempo real
   */
  subscribeToPayments(
    callback: (payments: Payment[]) => void,
    filters?: {
      studentId?: string;
      instructorId?: string;
      activityId?: string;
      enrollmentId?: string;
      status?: PaymentStatus;
    }
  ) {
    const paymentsRef = collection(db, this.paymentsCollection);
    const constraints = [];

    if (filters?.studentId) {
      constraints.push(where('studentId', '==', filters.studentId));
    }

    if (filters?.instructorId) {
      constraints.push(where('instructorId', '==', filters.instructorId));
    }

    if (filters?.activityId) {
      constraints.push(where('activityId', '==', filters.activityId));
    }

    if (filters?.enrollmentId) {
      constraints.push(where('enrollmentId', '==', filters.enrollmentId));
    }

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    const q =
      constraints.length > 0
        ? query(paymentsRef, ...constraints, orderBy('createdAt', 'desc'))
        : query(paymentsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, snapshot => {
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];

      callback(payments);
    });
  }
}

export const paymentService = new PaymentService();
