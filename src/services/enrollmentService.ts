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
  writeBatch,
  QueryConstraint,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { Enrollment, EnrollmentStatus } from '@/types';
import { notificationService } from './notificationService';
import { activityService } from './activityService';

class EnrollmentService {
  private get db() {
    return getFirebaseInstance().db;
  }
  private enrollmentsCollection = 'enrollments';

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
   * Cria uma nova inscrição com tratamento de erros e retries
   */
  async createEnrollment(
    enrollment: Omit<Enrollment, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      // Create enrollment document
      const enrollmentRef = doc(collection(this.db, this.enrollmentsCollection));
      const batch = writeBatch(this.db);

      // Add enrollment to batch
      batch.set(enrollmentRef, {
        ...enrollment,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Commit batch with retries
      await this.commitWithRetry(batch);

      // After successful enrollment creation, try to update related data
      try {
        await Promise.all([
          activityService.updateEnrolledStudents(enrollment.activityId, 1),
          notificationService.createNotification({
            type: 'enrollment',
            userId: enrollment.instructorId,
            title: 'Nova Inscrição',
            message: `${enrollment.studentName} se inscreveu em ${enrollment.activityName}`,
            data: {
              enrollmentId: enrollmentRef.id,
              activityId: enrollment.activityId,
            },
          }),
        ]).catch(error => {
          console.error('Erro ao atualizar dados relacionados:', error);
          // Don't throw - enrollment was created successfully
        });
      } catch (error) {
        console.error('Erro ao atualizar dados relacionados:', error);
        // Don't throw - enrollment was created successfully
      }

      return enrollmentRef.id;
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      throw error;
    }
  }

  /**
   * Confirma uma inscrição após pagamento
   */
  async confirmEnrollment(id: string): Promise<void> {
    try {
      const enrollmentRef = doc(this.db, this.enrollmentsCollection, id);
      const enrollmentSnap = await getDoc(enrollmentRef);

      if (!enrollmentSnap.exists()) {
        throw new Error('Inscrição não encontrada');
      }

      const enrollment = enrollmentSnap.data() as Enrollment;

      // Only confirm if pending
      if (enrollment.status === 'pending') {
        await updateDoc(enrollmentRef, {
          status: 'confirmed',
          updatedAt: serverTimestamp(),
          'paymentInfo.paymentStatus': 'paid',
          'paymentInfo.paymentDate': serverTimestamp(),
        });

        // Notify instructor
        await notificationService.createNotification({
          type: 'enrollment',
          userId: enrollment.instructorId,
          title: 'Matrícula Confirmada',
          message: `${enrollment.studentName} confirmou a matrícula em ${enrollment.activityName}`,
          data: {
            enrollmentId: id,
            activityId: enrollment.activityId,
          },
        });
      }
    } catch (error) {
      console.error('Erro ao confirmar inscrição:', error);
      throw error;
    }
  }

  /**
   * Cancela uma inscrição
   */
  async cancelEnrollment(id: string): Promise<void> {
    try {
      const enrollmentRef = doc(this.db, this.enrollmentsCollection, id);
      const enrollmentSnap = await getDoc(enrollmentRef);

      if (!enrollmentSnap.exists()) {
        throw new Error('Inscrição não encontrada');
      }

      const enrollment = enrollmentSnap.data() as Enrollment;

      await updateDoc(enrollmentRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
        'paymentInfo.paymentStatus': 'refunded',
      });

      // Atualizar contagem de alunos na atividade
      await activityService.updateEnrolledStudents(enrollment.activityId, -1);

      // Notificar instrutor
      await notificationService.createNotification({
        type: 'enrollment',
        userId: enrollment.instructorId,
        title: 'Matrícula Cancelada',
        message: `${enrollment.studentName} cancelou a matrícula em ${enrollment.activityName}`,
        data: {
          enrollmentId: id,
          activityId: enrollment.activityId,
        },
      });
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      throw error;
    }
  }

