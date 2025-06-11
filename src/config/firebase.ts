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

// Singleton instances
let firebaseApp: FirebaseApp | undefined;
let firestoreDb: Firestore | undefined;
let firebaseAuth: Auth | undefined;
let firebaseStorage: FirebaseStorage | undefined;
let firebaseFunctions: Functions | undefined;
let firebaseAnalytics: Analytics | null | undefined;

// Initialize Firebase services
function initializeFirebase() {
  try {
    // Get existing app or initialize new one
    firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

    // Initialize services only once
    if (!firestoreDb) firestoreDb = getFirestore(firebaseApp);
    if (!firebaseAuth) firebaseAuth = getAuth(firebaseApp);
    if (!firebaseStorage) firebaseStorage = getStorage(firebaseApp);
    if (!firebaseFunctions) firebaseFunctions = getFunctions(firebaseApp);

    // Initialize Analytics only on client-side and if supported
    if (typeof window !== 'undefined' && firebaseAnalytics === null) {
      isSupported()
        .then((supported) => {
          if (supported) {
            firebaseAnalytics = getAnalytics(firebaseApp);
          } else {
            firebaseAnalytics = null;
          }
        })
        .catch(() => {
          firebaseAnalytics = null;
        });
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

// Export a function to get Firebase instances
export function getFirebaseInstance() {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return {
    app: firebaseApp!,
    db: firestoreDb!,
    auth: firebaseAuth!,
    storage: firebaseStorage!,
    functions: firebaseFunctions!,
    analytics: firebaseAnalytics,
  };
}

// Initialize on import
initializeFirebase();

// Export initialized instances
export { firebaseApp as app };
export { firestoreDb as db };
export { firebaseAuth as auth };
export { firebaseStorage as storage };
export { firebaseFunctions as functions };
export { firebaseAnalytics as analytics };

export default firebaseApp;
