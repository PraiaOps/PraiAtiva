import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAu9bo8fy_L1PxGo6jYEY2IP9gFhdS710g",
  authDomain: "praiativa-a417f.firebaseapp.com",
  projectId: "praiativa-a417f",
  storageBucket: "praiativa-a417f.appspot.com",
  messagingSenderId: "1058362857760",
  appId: "1:1058362857760:web:702c94c60462f441445f45"
};

// Initialize Firebase for Node.js environment
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