  /**
   * Busca inscrições de um aluno
   */
  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      const q = query(
        collection(this.db, this.enrollmentsCollection),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao buscar inscrições do aluno:', error);
      throw error;
    }
  }

  /**
   * Busca inscrições de uma atividade
   */
  async getActivityEnrollments(activityId: string): Promise<Enrollment[]> {
    try {
      const q = query(
        collection(this.db, this.enrollmentsCollection),
        where('activityId', '==', activityId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao buscar inscrições da atividade:', error);
      throw error;
    }
  }

  /**
   * Lista todas as inscrições com filtros opcionais
   */
  async listEnrollments(filters?: {
    studentId?: string;
    instructorId?: string;
    activityId?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
  }): Promise<Enrollment[]> {
    try {
      const constraints: any[] = [];

      if (filters?.studentId) {
        constraints.push(where('studentId', '==', filters.studentId));
      }

      if (filters?.instructorId) {
        constraints.push(where('instructorId', '==', filters.instructorId));
      }

      if (filters?.activityId) {
        constraints.push(where('activityId', '==', filters.activityId));
      }

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      const q = query(
        collection(this.db, this.enrollmentsCollection),
        ...constraints,
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Enrollment[];
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      throw error;
    }
  }

  /**
   * Escuta inscrições em tempo real
   */
  subscribeToEnrollments(
    callback: (enrollments: Enrollment[]) => void,
    filters?: {
      studentId?: string;
      instructorId?: string;
      activityId?: string;
      status?: 'pending' | 'confirmed' | 'cancelled';
    }
  ) {
    const constraints: any[] = [];

    if (filters?.studentId) {
      constraints.push(where('studentId', '==', filters.studentId));
    }

    if (filters?.instructorId) {
      constraints.push(where('instructorId', '==', filters.instructorId));
    }

    if (filters?.activityId) {
      constraints.push(where('activityId', '==', filters.activityId));
    }

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    const q = query(
      collection(this.db, this.enrollmentsCollection),
      ...constraints,
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, snapshot => {
      const enrollments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Enrollment[];
      callback(enrollments);
    });
  }

  async updateEnrollment(
    id: string,
    enrollmentData: Partial<Enrollment>
  ): Promise<void> {
    try {
      const enrollmentRef = doc(this.db, this.enrollmentsCollection, id);
      const enrollmentDoc = await getDoc(enrollmentRef);

      if (!enrollmentDoc.exists()) {
        throw new Error('Inscrição não encontrada');
      }

      await updateDoc(enrollmentRef, {
        ...enrollmentData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar inscrição:', error);
      throw error;
    }
  }

  async getEnrollment(id: string): Promise<Enrollment | null> {
    try {
      const enrollmentRef = doc(this.db, this.enrollmentsCollection, id);
      const enrollmentDoc = await getDoc(enrollmentRef);

      if (!enrollmentDoc.exists()) {
        return null;
      }

      const data = enrollmentDoc.data();
      return {
        id: enrollmentDoc.id,
        activityId: data.activityId,
        studentId: data.studentId,
        studentName: data.studentName,
        instructorId: data.instructorId,
        instructorName: data.instructorName,
        activityName: data.activityName,
        status: data.status,
        paymentInfo: data.paymentInfo,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } catch (error) {
      console.error('Erro ao buscar inscrição:', error);
      throw error;
    }
  }

  async listStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      const enrollmentsRef = collection(this.db, this.enrollmentsCollection);
      const q = query(
        enrollmentsRef,
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          activityId: data.activityId,
          studentId: data.studentId,
          studentName: data.studentName,
          instructorId: data.instructorId,
          instructorName: data.instructorName,
          activityName: data.activityName,
          status: data.status,
          paymentInfo: data.paymentInfo,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
    } catch (error) {
      console.error('Erro ao listar inscrições do aluno:', error);
      throw error;
    }
  }

  async listInstructorEnrollments(instructorId: string): Promise<Enrollment[]> {
    try {
      const enrollmentsRef = collection(this.db, this.enrollmentsCollection);
      const q = query(
        enrollmentsRef,
        where('instructorId', '==', instructorId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          activityId: data.activityId,
          studentId: data.studentId,
          studentName: data.studentName,
          instructorId: data.instructorId,
          instructorName: data.instructorName,
          activityName: data.activityName,
          status: data.status,
          paymentInfo: data.paymentInfo,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
    } catch (error) {
      console.error('Erro ao listar inscrições do instrutor:', error);
      throw error;
    }
  }

  async deleteEnrollment(id: string): Promise<void> {
    try {
      const enrollmentRef = doc(this.db, this.enrollmentsCollection, id);
      const enrollmentDoc = await getDoc(enrollmentRef);

      if (!enrollmentDoc.exists()) {
        throw new Error('Inscrição não encontrada');
      }

      const data = enrollmentDoc.data();
      await deleteDoc(enrollmentRef);

      // Atualizar contagem de alunos na atividade
      await activityService.updateEnrolledStudents(data.activityId, -1);
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      throw error;
    }
  }

  async updateActivityEnrollment(activityId: string, increment: number): Promise<void> {
    try {
      const activityRef = doc(this.db, 'activities', activityId);
      const activityDoc = await getDoc(activityRef);

      if (!activityDoc.exists()) {
        throw new Error('Atividade não encontrada');
      }

      const currentEnrolled = activityDoc.data().enrolledStudents || 0;
      const newEnrolled = currentEnrolled + increment;

      if (newEnrolled < 0) {
        throw new Error('Número de alunos não pode ser negativo');
      }

      await updateDoc(activityRef, {
        enrolledStudents: newEnrolled,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar número de alunos:', error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService();
