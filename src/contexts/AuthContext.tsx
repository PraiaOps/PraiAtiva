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
import { getFirebaseInstance } from '@/config/firebase';
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
  const { auth, db } = getFirebaseInstance();

  // Função para converter timestamps do Firestore para objetos Date serializáveis
  const convertFirestoreTimestamps = (data: any) => {
    if (!data) return data;
    
    const result = { ...data };
    
    Object.keys(result).forEach(key => {
      const value = result[key];
      
      if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
        result[key] = new Date(value.seconds * 1000).toISOString();
      }
    });
    
    return result;
  };

  // Função para redirecionar baseado no papel do usuário
  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'instructor':
        router.push('/dashboard/instrutor');
        break;
      case 'entrepreneur':
        router.push('/dashboard/empreendedor');
        break;
      case 'student':
        router.push('/dashboard/aluno');
        break;
      default:
        router.push('/');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Get id token
          const idToken = await user.getIdToken();
          
          // Set session cookie
          document.cookie = `session=${idToken}; path=/; max-age=3600; samesite=strict`;
          
          // Buscar dados do usuário no Firestore
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const storedUserData = userDoc.data();
            const userData = {
              ...convertFirestoreTimestamps(storedUserData),
              role: storedUserData.role,
              isAdmin: storedUserData.role === 'admin',
              isInstructor: storedUserData.role === 'instructor',
              isEntrepreneur: storedUserData.role === 'entrepreneur'
            };
            setUserData(userData);
            
            // Redirecionar baseado no papel
            if (storedUserData.role) {
              redirectBasedOnRole(storedUserData.role);
            }
          } else {
            console.error("Usuário não encontrado no Firestore");
            setUserData(null);
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          setUserData(null);
        }
      } else {
        document.cookie = 'session=; path=/; max-age=0';
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any): Promise<UserCredential> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          email: email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          ...userData
        });
      }
      
      return userCredential;
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        const userRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          await setDoc(userRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
          
          // Redirecionar baseado no papel
          if (userData.role) {
            redirectBasedOnRole(userData.role);
          }
        }
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      signUp,
      signIn,
      signOut,
      error
    }}>
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