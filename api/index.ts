import express from 'express';
import cors from 'cors';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

// 1. Firebase Ayarları
const firebaseConfig = {
  apiKey: "AIzaSyCrT6eaWuzx5pIobHhiV62D8hu5E1by3Xw",
  authDomain: "kisisel-blog-73478.firebaseapp.com",
  projectId: "kisisel-blog-73478",
  storageBucket: "kisisel-blog-73478.firebasestorage.app",
  messagingSenderId: "716734159365",
  appId: "1:716734159365:web:dcf1dfbc1ff48605271a6c"
};

// 2. Firebase'i Başlat
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
app.use(cors());
app.use(express.json());

// 3. GİRİŞ ROTASI
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminRef = doc(db, 'settings', 'admin');
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      const dbPassword = adminSnap.data().password;
      if (email === 'admin@example.com' && password === dbPassword) {
        return res.json({ 
          token: 'secure-token-123', 
          user: { email: 'admin@example.com' } 
        });
      } else {
        return res.status(401).json({ message: 'Hatalı e-posta veya şifre!' });
      }
    } else {
      return res.status(404).json({ message: 'Admin verisi bulunamadı!' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
  }
});

// 4. ŞİFRE DEĞİŞTİRME ROTASI
app.put('/api/auth/change-password', async (req, res) => {
  const { newPassword } = req.body;
  try {
    const adminRef = doc(db, 'settings', 'admin');
    await updateDoc(adminRef, { password: newPassword });
    return res.json({ message: 'Şifre veritabanında güncellendi!' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Şifre güncellenemedi: ' + error.message });
  }
});

// 5. AYARLARI GETİR (Dashboard açıldığında verileri çeker)
// HEM SITE-DATA HEM DE PROFILE ISMINI DESTEKLIYORUZ (404 Hatasını Çözer)
app.get(['/api/site-data', '/api/profile'], async (req, res) => {
  try {
    const docRef = doc(db, 'siteData', 'home');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return res.json(docSnap.data());
    } else {
      // Eğer veritabanı boşsa hata vermesin, boş bir obje dönsün
      return res.json({});
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post(['/api/site-data', '/api/profile'], async (req, res) => {
  const newData = req.body;
  try {
    const docRef = doc(db, 'siteData', 'home');
    await setDoc(docRef, newData, { merge: true });
    return res.json({ message: "Başarıyla güncellendi!" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Resimdeki PUT hatası için bunu da ekleyelim
app.put('/api/profile', async (req, res) => {
  const newData = req.body;
  try {
    const docRef = doc(db, 'siteData', 'home');
    await setDoc(docRef, newData, { merge: true });
    return res.json({ message: "Profil güncellendi!" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
export default app;