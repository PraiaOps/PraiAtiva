import { db } from '../config/firebase';
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
  getDoc,
  increment,
  getDocs,
  serverTimestamp,
  limit,
  startAfter,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { notificationService } from './notificationService';
import { Activity, ActivityType, ActivityStatus } from '../types';

class ActivityService {
  private activitiesCollection = 'activities';

  /**
   * Cria uma nova atividade
   */
  async createActivity(activity: Omit<Activity, 'id'>): Promise<string> {
    try {
      const activityRef = await addDoc(collection(db, this.activitiesCollection), {
        ...activity,
        price: Number(activity.price),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active'
      });

      return activityRef.id;
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma atividade
   */
  async updateActivity(id: string, activity: Partial<Activity>): Promise<void> {
    try {
      const activityRef = doc(db, this.activitiesCollection, id);
      const updateData = {
        ...activity,
        updatedAt: Date.now()
      };

      if (activity.price !== undefined) {
        updateData.price = Number(activity.price);
      }

      await updateDoc(activityRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      throw error;
    }
  }

  /**
   * Atualiza o número de alunos matriculados
   */
  async updateEnrolledStudents(activityId: string, incrementValue: number): Promise<void> {
    try {
      const activityRef = doc(db, this.activitiesCollection, activityId);
      await updateDoc(activityRef, {
        enrolledStudents: increment(incrementValue)
      });
    } catch (error) {
      console.error('Erro ao atualizar número de alunos:', error);
      throw error;
    }
  }

  /**
   * Busca uma atividade pelo ID
   */
  async getActivity(id: string): Promise<Activity | null> {
    try {
      const activityRef = doc(db, this.activitiesCollection, id);
      const activityDoc = await getDoc(activityRef);

      if (activityDoc.exists()) {
        return {
          id: activityDoc.id,
          ...activityDoc.data()
        } as Activity;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
      throw error;
    }
  }

  /**
   * Lista atividades com filtros
   */
  async listActivities(filters?: {
    instructorId?: string;
    status?: ActivityStatus;
    category?: string;
    location?: string;
    price?: {
      min?: number;
      max?: number;
    };
  }): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, this.activitiesCollection);
      const constraints = [];

      if (filters?.instructorId) {
        constraints.push(where('instructorId', '==', filters.instructorId));
      }

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }

      if (filters?.location) {
        constraints.push(where('location', '==', filters.location));
      }

      if (filters?.price?.min) {
        constraints.push(where('price', '>=', filters.price.min));
      }

      if (filters?.price?.max) {
        constraints.push(where('price', '<=', filters.price.max));
      }

      const q = query(activitiesRef, ...constraints, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        price: Number(doc.data().price),
        status: doc.data().status || 'active',
        instructorId: doc.data().instructorId || 'system',
        instructorName: doc.data().instructorName || doc.data().entrepreneur || 'Sistema'
      })) as Activity[];

      console.log('Atividades carregadas:', activities.map(a => ({ id: a.id, name: a.name })));
      return activities;
    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      throw error;
    }
  }

  /**
   * Escuta atividades em tempo real
   */
  subscribeToActivities(callback: (activities: Activity[]) => void, filters?: {
    instructorId?: string;
    status?: ActivityStatus;
    category?: string;
    location?: string;
    price?: {
      min?: number;
      max?: number;
    };
  }) {
    const activitiesRef = collection(db, this.activitiesCollection);
    const constraints = [];

    if (filters?.instructorId) {
      constraints.push(where('instructorId', '==', filters.instructorId));
    }

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters?.location) {
      constraints.push(where('location', '==', filters.location));
    }

    if (filters?.price?.min) {
      constraints.push(where('price', '>=', filters.price.min));
    }

    if (filters?.price?.max) {
      constraints.push(where('price', '<=', filters.price.max));
    }

    const q = query(activitiesRef, ...constraints, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        price: Number(doc.data().price),
        status: doc.data().status || 'active',
        instructorId: doc.data().instructorId || 'system',
        instructorName: doc.data().instructorName || doc.data().entrepreneur || 'Sistema'
      })) as Activity[];

      callback(activities);
    });
  }

  /**
   * Busca atividades de um instrutor
   */
  async getInstructorActivities(instructorId: string): Promise<Activity[]> {
    try {
      const q = query(
        collection(db, this.activitiesCollection),
        where('instructorId', '==', instructorId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
    } catch (error) {
      console.error('Erro ao buscar atividades do instrutor:', error);
      throw error;
    }
  }

  /**
   * Busca atividades por categoria
   */
  async getActivitiesByCategory(category: string): Promise<Activity[]> {
    try {
      const q = query(
        collection(db, this.activitiesCollection),
        where('category', '==', category),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
    } catch (error) {
      console.error('Erro ao buscar atividades por categoria:', error);
      throw error;
    }
  }

  /**
   * Busca atividades por localização
   */
  async getActivitiesByLocation(location: string): Promise<Activity[]> {
    try {
      const q = query(
        collection(db, this.activitiesCollection),
        where('location', '==', location),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
    } catch (error) {
      console.error('Erro ao buscar atividades por localização:', error);
      throw error;
    }
  }

  /**
   * Atualiza status da atividade
   */
  async updateActivityStatus(id: string, status: ActivityStatus): Promise<void> {
    try {
      const activityRef = doc(db, this.activitiesCollection, id);
      await updateDoc(activityRef, {
        status,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar status da atividade:', error);
      throw error;
    }
  }

  /**
   * Deleta uma atividade
   */
  async deleteActivity(id: string): Promise<void> {
    try {
      const activityRef = doc(db, this.activitiesCollection, id);
      await deleteDoc(activityRef);
    } catch (error) {
      console.error('Erro ao deletar atividade:', error);
      throw error;
    }
  }

  /**
   * Atualiza todas as atividades existentes com o instructorId do paulo@hotmail.com
   */
  async updateExistingActivities() {
    try {
      const q = query(collection(db, this.activitiesCollection));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);

      snapshot.docs.forEach(doc => {
        const activityRef = doc.ref;
        batch.update(activityRef, {
          instructorId: 'paulo@hotmail.com',
          instructorName: 'Paulo',
          updatedAt: Date.now()
        });
      });

      await batch.commit();
      console.log('Atividades atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar atividades:', error);
      throw error;
    }
  }

  async createEnrollment(enrollment: {
    activityId: string;
    studentId: string;
    studentName: string;
    status: 'active' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    paymentMethod: 'pix' | 'credit_card';
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    try {
      const enrollmentRef = doc(collection(db, 'enrollments'));
      await setDoc(enrollmentRef, {
        ...enrollment,
        id: enrollmentRef.id
      });

      // Atualizar contador de alunos matriculados na atividade
      const activityRef = doc(db, this.activitiesCollection, enrollment.activityId);
      await updateDoc(activityRef, {
        enrolledStudents: increment(1)
      });

      return enrollmentRef.id;
    } catch (error) {
      console.error('Erro ao criar matrícula:', error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();
