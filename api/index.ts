import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Vercel api klasöründe olduğu için rota direkt /auth/login olmalı
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === 'admin123') {
    res.json({ token: 'fake-jwt-token', user: { email: 'admin@example.com' } });
  } else {
    res.status(401).json({ message: 'Hatalı giriş bilgileri' });
  }
});
// Şifre değiştirme rotası - Tam eşleşme için:
app.put('/api/auth/change-password', async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'Yeni şifre gönderilmedi' });
  }

  try {
    const adminRef = doc(db, 'settings', 'admin');
    await updateDoc(adminRef, {
      password: newPassword
    });
    
    console.log("Şifre Firestore'da güncellendi!");
    return res.json({ message: 'Şifre başarıyla güncellendi!' });
  } catch (error) {
    console.error("Firestore Güncelleme Hatası:", error);
    return res.status(500).json({ message: 'Veritabanına yazılamadı!', error: error.message });
  }
});
export default app;