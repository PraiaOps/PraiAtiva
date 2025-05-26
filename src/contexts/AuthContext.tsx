'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  UserCredential,
  User,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Define um valor de timeout para operações com o Firestore
const FIRESTORE_TIMEOUT = 5000; // 5 segundos

// Função auxiliar para fazer operações com timeout
const withTimeout = (promise: Promise<any>, timeout: number) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operação expirou')), timeout)
    )
  ]);
};

type AuthContextType = {
  user: User | null;
  userData: any | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Carregar dados do usuário do Firestore
  // Função para converter timestamps do Firestore para objetos Date serializáveis
  const convertFirestoreTimestamps = (data: any) => {
    if (!data) return data;
    
    const result = { ...data };
    
    // Converter todos os campos que podem ser timestamps
    Object.keys(result).forEach(key => {
      const value = result[key];
      
      // Verificar se é um timestamp do Firestore
      if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
        // Converter para string ISO para garantir serialização
        result[key] = new Date(value.seconds * 1000).toISOString();
      }
    });
    
    return result;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Update session cookie
      if (user) {
        try {
          // Get id token
          const idToken = await user.getIdToken();
          
          // Set session cookie
          document.cookie = `session=${idToken}; path=/; max-age=3600; samesite=strict`;
        } catch (error) {
          console.error("Erro ao atualizar cookie de sessão:", error);
        }
      } else {
        // Clear session cookie on logout
        document.cookie = 'session=; path=/; max-age=0';
      }
      
      if (user) {
        try {
          // First check if user exists in Firestore
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          
          // Get stored user data or create new profile
          let storedUserData = userDoc.exists() ? userDoc.data() : null;
          
          if (!storedUserData) {
            // Create new user profile with default role
            storedUserData = {
              email: user.email,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              role: 'student' // default role
            };
            
            // Save new user profile
            await setDoc(userRef, storedUserData);
          }
          
          // Determine role based on stored data or email pattern
          const email = user.email?.toLowerCase() || '';
          let role = storedUserData.role || 'student';
          
          // Update role based on email patterns if not already set
          if (!storedUserData.role) {
            if (email === 'admin@praiativa.com' || email.includes('admin')) {
              role = 'admin';
            } else if (email.includes('instrutor') || storedUserData.isInstructor) {
              role = 'instructor';
            } else if (email.includes('empreendedor')) {
              role = 'entrepreneur';
            }
            
            // Update role in Firestore if it changed
            await setDoc(userRef, { role }, { merge: true });
            storedUserData.role = role;
          }
          
          // Convert timestamps and set user data
          const userData = {
            ...convertFirestoreTimestamps(storedUserData),
            role: storedUserData.role,
            isAdmin: storedUserData.role === 'admin',
            isInstructor: storedUserData.role === 'instructor',
            isEntrepreneur: storedUserData.role === 'entrepreneur'
          };
          
          setUserData(userData);
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          setUserData({
            email: user.email,
            role: 'student',
            lastLogin: new Date().toISOString()
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      
      const userSnap = await withTimeout(getDoc(userRef), FIRESTORE_TIMEOUT);
      let storedUserData;
      
      if (userSnap.exists()) {
        storedUserData = userSnap.data();
        // If role is not set, determine it based on email
        if (!storedUserData.role) {
          const email = storedUserData.email.toLowerCase();
          let role = 'student';
          
          if (email === 'admin@praiativa.com' || email.includes('admin')) {
            role = 'admin';
          } else if (email.includes('instrutor') || storedUserData.isInstructor) {
            role = 'instructor';
          } else if (email.includes('empreendedor')) {
            role = 'entrepreneur';
          }
          
          // Update role in Firestore
          await withTimeout(
            setDoc(userRef, { role }, { merge: true }),
            FIRESTORE_TIMEOUT
          );
          storedUserData.role = role;
        }
        
        // Convert timestamps and set user data
        const userData = {
          ...convertFirestoreTimestamps(storedUserData),
          role: storedUserData.role,
          isAdmin: storedUserData.role === 'admin',
          isInstructor: storedUserData.role === 'instructor'
        };
        
        setUserData(userData);
      } else {
        const userEmail = user?.email || "";
        const basicUserData = {
          email: userEmail,
          role: 'student',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        if (userEmail) {
          try {
            await withTimeout(setDoc(userRef, {
              email: userEmail,
              role: 'student',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            }), FIRESTORE_TIMEOUT);
            setUserData(basicUserData);
          } catch (error) {
            console.error("Erro ao criar perfil básico:", error);
            setUserData(basicUserData);
          }
        } else {
          setUserData(basicUserData);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      setUserData({
        email: user?.email || "",
        role: 'student',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    }
  };

  // Função utilitária para normalizar o campo role
  function normalizeRole(role: string | undefined, email: string | undefined): string {
    if (!role || !['admin','instructor','entrepreneur','student'].includes(role)) {
      if (!email) return 'student';
      const lower = email.toLowerCase();
      if (lower === 'admin@praiativa.com' || lower.includes('admin')) return 'admin';
      if (lower.includes('instrutor') || lower.includes('instructor')) return 'instructor';
      if (lower.includes('empreendedor') || lower.includes('entrepreneur')) return 'entrepreneur';
      return 'student';
    }
    if (role === 'instrutor') return 'instructor';
    if (role === 'aluno') return 'student';
    return role;
  }

  const signUp = async (email: string, password: string, userData?: any): Promise<UserCredential> => {
    try {
      setError(null);
      console.log('[AuthContext] signUp: criando usuário no Auth', email, userData);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        try {
          const userRef = doc(db, "users", userCredential.user.uid);
          let dataToSave = {
            ...(userData || {}),
            email: email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          };
          dataToSave.role = normalizeRole(dataToSave.role, email);
          console.log('[AuthContext] signUp: salvando no Firestore', userRef.path, dataToSave);
          await withTimeout(setDoc(userRef, dataToSave, { merge: true }), FIRESTORE_TIMEOUT);
          setUserData({
            ...(userData || {}),
            email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            role: dataToSave.role,
          });
        } catch (error) {
          console.warn('[AuthContext] Erro ao salvar no Firestore:', error);
          setUserData({
            ...(userData || {}),
            email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            role: normalizeRole(userData?.role, email),
          });
        }
      }
      return userCredential;
    } catch (err: any) {
      console.error('[AuthContext] Erro ao criar conta:', err);
      
      // Traduzir mensagens de erro do Firebase para português
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado no sistema');
      } else if (err.code === 'auth/invalid-email') {
        setError('E-mail inválido');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca');
      } else {
        setError(err.message || 'Ocorreu um erro durante o cadastro');
      }
      
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('[AuthContext] signIn: tentando login', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        try {
          const userRef = doc(db, "users", userCredential.user.uid);
          const userDoc = await getDoc(userRef);
          let userData = userDoc.exists() ? userDoc.data() : {};
          userData.role = normalizeRole(userData.role, userCredential.user.email || undefined);
          if (!userDoc.exists()) {
            userData = {
              email: userCredential.user.email,
              role: userData.role,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };
            console.log('[AuthContext] signIn: criando perfil mínimo no Firestore', userRef.path, userData);
          } else {
            userData.lastLogin = serverTimestamp();
            console.log('[AuthContext] signIn: atualizando perfil no Firestore', userRef.path, userData);
          }
          await withTimeout(setDoc(userRef, userData, { merge: true }), FIRESTORE_TIMEOUT);
          // Redirecionamento
          let redirectPath = '/';
          switch (userData.role) {
            case 'admin':
              redirectPath = '/dashboard/admin';
              break;
            case 'instructor':
              redirectPath = '/dashboard/instrutor';
              break;
            case 'entrepreneur':
              redirectPath = '/dashboard/empreendedor';
              break;
            case 'student':
              redirectPath = '/dashboard/aluno';
              break;
            default:
              redirectPath = '/';
          }
          router.push(redirectPath);
        } catch (error) {
          console.error("Erro ao atualizar último login:", error);
          router.push('/');
        }
      }
    } catch (err: any) {
      console.error("Erro de login:", err);
      
      if (['auth/invalid-credential', 'auth/invalid-login-credentials', 'auth/user-not-found', 'auth/wrong-password'].includes(err.code)) {
        setError('E-mail ou senha incorretos');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de e-mail inválido');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde');
      } else if (err.code === 'auth/user-disabled') {
        setError('Esta conta foi desativada');
      } else {
        setError('Erro ao fazer login');
      }
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      router.push('/');
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signUp, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}