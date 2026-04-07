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

// --- SITE DATA KAYDETME (Unexpected Token Çözümü) ---
app.post(['/api/site-data', '/api/profile'], async (req, res) => {
  try {
    const docRef = doc(db, 'siteData', 'home');
    // setDoc kullanarak merge:true yapıyoruz, böylece doküman yoksa oluşturulur.
    await setDoc(docRef, req.body, { merge: true });
    
    return res.status(200).json({ success: true, message: "Başarıyla kaydedildi!" });
  } catch (error: any) {
    console.error("Kaydetme Hatası:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// --- DİĞER ROTALAR ---
app.get(['/api/site-data', '/api/profile'], async (req, res) => {
  try {
    const docSnap = await getDoc(doc(db, 'siteData', 'home'));
    return res.json(docSnap.exists() ? docSnap.data() : {});
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminSnap = await getDoc(doc(db, 'settings', 'admin'));
    if (adminSnap.exists() && email === 'admin@example.com' && password === adminSnap.data().password) {
      return res.json({ token: 'secure-token-123', user: { email } });
    }
    return res.status(401).json({ message: 'Hatalı giriş' });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// Postlar için 404 hatasını önlemek adına
app.get('/api/posts', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    return res.json(posts);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

export default app;