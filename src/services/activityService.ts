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
  setDoc,
} from 'firebase/firestore';

import { getFunctions, httpsCallable } from 'firebase/functions';

// Importe a definição do tipo Activity de um arquivo centralizado
// (Recomendado para consistência em todo o projeto)
import { Activity, ActivityStatus } from '../types'; // Assumindo que você tem um src/types/index.ts com essas definições


export class ActivityService {
  private activitiesCollection = 'activities';
  private functions = getFunctions();

  /**
   * Cria uma nova atividade
   */
  async createActivity(activity: Omit<Activity, 'id'>): Promise<string> {
    try {
      // Garante que horarios é um array e tem as propriedades necessárias
      const horarios = Array.isArray(activity.horarios)
        ? activity.horarios
        : [];
      const validatedHorarios = horarios.map(h => ({
        periodo: h.periodo || '',
        horario: h.horario || '',
        local: h.local || 'areia',
        limiteAlunos: h.limiteAlunos || 0,
        alunosMatriculados: h.alunosMatriculados || 0,
        diaSemana: h.diaSemana || '',
      }));

      const activityRef = await addDoc(
        collection(db, this.activitiesCollection),
        {
          ...activity,
          horarios: validatedHorarios,
          price: Number(activity.price),
          enrolledStudents: 0,
          rating: 0,
          reviews: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: activity.status || 'active', // Usar o status fornecido se existir, senão default
        }
      );

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
      const updateData: any = { // Usar any temporariamente para flexibilidade na atualização
        ...activity,
        updatedAt: serverTimestamp(), // Usar serverTimestamp
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
  async updateEnrolledStudents(
    activityId: string,
    delta: number
  ): Promise<void> {
    try {
      const activityRef = doc(db, this.activitiesCollection, activityId);
      const activityDoc = await getDoc(activityRef);

      if (!activityDoc.exists()) {
        throw new Error('Atividade não encontrada');
      }

      // Não precisamos buscar a atividade inteira apenas para atualizar um campo
      const batch = writeBatch(db);

      // Atualiza a contagem geral da atividade
      batch.update(activityRef, {
        enrolledStudents: increment(delta), // Corrigido para usar enrolledStudents
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
    } catch (error) {
      console.error('Erro ao atualizar número de alunos:', error);
      // Continue mesmo se houver erro, já que o número de alunos pode ser atualizado depois
      // throw error;
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
        const data = activityDoc.data();

        // Ensure horarios is always an array with valid data
        const horarios = Array.isArray(data.horarios) ? data.horarios : [];
        const validatedHorarios = horarios.map(h => ({
          periodo: h.periodo || '',
          horario: h.horario || '',
          local: h.local || 'areia',
          limiteAlunos: h.limiteAlunos || 0,
          alunosMatriculados: h.alunosMatriculados || 0,
          diaSemana: h.diaSemana || '',
        }));

        return {
          id: activityDoc.id,
          ...data,
          horarios: validatedHorarios,
          price: Number(data.price || 0),
          rating: Number(data.rating || 0),
          reviews: Number(data.reviews || 0),
           // Garantir que todas as propriedades do tipo Activity estejam presentes
          image: data.image || '',
          beach: data.beach || '',
          city: data.city || '',
          enrolledStudents: data.enrolledStudents || 0, // Garantir enrolledStudents
          instructorName: data.instructorName || data.entrepreneur || 'Sistema', // Garantir instructorName
          instructorId: data.instructorId || 'system', // Garantir instructorId
          description: data.description || '', // Garantir description
          status: data.status || 'active', // Garantir status
          // Adicionar outras propriedades do tipo Activity conforme necessário
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
    // Adicionar outros filtros conforme a necessidade
  }): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, this.activitiesCollection);
      const constraints: any[] = []; // Usar any[] para flexibilidade com query constraints

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

      const q = query(
        activitiesRef,
        ...constraints,
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Converter campos para o tipo correto e fornecer fallbacks
        price: Number(doc.data().price || 0),
        status: doc.data().status || 'active',
        instructorId: doc.data().instructorId || 'system',
        instructorName:
          doc.data().instructorName || doc.data().entrepreneur || 'Sistema', // Considerar entrepreneur como fallback para instructorName
        enrolledStudents: doc.data().enrolledStudents || 0, // Adicionar enrolledStudents
        image: doc.data().image || '', // Adicionar image
        beach: doc.data().beach || '', // Adicionar beach
        city: doc.data().city || '', // Adicionar city
        horarios: Array.isArray(doc.data().horarios) ? doc.data().horarios.map((h: any) => ({ // Adicionar e mapear horarios
           periodo: h.periodo || '',
           horario: h.horario || '',
           local: h.local || 'areia',
           limiteAlunos: h.limiteAlunos || 0,
           alunosMatriculados: h.alunosMatriculados || 0,
           diaSemana: h.diaSemana || '',
        })) : [],
        description: doc.data().description || '', // Adicionar description
        rating: Number(doc.data().rating || 0), // Adicionar rating
        reviews: Number(doc.data().reviews || 0), // Adicionar reviews
        // Adicionar outras propriedades conforme a definição do tipo Activity
      })) as Activity[];

      console.log(
        'Atividades carregadas:',
        activities.map(a => ({ id: a.id, name: a.name, status: a.status })) // Incluir status no log
      );
      return activities;
    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      throw error;
    }
  }

  /**
   * Escuta atividades em tempo real
   */
  subscribeToActivities(
    callback: (activities: Activity[]) => void,
    filters?: {
      instructorId?: string;
      status?: ActivityStatus;
      category?: string;
      location?: string;
      price?: {
        min?: number;
        max?: number;
      };
    },
    errorCallback?: (error: any) => void // Adicionar errorCallback
  ): () => void // Retorna a função de unsubscribe
  {
    const activitiesRef = collection(db, this.activitiesCollection);
    const constraints: any[] = []; // Usar any[] para flexibilidade com query constraints

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

    const q = query(
      activitiesRef,
      ...constraints,
      orderBy('createdAt', 'desc') // Ordernar
    );

    return onSnapshot(q, snapshot => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Converter campos para o tipo correto e fornecer fallbacks
        price: Number(doc.data().price || 0),
        status: doc.data().status || 'active',
        instructorId: doc.data().instructorId || 'system',
        instructorName:
          doc.data().instructorName || doc.data().entrepreneur || 'Sistema', // Considerar entrepreneur como fallback para instructorName
        enrolledStudents: doc.data().enrolledStudents || 0, // Adicionar enrolledStudents
        image: doc.data().image || '', // Adicionar image
        beach: doc.data().beach || '', // Adicionar beach
        city: doc.data().city || '', // Adicionar city
         horarios: Array.isArray(doc.data().horarios) ? doc.data().horarios.map((h: any) => ({ // Adicionar e mapear horarios
           periodo: h.periodo || '',
           horario: h.horario || '',
           local: h.local || 'areia',
           limiteAlunos: h.limiteAlunos || 0,
           alunosMatriculados: h.alunosMatriculados || 0,
           diaSemana: h.diaSemana || '',
        })) : [],
        description: doc.data().description || '', // Adicionar description
        rating: Number(doc.data().rating || 0), // Adicionar rating
        reviews: Number(doc.data().reviews || 0), // Adicionar reviews
         // Adicionar outras propriedades conforme a definição do tipo Activity
      })) as Activity[];

