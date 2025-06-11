import { getApps, initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { Functions, getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only in browser
let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let firebaseStorage: FirebaseStorage | null = null;
let firebaseFunctions: Functions | null = null;
let firebaseAnalytics: Promise<Analytics | null> | null = null;

if (typeof window !== 'undefined') {
  try {
    // Check if Firebase is already initialized
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    if (firebaseApp) {
      firestoreDb = getFirestore(firebaseApp);
      firebaseAuth = getAuth(firebaseApp);
      firebaseStorage = getStorage(firebaseApp);
      firebaseFunctions = getFunctions(firebaseApp);
      firebaseAnalytics = isSupported().then(yes => yes ? getAnalytics(firebaseApp!) : null);
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Don't throw error, just log it
  }
}

export const app = firebaseApp;
export const db = firestoreDb;
export const auth = firebaseAuth;
export const storage = firebaseStorage;
export const functions = firebaseFunctions;
export const analytics = firebaseAnalytics;

export default firebaseApp;
