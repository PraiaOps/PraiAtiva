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
  serverTimestamp
} from 'firebase/firestore';
import { Rating } from '@/types';
import { notificationService } from './notificationService';

class RatingService {
  private ratingsCollection = 'ratings';

  /**
   * Cria uma nova avaliação
   */
  async createRating(rating: Omit<Rating, 'id'>): Promise<string> {
    try {
      const ratingRef = await addDoc(collection(db, this.ratingsCollection), {
        ...rating,
        created: serverTimestamp(),
        updated: serverTimestamp()
      });

      // Notificar o instrutor sobre a nova avaliação
      await notificationService.createRatingNotification(
        rating.instructorId,
        rating.studentName,
        rating.activityName,
        ratingRef.id
      );

      return ratingRef.id;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma avaliação existente
   */
  async updateRating(id: string, rating: Partial<Rating>): Promise<void> {
    try {
      const ratingRef = doc(db, this.ratingsCollection, id);
      await updateDoc(ratingRef, {
        ...rating,
        updated: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      throw error;
    }
  }

  /**
   * Busca uma avaliação pelo ID
   */
  async getRating(id: string): Promise<Rating | null> {
    try {
      const ratingRef = doc(db, this.ratingsCollection, id);
      const ratingDoc = await getDoc(ratingRef);
      
      if (ratingDoc.exists()) {
        return {
          id: ratingDoc.id,
          ...ratingDoc.data()
        } as Rating;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      throw error;
    }
  }

  /**
   * Lista avaliações com filtros
   */
  async listRatings(filters?: {
    instructorId?: string;
    studentId?: string;
    activityId?: string;
    rating?: number;
  }): Promise<Rating[]> {
    try {
      let q = collection(db, this.ratingsCollection);
      
      if (filters) {
        const constraints = [];
        
        if (filters.instructorId) {
          constraints.push(where('instructorId', '==', filters.instructorId));
        }
        
        if (filters.studentId) {
          constraints.push(where('studentId', '==', filters.studentId));
        }
        
        if (filters.activityId) {
          constraints.push(where('activityId', '==', filters.activityId));
        }
        
        if (filters.rating) {
          constraints.push(where('rating', '==', filters.rating));
        }
        
        q = query(q, ...constraints, orderBy('created', 'desc'));
      } else {
        q = query(q, orderBy('created', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Rating[];
    } catch (error) {
      console.error('Erro ao listar avaliações:', error);
      throw error;
    }
  }

  /**
   * Escuta avaliações em tempo real
   */
  subscribeToRatings(callback: (ratings: Rating[]) => void, filters?: {
    instructorId?: string;
    studentId?: string;
    activityId?: string;
    rating?: number;
  }) {
    let q = collection(db, this.ratingsCollection);
    
    if (filters) {
      const constraints = [];
      
      if (filters.instructorId) {
        constraints.push(where('instructorId', '==', filters.instructorId));
      }
      
      if (filters.studentId) {
        constraints.push(where('studentId', '==', filters.studentId));
      }
      
      if (filters.activityId) {
        constraints.push(where('activityId', '==', filters.activityId));
      }
      
      if (filters.rating) {
        constraints.push(where('rating', '==', filters.rating));
      }
      
      q = query(q, ...constraints, orderBy('created', 'desc'));
    } else {
      q = query(q, orderBy('created', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const ratings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Rating[];
      
      callback(ratings);
    });
  }

  /**
   * Busca avaliações de um instrutor
   */
  async getInstructorRatings(instructorId: string): Promise<Rating[]> {
    try {
      const q = query(
        collection(db, this.ratingsCollection),
        where('instructorId', '==', instructorId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Rating[];
    } catch (error) {
      console.error('Erro ao buscar avaliações do instrutor:', error);
      throw error;
    }
  }

  /**
   * Busca avaliações de um aluno
   */
  async getStudentRatings(studentId: string): Promise<Rating[]> {
    try {
      const q = query(
        collection(db, this.ratingsCollection),
        where('studentId', '==', studentId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Rating[];
    } catch (error) {
      console.error('Erro ao buscar avaliações do aluno:', error);
      throw error;
    }
  }

  /**
   * Busca avaliações de uma atividade
   */
  async getActivityRatings(activityId: string): Promise<Rating[]> {
    try {
      const q = query(
        collection(db, this.ratingsCollection),
        where('activityId', '==', activityId),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Rating[];
    } catch (error) {
      console.error('Erro ao buscar avaliações da atividade:', error);
      throw error;
    }
  }

  /**
   * Calcula média de avaliações
   */
  async getAverageRating(filters?: {
    instructorId?: string;
    activityId?: string;
  }): Promise<{
    average: number;
    total: number;
    ratings: Rating[];
  }> {
    try {
      let q = collection(db, this.ratingsCollection);
      const constraints = [];
      
      if (filters?.instructorId) {
        constraints.push(where('instructorId', '==', filters.instructorId));
      }
      
      if (filters?.activityId) {
        constraints.push(where('activityId', '==', filters.activityId));
      }
      
      q = query(q, ...constraints);
      
      const snapshot = await getDocs(q);
      const ratings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Rating[];

      if (ratings.length === 0) {
        return {
          average: 0,
          total: 0,
          ratings: []
        };
      }

      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const average = sum / ratings.length;

      return {
        average,
        total: ratings.length,
        ratings
      };
    } catch (error) {
      console.error('Erro ao calcular média de avaliações:', error);
      throw error;
    }
  }
}

export const ratingService = new RatingService(); 