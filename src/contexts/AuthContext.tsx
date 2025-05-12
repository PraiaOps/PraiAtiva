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
  const fetchUserData = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      
      try {
        const userSnap = await withTimeout(getDoc(userRef), FIRESTORE_TIMEOUT);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          const userEmail = user?.email || "";
          
          const basicUserData = {
            email: userEmail,
            createdAt: new Date(),
            lastLogin: new Date()
          };
          
          if (userEmail) {
            try {
              await withTimeout(setDoc(userRef, basicUserData), FIRESTORE_TIMEOUT);
              setUserData(basicUserData);
            } catch (error) {
              console.error("Erro ao criar perfil básico:", error);
              setUserData(basicUserData);
            }
          } else {
            setUserData(basicUserData);
          }
        }
      } catch (error) {
        console.error("Erro ao acessar Firestore:", error);
        setUserData({
          email: user?.email || "",
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Verificar se é o admin pelo email
          const isAdmin = user.email === 'admin@praiativa.com';
          
          // Carregar dados do usuário
          await fetchUserData(user.uid);
          
          // Adicionar informação de admin ao userData
          if (isAdmin && userData) {
            setUserData(prevData => ({
              ...prevData,
              isAdmin: true,
              role: 'admin'
            }));
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any): Promise<UserCredential> => {
    try {
      setError(null);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        try {
          const userRef = doc(db, "users", userCredential.user.uid);
          
          const dataToSave = {
            ...(userData || {}),
            email: email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          };
          
          try {
            await withTimeout(setDoc(userRef, dataToSave), FIRESTORE_TIMEOUT);
            setUserData({
              ...(userData || {}),
              email,
              createdAt: new Date(),
              lastLogin: new Date()
            });
          } catch (error) {
            console.warn("Erro ao salvar no Firestore:", error);
            setUserData({
              ...(userData || {}),
              email,
              createdAt: new Date(),
              lastLogin: new Date()
            });
          }
        } catch (error) {
          console.error("Erro ao salvar dados do usuário:", error);
        }
      }
      
      return userCredential;
    } catch (err: any) {
      console.error("Erro ao criar conta:", err);
      
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
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        try {
          const userRef = doc(db, "users", userCredential.user.uid);
          
          try {
            await withTimeout(
              setDoc(userRef, { 
                lastLogin: serverTimestamp(),
                email: email
              }, { merge: true }),
              FIRESTORE_TIMEOUT
            );
            
            // Buscar dados do usuário para determinar o redirecionamento
            await fetchUserData(userCredential.user.uid);
            
            // Determinar o redirecionamento com base no tipo de usuário
            const userType = email.toLowerCase();
            let redirectPath = '/'; // Valor padrão alterado para a página inicial
            
            if (email === 'admin@praiativa.com' || userType.includes('admin')) {
              redirectPath = '/dashboard/admin';
            } else if (userType.includes('instrutor')) {
              redirectPath = '/dashboard/instrutor';
            } else {
              redirectPath = '/dashboard/aluno';
            }
            
            router.push(redirectPath);
          } catch (error) {
            console.warn("Erro ao atualizar dados de login:", error);
            setUserData({
              email: email,
              lastLogin: new Date()
            });
            router.push('/'); // Redirecionamento alterado para a página inicial
          }
        } catch (error) {
          console.error("Erro ao atualizar último login:", error);
          router.push('/'); // Redirecionamento alterado para a página inicial
        }
      }
    } catch (err: any) {
      console.error("Erro de login:", err);
      
      // Mensagens de erro simplificadas
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
      // Força redirecionamento para a página inicial após logout
      window.location.href = '/';
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