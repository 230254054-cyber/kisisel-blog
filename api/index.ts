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

// HEM GET HEM POST İÇİN TÜM YOLLARI TANIMLIYORUZ (404 HATASINI BİTİRİR)
const siteDataRoutes = ['/api/site-data', '/api/profile'];

app.get(siteDataRoutes, async (req, res) => {
  try {
    const docSnap = await getDoc(doc(db, 'siteData', 'home'));
    res.json(docSnap.exists() ? docSnap.data() : {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post(siteDataRoutes, async (req, res) => {
  try {
    // updateDoc yerine setDoc + merge kullanmak döküman yoksa hata almanı engeller
    await setDoc(doc(db, 'siteData', 'home'), req.body, { merge: true });
    res.json({ message: "Başarıyla kaydedildi!" });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Postlar ve Projeler için boş dönmesin (404 önleyici)
app.get('/api/posts', async (req, res) => {
  const snap = await getDocs(collection(db, "posts"));
  res.json(snap.docs.map(d => ({ _id: d.id, ...d.data() })));
});
// api/index.ts içine mevcut olanların altına şunları ekle:

// BLOG YAZISI EKLEME (POST)
app.post('/api/posts', async (req, res) => {
  try {
    const docRef = doc(collection(db, "posts")); // Otomatik ID oluşturur
    await setDoc(docRef, req.body);
    res.json({ message: "Post eklendi!" });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// PROJE EKLEME (POST)
app.post('/api/projects', async (req, res) => {
  try {
    const docRef = doc(collection(db, "projects")); // Otomatik ID oluşturur
    await setDoc(docRef, req.body);
    res.json({ message: "Proje eklendi!" });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default app;