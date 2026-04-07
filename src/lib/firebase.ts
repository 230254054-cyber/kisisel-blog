import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: "AIzaSyCrT6eaWUzx5pIobHhIv62D8hu5E1by3Xw",
  authDomain: "kisisel-blog-73478.firebaseapp.com",
  projectId: "kisisel-blog-73478",
  storageBucket: "kisisel-blog-73478.firebasestorage.app",
  messagingSenderId: "716734159365",
  appId: "1:716734159365:web:dcf1dfbc1ff48605271a6c",
  measurementId: "G-F3SCH231V4"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
