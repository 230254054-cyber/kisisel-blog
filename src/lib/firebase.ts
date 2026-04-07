import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrT6eaWuzx5pIobHhiV62D8hu5E1by3Xw",
  authDomain: "kisisel-blog-73478.firebaseapp.com",
  projectId: "kisisel-blog-73478",
  storageBucket: "kisisel-blog-73478.firebasestorage.app",
  messagingSenderId: "716734159365",
  appId: "1:716734159365:web:dcf1dfbc1ff48605271a6c",
  measurementId: "G-F3SCH231V4"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Servisleri dışarı aktar
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;