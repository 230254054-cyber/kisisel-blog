import express from 'express';
import cors from 'cors';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrT6eaWuzx5pIobHhiV62D8hu5E1by3Xw",
  authDomain: "kisisel-blog-73478.firebaseapp.com",
  projectId: "kisisel-blog-73478",
  storageBucket: "kisisel-blog-73478.firebasestorage.app",
  messagingSenderId: "716734159365",
  appId: "1:716734159365:web:dcf1dfbc1ff48605271a6c"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const app = express();

app.use(cors());
app.use(express.json());

// --- Kaydetme Rotası (POST) ---
app.post('/api/site-data', async (req, res) => {
  try {
    const docRef = doc(db, 'siteData', 'home');
    await setDoc(docRef, req.body, { merge: true });
    return res.status(200).json({ message: "Başarıyla kaydedildi!" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// --- Veri Getirme Rotası (GET) ---
app.get('/api/site-data', async (req, res) => {
  try {
    const docRef = doc(db, 'siteData', 'home');
    const docSnap = await getDoc(docRef);
    return res.status(200).json(docSnap.exists() ? docSnap.data() : {});
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// --- Diğer Gerekli Rotalar (Hata Almamak İçin) ---
app.get('/api/posts', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = querySnapshot.docs.map(d => ({ _id: d.id, ...d.data() }));
    return res.json(posts);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

export default app;