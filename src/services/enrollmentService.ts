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
  Timestamp,
  deleteDoc,
  limit,
  startAfter
} from 'firebase/firestore';
import {
  Enrollment,
  EnrollmentStatus,
  Activity,
  User,
  Transaction,
  InstructorFinancialSummary
} from '@/types';
import { notificationService } from './notificationService';
import { activityService } from './activityService';
import { stripeService } from './stripeService';

class EnrollmentService {
  private enrollmentsCollection = 'enrollments';
  private transactionsCollection = 'transactions';

  /**
   * Cria uma nova inscrição
   */
  async createEnrollment(enrollment: Omit<Enrollment, 'id'>): Promise<string> {
    try {
      const enrollmentRef = await addDoc(collection(db, this.enrollmentsCollection), {
        ...enrollment,
        created: serverTimestamp(),
        updated: serverTimestamp(),
        status: 'pending'
      });

      // Notificar o instrutor sobre a nova inscrição
      await notificationService.createEnrollmentNotification(
        enrollment.instructorId,
        enrollment.studentName,
        enrollment.activityName,
        enrollmentRef.id
      );

      // Criar sessão de pagamento no Stripe apenas se não for PIX
      if (enrollment.paymentInfo.paymentMethod !== 'pix') {
        const sessionId = await stripeService.createPaymentSession({
          id: enrollmentRef.id,
          studentId: enrollment.studentId,
          instructorId: enrollment.instructorId,
          activityId: enrollment.activityId,
          enrollmentId: enrollmentRef.id,
          studentName: enrollment.studentName,
          instructorName: enrollment.instructorName,
          activityName: enrollment.activityName,
          amount: enrollment.paymentInfo.amount,
          status: 'pending',
          created: new Date(),
          updated: new Date()
        });
      }

      return enrollmentRef.id;
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma inscrição
   */
  async updateEnrollment(id: string, enrollment: Partial<Enrollment>): Promise<void> {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, id);
      await updateDoc(enrollmentRef, {
        ...enrollment,
        updated: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar inscrição:', error);
      throw error;
    }
  }

  /**
   * Busca uma inscrição pelo ID
   */
  async getEnrollment(id: string): Promise<Enrollment | null> {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, id);
      const enrollmentDoc = await getDoc(enrollmentRef);

      if (enrollmentDoc.exists()) {
        return {
          id: enrollmentDoc.id,
          ...enrollmentDoc.data()
        } as Enrollment;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar inscrição:', error);
      throw error;
    }
  }

  /**
   * Lista inscrições com filtros
   */
  async listEnrollments(filters?: {
    studentId?: string;
    instructorId?: string;
    activityId?: string;
    status?: EnrollmentStatus;
  }): Promise<Enrollment[]> {
    try {
      let q = collection(db, this.enrollmentsCollection);

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
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      throw error;
    }
  }

  /**
   * Escuta inscrições em tempo real
   */
  subscribeToEnrollments(callback: (enrollments: Enrollment[]) => void, filters?: {
    studentId?: string;
    instructorId?: string;
    activityId?: string;
    status?: EnrollmentStatus;
  }) {
    let q = collection(db, this.enrollmentsCollection);

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

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      q = query(q, ...constraints, orderBy('created', 'desc'));
    } else {
      q = query(q, orderBy('created', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const enrollments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];

      callback(enrollments);
    });
  }

  /**
   * Busca inscrições de um aluno
   */
  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      const q = query(
        collection(db, this.enrollmentsCollection),
        where('studentId', '==', studentId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao buscar inscrições do aluno:', error);
      throw error;
    }
  }

