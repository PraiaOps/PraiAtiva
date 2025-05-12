import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuração do Firebase para o projeto praiativa-a417f
const firebaseConfig = {
  apiKey: "AIzaSyAu9bo8fy_L1PxGo6jYEY2IP9gFhdS710g",
  authDomain: "praiativa-a417f.firebaseapp.com",
  projectId: "praiativa-a417f",
  storageBucket: "praiativa-a417f.appspot.com",
  messagingSenderId: "1058362857760",
  appId: "1:1058362857760:web:702c94c60462f441445f45",
  measurementId: "G-Z8SLE3SKKJ"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Serviços do Firebase
export const auth = getAuth(app);

// Configuração do Firestore (agora ativado no console)
export const db = getFirestore(app);

// Opção para usar emulador local em ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    // Se você estiver usando um emulador Firestore local, descomente a linha abaixo
    // connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Firebase configurado em modo de desenvolvimento');
  } catch (error) {
    console.error('Erro ao conectar ao emulador:', error);
  }
}

// Inicializar Analytics apenas no navegador
export const analytics = typeof window !== 'undefined' 
  ? isSupported().then(yes => yes ? getAnalytics(app) : null) 
  : null;

export default app; 