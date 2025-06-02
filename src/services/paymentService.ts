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
  limit,
  startAfter
} from 'firebase/firestore';
import { Payment, PaymentStatus } from '@/types';
import { notificationService } from './notificationService';

class PaymentService {
  private paymentsCollection = 'payments';

  /**
   * Cria um novo pagamento
   */
  async createPayment(payment: Omit<Payment, 'id'>): Promise<string> {
    try {
      const paymentRef = await addDoc(collection(db, this.paymentsCollection), {
        ...payment,
        created: serverTimestamp(),
        updated: serverTimestamp(),
        status: 'pending'
      });

      // Notificar o instrutor sobre o novo pagamento
      await notificationService.createPaymentNotification(
        payment.instructorId,
        payment.studentName,
        payment.activityName,
        payment.amount,
        paymentRef.id
      );

      return paymentRef.id;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  }

  /**
   * Atualiza um pagamento
   */
  async updatePayment(id: string, payment: Partial<Payment>): Promise<void> {
    try {
      const paymentRef = doc(db, this.paymentsCollection, id);
      await updateDoc(paymentRef, {
        ...payment,
        updated: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
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
          ...paymentDoc.data()
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
      let q = collection(db, this.paymentsCollection);
      
      if (filters) {
        const constraints = [];
        
        if (filters.studentId) {
          constraints.push(where('studentId', '==', filters.studentId));
        }
        
        if (filters.instructorId) {
          constraints.push(where('instructorId', '==', filters.instructorId));
        }
        
        if (filters.activityId) {
          constraints.push(where('activityId', '==', filters.activityId));
        }
        
        if (filters.enrollmentId) {
          constraints.push(where('enrollmentId', '==', filters.enrollmentId));
        }
        
        if (filters.status) {
          constraints.push(where('status', '==', filters.status));
        }
        
        q = query(q, ...constraints, orderBy('created', 'desc'));
      } else {
        q = query(q, orderBy('created', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      throw error;
    }
  }

  /**
   * Escuta pagamentos em tempo real
   */
  subscribeToPayments(callback: (payments: Payment[]) => void, filters?: {
    studentId?: string;
    instructorId?: string;
    activityId?: string;
    enrollmentId?: string;
    status?: PaymentStatus;
  }) {
    let q = collection(db, this.paymentsCollection);
    
    if (filters) {
      const constraints = [];
      
      if (filters.studentId) {
        constraints.push(where('studentId', '==', filters.studentId));
      }
      
      if (filters.instructorId) {
        constraints.push(where('instructorId', '==', filters.instructorId));
      }
      
      if (filters.activityId) {
        constraints.push(where('activityId', '==', filters.activityId));
      }
      
      if (filters.enrollmentId) {
        constraints.push(where('enrollmentId', '==', filters.enrollmentId));
      }
      
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      
      q = query(q, ...constraints, orderBy('created', 'desc'));
    } else {
      q = query(q, orderBy('created', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
      
      callback(payments);
    });
  }

  /**
   * Busca pagamentos de um aluno
   */
  async getStudentPayments(studentId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, this.paymentsCollection),
        where('studentId', '==', studentId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
    } catch (error) {
      console.error('Erro ao buscar pagamentos do aluno:', error);
      throw error;
    }
  }

  /**
   * Busca pagamentos de um instrutor
   */
  async getInstructorPayments(instructorId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, this.paymentsCollection),
        where('instructorId', '==', instructorId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
    } catch (error) {
      console.error('Erro ao buscar pagamentos do instrutor:', error);
      throw error;
    }
  }

  /**
   * Busca pagamentos de uma atividade
   */
  async getActivityPayments(activityId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, this.paymentsCollection),
        where('activityId', '==', activityId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
    } catch (error) {
      console.error('Erro ao buscar pagamentos da atividade:', error);
      throw error;
    }
  }

  /**
   * Atualiza status do pagamento
   */
  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<void> {
    try {
      const paymentRef = doc(db, this.paymentsCollection, id);
      await updateDoc(paymentRef, {
        status,
        updated: serverTimestamp()
      });

      // Notificar o aluno sobre a mudança de status
      const payment = await this.getPayment(id);
      if (payment) {
        await notificationService.createPaymentStatusNotification(
          payment.studentId,
          payment.instructorName,
          payment.activityName,
          payment.amount,
          status,
          id
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      throw error;
    }
  }

  /**
   * Deleta um pagamento
   */
  async deletePayment(id: string): Promise<void> {
    try {
      const paymentRef = doc(db, this.paymentsCollection, id);
      await paymentRef.delete();
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
