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
  QueryConstraint,
} from 'firebase/firestore';
import { User, UserRole } from '@/types';

class UserService {
  private usersCollection = 'users';

  /**
   * Cria um novo usuário
   */
  async createUser(user: Omit<User, 'id'>): Promise<string> {
    try {
      const userRef = await addDoc(collection(db, this.usersCollection), {
        ...user,
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
      const userRef = doc(db, this.usersCollection, id);
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
      const userRef = doc(db, this.usersCollection, id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data(),
        } as User;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  /**
   * Lista usuários com filtros
   */
  async listUsers(filters?: {
    role?: UserRole;
    name?: string;
    email?: string;
  }): Promise<User[]> {
    try {
      const colRef = collection(db, this.usersCollection);
      let constraints: QueryConstraint[] = [];

      if (filters) {
        if (filters.role) {
          constraints.push(where('role', '==', filters.role));
        }

        if (filters.name) {
          constraints.push(where('name', '>=', filters.name));
          constraints.push(where('name', '<=', filters.name + '\uf8ff'));
        }

        if (filters.email) {
          constraints.push(where('email', '==', filters.email));
        }

        constraints.push(orderBy('name'));
      }

      const q =
        constraints.length > 0
          ? query(colRef, ...constraints)
          : query(colRef, orderBy('name'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  /**
   * Escuta usuários em tempo real
   */
  subscribeToUsers(
    callback: (users: User[]) => void,
    filters?: {
      role?: UserRole;
      name?: string;
      email?: string;
    }
  ) {
    let q = collection(db, this.usersCollection);

    if (filters) {
      const constraints = [];

      if (filters.role) {
        constraints.push(where('role', '==', filters.role));
      }

      if (filters.name) {
        constraints.push(where('name', '>=', filters.name));
        constraints.push(where('name', '<=', filters.name + '\uf8ff'));
      }

      if (filters.email) {
        constraints.push(where('email', '==', filters.email));
      }

      q = query(q, ...constraints, orderBy('name'));
    } else {
      q = query(q, orderBy('name'));
    }

    return onSnapshot(q, snapshot => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      callback(users);
    });
  }

  /**
   * Busca um usuário pelo email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const colRef = collection(db, this.usersCollection);
      const q = query(colRef, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as User;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  /**
   * Lista instrutores
   */
  async listInstructors(): Promise<User[]> {
    try {
      const colRef = collection(db, this.usersCollection);
      const q = query(
        colRef,
        where('role', '==', 'instructor'),
        orderBy('name')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error) {
      console.error('Erro ao listar instrutores:', error);
      throw error;
    }
  }

  /**
   * Lista alunos
   */
  async listStudents(): Promise<User[]> {
    try {
      const colRef = collection(db, this.usersCollection);
      const q = query(colRef, where('role', '==', 'student'), orderBy('name'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error) {
      console.error('Erro ao listar alunos:', error);
      throw error;
    }
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const userRef = doc(db, this.usersCollection, id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  /**
   * Escuta mudanças em um usuário
   */
  subscribeToUser(userId: string, callback: (user: User | null) => void) {
    const userRef = doc(db, this.usersCollection, userId);

    return onSnapshot(userRef, doc => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data(),
        } as User);
      } else {
        callback(null);
      }
    });
  }
}

export const userService = new UserService();
