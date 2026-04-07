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

// --- AUTH ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminRef = doc(db, 'settings', 'admin');
    const adminSnap = await getDoc(adminRef);
    if (adminSnap.exists() && email === 'admin@example.com' && password === adminSnap.data().password) {
      return res.json({ token: 'secure-token-123', user: { email } });
    }
    res.status(401).json({ message: 'Hatalı giriş' });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- SITE DATA (HOME & PROFILE) ---
app.get(['/api/site-data', '/api/profile'], async (req, res) => {
  try {
    const docSnap = await getDoc(doc(db, 'siteData', 'home'));
    res.json(docSnap.exists() ? docSnap.data() : {});
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post(['/api/site-data', '/api/profile'], async (req, res) => {
  try {
    await setDoc(doc(db, 'siteData', 'home'), req.body, { merge: true });
    res.json({ message: "Başarıyla kaydedildi!" });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- POSTS (404 HATASINI ÇÖZER) ---
app.get('/api/posts', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- PROJECTS (404 HATASINI ÇÖZER) ---
app.get('/api/projects', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(projects);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default app;