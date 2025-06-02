import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { userService } from './userService';
import { User, UserRole } from '@/types';

class AuthService {
  private auth = getAuth();

  /**
   * Registra um novo usuário
   */
  async register(
    email: string,
    password: string,
    userData: Omit<User, 'id' | 'email'>
  ): Promise<User> {
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Criar perfil do usuário no Firestore
      const user: Omit<User, 'id'> = {
        ...userData,
        email,
        uid: userCredential.user.uid,
        created: new Date(),
        updated: new Date()
      };

      const userId = await userService.createUser(user);

      return {
        id: userId,
        ...user
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }

  /**
   * Login com email e senha
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const user = await userService.getUserByEmail(email);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  /**
   * Envia email de recuperação de senha
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw error;
    }
  }

  /**
   * Atualiza senha do usuário
   */
  async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  }

  /**
   * Atualiza email do usuário
   */
  async updateUserEmail(newEmail: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await updateEmail(user, newEmail);

      // Atualizar email no Firestore
      const userData = await userService.getUserByEmail(user.email!);
      if (userData) {
        await userService.updateUser(userData.id, { email: newEmail });
      }
    } catch (error) {
      console.error('Erro ao atualizar email:', error);
      throw error;
    }
  }

  /**
   * Atualiza perfil do usuário
   */
  async updateUserProfile(profile: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await updateProfile(user, profile);

      // Atualizar perfil no Firestore
      const userData = await userService.getUserByEmail(user.email!);
      if (userData) {
        await userService.updateUser(userData.id, {
          name: profile.displayName,
          photoURL: profile.photoURL
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Obtém usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return null;
      }

      return userService.getUserByEmail(user.email!);
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      throw error;
    }
  }

  /**
   * Escuta mudanças no estado de autenticação
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await userService.getUserByEmail(firebaseUser.email!);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Verifica se usuário é instrutor
   */
  async isInstructor(userId: string): Promise<boolean> {
    try {
      const user = await userService.getUser(userId);
      return user?.role === 'instructor';
    } catch (error) {
      console.error('Erro ao verificar se usuário é instrutor:', error);
      throw error;
    }
  }

  /**
   * Verifica se usuário é aluno
   */
  async isStudent(userId: string): Promise<boolean> {
    try {
      const user = await userService.getUser(userId);
      return user?.role === 'student';
    } catch (error) {
      console.error('Erro ao verificar se usuário é aluno:', error);
      throw error;
    }
  }

  /**
   * Verifica se usuário é admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await userService.getUser(userId);
      return user?.role === 'admin';
    } catch (error) {
      console.error('Erro ao verificar se usuário é admin:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 