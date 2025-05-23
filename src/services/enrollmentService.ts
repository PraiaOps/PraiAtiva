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
  Timestamp
} from 'firebase/firestore';
import { 
  Enrollment,
  EnrollmentStatus,
  Activity,
  User,
  Transaction,
  InstructorFinancialSummary
} from '@/types';

class EnrollmentService {
  private enrollmentsCollection = 'enrollments';
  private transactionsCollection = 'transactions';

  /**
   * Cria uma nova matrícula para o fluxo de teste
   */
  async createEnrollment(
    studentData: User,
    activityData: Activity,
    instructorId: string
  ): Promise<string> {
    try {
      const now = new Date();
      const amount = 50.00; // Valor fixo para teste
      const commission = amount * 0.15; // 15% de comissão
      const instructorAmount = amount - commission;

      const enrollmentData: Omit<Enrollment, 'id'> = {
        studentId: studentData.id,
        instructorId: instructorId,
        activityId: activityData.id,
        created: now,
        updated: now,
        status: 'pending',
        paymentInfo: {
          amount,
          commission,
          instructorAmount,
          paymentMethod: 'pix',
          paymentStatus: 'pending',
          paymentDate: now
        },
        attendance: [],
        studentDetails: {
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          photo: studentData.photoURL
        },
        activityDetails: {
          name: activityData.name,
          type: activityData.type,
          location: activityData.location.meetingPoint,
          schedule: {
            date: now,
            startTime: '09:00',
            endTime: '10:00'
          }
        }
      };

      const enrollmentRef = await addDoc(
        collection(db, this.enrollmentsCollection), 
        {
          ...enrollmentData,
          created: serverTimestamp(),
          updated: serverTimestamp()
        }
      );

      return enrollmentRef.id;
    } catch (error) {
      console.error('Erro ao criar matrícula:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de uma matrícula
   */
  async updateEnrollmentStatus(
    enrollmentId: string, 
    status: EnrollmentStatus,
    paymentStatus: 'pending' | 'paid' | 'refunded' = 'pending'
  ): Promise<void> {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, enrollmentId);
      await updateDoc(enrollmentRef, {
        status,
        'paymentInfo.paymentStatus': paymentStatus,
        updated: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar status da matrícula:', error);
      throw error;
    }
  }

  /**
   * Busca uma matrícula específica
   */
  async getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
    try {
      const enrollmentRef = doc(db, this.enrollmentsCollection, enrollmentId);
      const enrollmentSnap = await getDoc(enrollmentRef);

      if (!enrollmentSnap.exists()) {
        return null;
      }

      return {
        id: enrollmentSnap.id,
        ...enrollmentSnap.data()
      } as Enrollment;
    } catch (error) {
      console.error('Erro ao buscar matrícula:', error);
      throw error;
    }
  }

  /**
   * Lista todas as matrículas de um aluno
   */
  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      const q = query(
        collection(db, this.enrollmentsCollection),
        where('studentId', '==', studentId),
        orderBy('created', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao buscar matrículas do aluno:', error);
      throw error;
    }
  }

  /**
   * Lista todas as matrículas de um instrutor
   */
  async getInstructorEnrollments(instructorId: string): Promise<Enrollment[]> {
    try {
      const q = query(
        collection(db, this.enrollmentsCollection),
        where('instructorId', '==', instructorId),
        orderBy('created', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao buscar matrículas do instrutor:', error);
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
}

export const enrollmentService = new EnrollmentService();
