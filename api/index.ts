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
// Giriş Rotası - Firebase'den şifreyi okur
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 1. Firebase'deki 'settings/admin' dokümanına git
    const adminRef = doc(db, 'settings', 'admin');
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      const dbPassword = adminSnap.data().password; // Firebase'deki güncel şifre

      // 2. Senin girdiğin şifre ile Firebase'deki şifreyi karşılaştır
      if (email === 'admin@example.com' && password === dbPassword) {
        return res.json({ 
          token: 'secure-token-123', 
          user: { email: 'admin@example.com' } 
        });
      } else {
        return res.status(401).json({ message: 'Şifre hatalı!' });
      }
    } else {
      return res.status(404).json({ message: 'Admin verisi bulunamadı!' });
    }
  } catch (error) {
    console.error("Firebase hata:", error);
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});
export default app;