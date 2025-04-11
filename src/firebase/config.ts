// Importando funções necessárias do Firebase
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase - substitua com suas credenciais
const firebaseConfig = {
  apiKey: "AIzaSyDXsRAaACuJ-FWxTcmXDURWvxrqLyKJrq0",
  authDomain: "praiativa-app.firebaseapp.com",
  projectId: "praiativa-app",
  storageBucket: "praiativa-app.appspot.com",
  messagingSenderId: "234567890123",
  appId: "1:234567890123:web:abc123def456ghi789jkl"
};

// Inicializando o Firebase apenas uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exportando serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 