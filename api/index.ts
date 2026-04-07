import express from 'express';
import cors from 'cors';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

// 1. Firebase Ayarların (Resmindeki bilgilere göre güncelledim)
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

// 3. GİRİŞ ROTASI (POST)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Firestore'dan şifreyi oku (settings koleksiyonu, admin dokümanı)
    const adminRef = doc(db, 'settings', 'admin');
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      const dbPassword = adminSnap.data().password;

      // Karşılaştır
      if (email === 'admin@example.com' && password === dbPassword) {
        return res.json({ 
          token: 'secure-token-123', 
          user: { email: 'admin@example.com' } 
        });
      } else {
        return res.status(401).json({ message: 'Hatalı e-posta veya şifre!' });
      }
    } else {
      return res.status(404).json({ message: 'Admin verisi veritabanında bulunamadı!' });
    }
  } catch (error) {
    console.error("Firebase Hatası:", error);
    return res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
  }
});

// 4. ŞİFRE DEĞİŞTİRME ROTASI (PUT)
app.put('/api/auth/change-password', async (req, res) => {
  const { newPassword } = req.body;

  try {
    const adminRef = doc(db, 'settings', 'admin');
    await updateDoc(adminRef, {
      password: newPassword
    });
    
    return res.json({ message: 'Şifye veritabanında güncellendi!' });
  } catch (error) {
    return res.status(500).json({ message: 'Şifre güncellenemedi: ' + error.message });
  }
});

export default app;