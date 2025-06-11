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
  deleteDoc,
  QueryConstraint,
  limit,
} from 'firebase/firestore';
import { User, UserRole } from '@/types';

class UserService {
  private get db() {
    return getFirebaseInstance().db;
  }
  private usersCollection = 'users';

  /**
   * Cria um novo usuário
   */
  async createUser(user: Omit<User, 'id'>): Promise<string> {
    try {
      const { createdAt, updatedAt, ...userData } = user;
      const userRef = await addDoc(collection(this.db, this.usersCollection), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return userRef.id;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza um usuário
   */
  async updateUser(id: string, user: Partial<User>): Promise<void> {
    try {
      const userRef = doc(this.db, this.usersCollection, id);
      await updateDoc(userRef, {
        ...user,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  /**
   * Busca um usuário pelo ID
   */
  async getUser(id: string): Promise<User | null> {
    try {
      const userRef = doc(this.db, this.usersCollection, id);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();

      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as User;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  /**
   * Busca um usuário pelo email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const colRef = collection(this.db, this.usersCollection);
      const q = query(colRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as User;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  /**
   * Lista usuários com filtros
   */
  async getUsers(filters?: {
    role?: UserRole;
    city?: string;
    state?: string;
  }): Promise<User[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters?.role) {
        constraints.push(where('role', '==', filters.role));
      }
      if (filters?.city) {
        constraints.push(where('city', '==', filters.city));
      }
      if (filters?.state) {
        constraints.push(where('state', '==', filters.state));
      }

      const baseQuery = collection(this.db, this.usersCollection);
      const finalQuery =
        constraints.length > 0
          ? query(baseQuery, ...constraints, orderBy('name'))
          : query(baseQuery, orderBy('name'));

      const querySnapshot = await getDocs(finalQuery);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User;
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  /**
   * Pesquisa usuários pelo nome
   */
  async searchUsersByName(name: string): Promise<User[]> {
    try {
      const colRef = collection(this.db, this.usersCollection);
      const q = query(
        colRef,
        where('name', '>=', name),
        where('name', '<=', name + '\uf8ff'),
        orderBy('name'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User;
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  /**
   * Lista usuários por papel
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const colRef = collection(this.db, this.usersCollection);
      const q = query(colRef, where('role', '==', role), orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User;
      });
    } catch (error) {
      console.error('Erro ao listar usuários por papel:', error);
      throw error;
    }
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const userRef = doc(this.db, this.usersCollection, id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  /**
   * Verifica o papel de um usuário
   */
  async verifyUserRole(userId: string, requiredRole: UserRole): Promise<boolean> {
    try {
      const userRef = doc(this.db, this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return false;
      }
      return userDoc.data()?.role === requiredRole;
    } catch (error) {
      console.error('Erro ao verificar papel do usuário:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
