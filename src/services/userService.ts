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
        created: serverTimestamp(),
        updated: serverTimestamp()
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
        updated: serverTimestamp()
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
          ...userDoc.data()
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
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  /**
   * Escuta usuários em tempo real
   */
  subscribeToUsers(callback: (users: User[]) => void, filters?: {
    role?: UserRole;
    name?: string;
    email?: string;
  }) {
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

    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      callback(users);
    });
  }

  /**
   * Busca usuário por email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where('email', '==', email)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  /**
   * Busca usuário por telefone
   */
  async getUserByPhone(phone: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where('phone', '==', phone)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Erro ao buscar usuário por telefone:', error);
      throw error;
    }
  }

  /**
   * Busca instrutores
   */
  async getInstructors(): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where('role', '==', 'instructor'),
        orderBy('name')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Erro ao buscar instrutores:', error);
      throw error;
    }
  }

  /**
   * Busca alunos
   */
  async getStudents(): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where('role', '==', 'student'),
        orderBy('name')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      throw error;
    }
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const userRef = doc(db, this.usersCollection, id);
      await userRef.delete();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 