      callback(activities);
    }, error => { // Passar errorCallback para onSnapshot
       if (errorCallback) {
           errorCallback(error);
       } else {
           console.error('Erro na subscrição de atividades:', error); // Log fallback
       }
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
       const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Converter campos para o tipo correto e fornecer fallbacks
        price: Number(doc.data().price || 0),
        status: doc.data().status || 'active',
        instructorId: doc.data().instructorId || 'system',
        instructorName:
          doc.data().instructorName || doc.data().entrepreneur || 'Sistema', // Considerar entrepreneur como fallback para instructorName
        enrolledStudents: doc.data().enrolledStudents || 0, // Adicionar enrolledStudents
        image: doc.data().image || '', // Adicionar image
        beach: doc.data().beach || '', // Adicionar beach
        city: doc.data().city || '', // Adicionar city
        horarios: Array.isArray(doc.data().horarios) ? doc.data().horarios.map((h: any) => ({ // Adicionar e mapear horarios
           periodo: h.periodo || '',
           horario: h.horario || '',
           local: h.local || 'areia',
           limiteAlunos: h.limiteAlunos || 0,
           alunosMatriculados: h.alunosMatriculados || 0,
           diaSemana: h.diaSemana || '',
        })) : [],
        description: doc.data().description || '', // Adicionar description
        rating: Number(doc.data().rating || 0), // Adicionar rating
        reviews: Number(doc.data().reviews || 0), // Adicionar reviews
        // Adicionar outras propriedades conforme a definição do tipo Activity
      })) as Activity[];

      return activities;
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
       const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Converter campos para o tipo correto e fornecer fallbacks
        price: Number(doc.data().price || 0),
        status: doc.data().status || 'active',
        instructorId: doc.data().instructorId || 'system',
        instructorName:
          doc.data().instructorName || doc.data().entrepreneur || 'Sistema', // Considerar entrepreneur como fallback para instructorName
        enrolledStudents: doc.data().enrolledStudents || 0, // Adicionar enrolledStudents
        image: doc.data().image || '', // Adicionar image
        beach: doc.data().beach || '', // Adicionar beach
        city: doc.data().city || '', // Adicionar city
        horarios: Array.isArray(doc.data().horarios) ? doc.data().horarios.map((h: any) => ({ // Adicionar e mapear horarios
           periodo: h.periodo || '',
           horario: h.horario || '',
           local: h.local || 'areia',
           limiteAlunos: h.limiteAlunos || 0,
           alunosMatriculados: h.alunosMatriculados || 0,
           diaSemana: h.diaSemana || '',
        })) : [],
        description: doc.data().description || '', // Adicionar description
        rating: Number(doc.data().rating || 0), // Adicionar rating
        reviews: Number(doc.data().reviews || 0), // Adicionar reviews
        // Adicionar outras propriedades conforme a definição do tipo Activity
      })) as Activity[];

      return activities;
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
       const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Converter campos para o tipo correto e fornecer fallbacks
        price: Number(doc.data().price || 0),
        status: doc.data().status || 'active',
        instructorId: doc.data().instructorId || 'system',
        instructorName:
          doc.data().instructorName || doc.data().entrepreneur || 'Sistema', // Considerar entrepreneur como fallback para instructorName
        enrolledStudents: doc.data().enrolledStudents || 0, // Adicionar enrolledStudents
        image: doc.data().image || '', // Adicionar image
        beach: doc.data().beach || '', // Adicionar beach
        city: doc.data().city || '', // Adicionar city
        horarios: Array.isArray(doc.data().horarios) ? doc.data().horarios.map((h: any) => ({ // Adicionar e mapear horarios
           periodo: h.periodo || '',
           horario: h.horario || '',
           local: h.local || 'areia',
           limiteAlunos: h.limiteAlunos || 0,
           alunosMatriculados: h.alunosMatriculados || 0,
           diaSemana: h.diaSemana || '',
        })) : [],
        description: doc.data().description || '', // Adicionar description
        rating: Number(doc.data().rating || 0), // Adicionar rating
        reviews: Number(doc.data().reviews || 0), // Adicionar reviews
        // Adicionar outras propriedades conforme a definição do tipo Activity
      })) as Activity[];

      return activities;
    } catch (error) {
      console.error('Erro ao buscar atividades por localização:', error);
      throw error;
    }
  }

  /**
   * Atualiza status da atividade
   */
  async updateActivityStatus(
    id: string,
    status: ActivityStatus
  ): Promise<void> {
    try {
      const activityRef = doc(db, this.activitiesCollection, id);
      await updateDoc(activityRef, {
        status,
        updatedAt: serverTimestamp(), // Usar serverTimestamp
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
   * (Função de migração/teste - remover em produção)
   */
  async updateExistingActivities() {
    try {
      const q = query(collection(db, this.activitiesCollection));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);

      snapshot.docs.forEach(doc => {
        const activityRef = doc.ref;
        batch.update(activityRef, {
          instructorId: 'paulo@hotmail.com', // ID do instrutor para teste
          instructorName: 'Paulo', // Nome do instrutor para teste
          updatedAt: serverTimestamp(), // Usar serverTimestamp
        });
      });

      await batch.commit();
      console.log('Atividades atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar atividades:', error);
      throw error;
    }
  }

  // Este método createEnrollment parece deslocado em ActivityService.
  // Ele deveria estar em EnrollmentService. Removendo daqui.
  /*
  async createEnrollment(enrollment: {
    activityId: string;
    studentId: string;
    studentName: string;
    status: 'active' | 'cancelled'; // Status aqui parece incorreto para EnrollmentStatus
    paymentStatus: 'pending' | 'paid' | 'refunded';
    paymentMethod: 'pix' | 'credit_card';
    amount: number;
    createdAt: Date; // Usar serverTimestamp
    updatedAt: Date; // Usar serverTimestamp
  }) {
    try {
      const enrollmentRef = doc(collection(db, 'enrollments'));
      await setDoc(enrollmentRef, {
        ...enrollment,
        id: enrollmentRef.id,
        createdAt: serverTimestamp(), // Usar serverTimestamp
        updatedAt: serverTimestamp(), // Usar serverTimestamp
      });

      // Atualizar contador de alunos matriculados na atividade
      await this.updateEnrolledStudents(enrollment.activityId, 1);

      return enrollmentRef.id;
    } catch (error) {
      console.error('Erro ao criar matrícula:', error);
      throw error;
    }
  }
  */

  async reactivateActivity(activityId: string): Promise<void> {
    try {
      const activityRef = doc(db, this.activitiesCollection, activityId);
      await updateDoc(activityRef, {
        status: 'active',
        updatedAt: serverTimestamp(), // Usar serverTimestamp
      });
    } catch (error) {
      console.error('Erro ao reativar atividade:', error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();