  /**
   * Busca inscrições de um instrutor
   */
  async getInstructorEnrollments(instructorId: string): Promise<Enrollment[]> {
    try {
      const q = query(
        collection(db, this.enrollmentsCollection),
        where('instructorId', '==', instructorId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao buscar inscrições do instrutor:', error);
      throw error;
    }
  }

  /**
   * Busca inscrições de uma atividade
   */
  async getActivityEnrollments(activityId: string): Promise<Enrollment[]> {
    try {
      const q = query(
        collection(db, this.enrollmentsCollection),
        where('activityId', '==', activityId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao buscar inscrições da atividade:', error);
      throw error;
    }
  }

  /**
   * Atualiza status da inscrição
   */
  async updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<void> {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, id);
      await updateDoc(enrollmentRef, {
        status,
        updated: serverTimestamp()
      });

      // Notificar o aluno sobre a mudança de status
      const enrollment = await this.getEnrollment(id);
      if (enrollment) {
        await notificationService.createStatusNotification(
          enrollment.studentId,
          enrollment.instructorName,
          enrollment.activityName,
          status,
          id
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status da inscrição:', error);
      throw error;
    }
  }

  /**
   * Deleta uma inscrição
   */
  async deleteEnrollment(id: string): Promise<void> {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, id);
      await enrollmentRef.delete();
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      throw error;
    }
  }

  /**
   * Registra uma nova transação financeira
   */
  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    try {
      const transactionRef = await addDoc(collection(db, this.transactionsCollection), {
        ...transactionData,
        createdAt: Timestamp.now()
      });

      return transactionRef.id;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  }

  /**
   * Atualiza informações de presença
   */
  async updateAttendance(
    enrollmentId: string,
    attendance: { present: boolean; date: Date | string; notes?: string }
  ): Promise<void> {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, enrollmentId);
      const enrollmentSnap = await getDoc(enrollmentRef);

      if (!enrollmentSnap.exists()) {
        throw new Error('Matrícula não encontrada');
      }

      const currentAttendance = enrollmentSnap.data().attendance || [];

      await updateDoc(enrollmentRef, {
        attendance: [...currentAttendance, attendance],
        updated: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar presença:', error);
      throw error;
    }
  }

  /**
   * Observa matrículas em tempo real para um instrutor com tratamento de erros
   */
  subscribeToInstructorEnrollments(
    instructorId: string,
    onUpdate: (enrollments: Enrollment[]) => void
  ) {
    try {
      const q = query(
        collection(db, this.enrollmentsCollection),
        where('instructorId', '==', instructorId),
        orderBy('created', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const enrollments: Enrollment[] = [];
          snapshot.forEach((doc) => {
            enrollments.push({
              id: doc.id,
              ...doc.data()
            } as Enrollment);
          });
          onUpdate(enrollments);
        },
        (error) => {
          console.error('Error in enrollment subscription:', error);
          // Return empty array on error to prevent UI from breaking
          onUpdate([]);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up enrollment subscription:', error);
      // Return a no-op unsubscribe function
      return () => {};
    }
  }

  /**
   * Calcula resumo financeiro do instrutor
   */
  async getInstructorFinancialSummary(instructorId: string): Promise<InstructorFinancialSummary> {
    try {
      // Buscar todas as matrículas pagas do instrutor
      const paidEnrollmentsQuery = query(
        collection(db, this.enrollmentsCollection),
        where('instructorId', '==', instructorId),
        where('paymentInfo.paymentStatus', '==', 'paid')
      );

      // Buscar matrículas pendentes
      const pendingEnrollmentsQuery = query(
        collection(db, this.enrollmentsCollection),
        where('instructorId', '==', instructorId),
        where('paymentInfo.paymentStatus', '==', 'pending')
      );

      const [paidSnapshot, pendingSnapshot] = await Promise.all([
        getDocs(paidEnrollmentsQuery),
        getDocs(pendingEnrollmentsQuery)
      ]);

      const summary: InstructorFinancialSummary = {
        totalEarnings: 0,
        pendingAmount: 0,
        periodEarnings: [],
        commissionRate: 0.15,
      };

      // Calcular ganhos totais e por período
      const periodMap = new Map<string, { amount: number; enrollments: number }>();

      paidSnapshot.forEach(doc => {
        const enrollment = doc.data() as Enrollment;
        summary.totalEarnings += enrollment.paymentInfo.instructorAmount;

        // Agrupar por mês
        const date = new Date(enrollment.paymentInfo.paymentDate);
        const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        const periodData = periodMap.get(period) || { amount: 0, enrollments: 0 };
        periodData.amount += enrollment.paymentInfo.instructorAmount;
        periodData.enrollments += 1;
        periodMap.set(period, periodData);
      });

      // Calcular valor pendente
      pendingSnapshot.forEach(doc => {
        const enrollment = doc.data() as Enrollment;
        summary.pendingAmount += enrollment.paymentInfo.instructorAmount;
      });

      // Converter mapa de períodos para array
      summary.periodEarnings = Array.from(periodMap.entries())
        .map(([period, data]) => ({
          period,
          amount: data.amount,
          enrollments: data.enrollments
        }))
        .sort((a, b) => b.period.localeCompare(a.period));

      // Adicionar próximo pagamento se houver valor pendente
      if (summary.pendingAmount > 0) {
        const nextPayoutDate = new Date();
        nextPayoutDate.setDate(nextPayoutDate.getDate() + 7); // Pagamento em 7 dias

        summary.nextPayout = {
          amount: summary.pendingAmount,
          estimatedDate: nextPayoutDate
        };
      }

      return summary;
    } catch (error) {
      console.error('Erro ao calcular resumo financeiro:', error);
      throw error;
    }
  }

  // Atualizar uma matrícula
  async updateEnrollment(id: string, enrollment: Partial<Enrollment>) {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, id);
      const enrollmentDoc = await getDoc(enrollmentRef);

      if (enrollmentDoc.exists()) {
        const currentEnrollment = enrollmentDoc.data() as Enrollment;

        // Se o status mudou para cancelado, atualizar contagem de alunos
        if (enrollment.status === 'cancelled' && currentEnrollment.status !== 'cancelled') {
          await activityService.updateEnrolledStudents(currentEnrollment.activityId, -1);
        }

        // Atualizar a matrícula
        await updateDoc(enrollmentRef, {
          ...enrollment,
          updated: serverTimestamp()
        });

        // Notificar o instrutor sobre a atualização
        if (enrollment.status) {
          await notificationService.createEnrollmentNotification(
            currentEnrollment.instructorId,
            currentEnrollment.studentName,
            currentEnrollment.activityName,
            id
          );
        }

        // Criar notificação para o aluno sobre a mudança de status
        if (enrollment.status && enrollment.status !== currentEnrollment.status) {
          await notificationService.createEnrollmentStatusNotification(
            currentEnrollment.studentId,
            currentEnrollment.activityName,
            enrollment.status,
            id
          );
        }

        // Criar notificação para o aluno sobre a mudança de status de pagamento
        if (enrollment.paymentInfo?.paymentStatus &&
            enrollment.paymentInfo.paymentStatus !== currentEnrollment.paymentInfo.paymentStatus) {
          await notificationService.createPaymentNotification(
            currentEnrollment.studentId,
            currentEnrollment.paymentInfo.amount,
            enrollment.paymentInfo.paymentStatus,
            id
          );
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar matrícula:', error);
      throw error;
    }
  }

  // Excluir uma matrícula
  async deleteEnrollment(id: string) {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, id);
      const enrollmentDoc = await getDoc(enrollmentRef);

      if (enrollmentDoc.exists()) {
        const enrollment = enrollmentDoc.data() as Enrollment;

        // Atualizar contagem de alunos na atividade
        if (enrollment.status !== 'cancelled') {
          await activityService.updateEnrolledStudents(enrollment.activityId, -1);
        }

        await deleteDoc(enrollmentRef);
      }
    } catch (error) {
      console.error('Erro ao excluir matrícula:', error);
      throw error;
    }
  }

  // Listar matrículas
  async listEnrollments(filters?: {
    activityId?: string;
    studentId?: string;
    instructorId?: string;
    status?: Enrollment['status'];
  }) {
    try {
      let q = collection(db, this.enrollmentsCollection);

      if (filters) {
        const constraints = [];

        if (filters.activityId) {
          constraints.push(where('activityId', '==', filters.activityId));
        }

        if (filters.studentId) {
          constraints.push(where('studentId', '==', filters.studentId));
        }

        if (filters.instructorId) {
          constraints.push(where('instructorId', '==', filters.instructorId));
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
        ...doc.data(),
        created: doc.data().created.toDate(),
        updated: doc.data().updated.toDate(),
        paymentDate: doc.data().paymentInfo?.paymentDate?.toDate()
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao listar matrículas:', error);
      throw error;
    }
  }

  // Atualizar status de pagamento
  async updatePaymentStatus(id: string, paymentStatus: Enrollment['paymentStatus']) {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, id);
      await updateDoc(enrollmentRef, {
        paymentStatus,
        paymentDate: paymentStatus === 'paid' ? Timestamp.now() : null,
        updated: Timestamp.now()
      });

      // Criar notificação para o aluno sobre a mudança de status de pagamento
      await notificationService.createPaymentNotification(
        enrollmentRef.data().studentId,
        enrollmentRef.data().paymentInfo.amount,
        paymentStatus,
        id
      );
    } catch (error) {
      console.error('Erro ao atualizar status de pagamento:', error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService();
