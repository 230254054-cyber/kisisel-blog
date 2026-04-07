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
app.put('/api/auth/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  // Şimdilik test amaçlı başarılı dönelim
  console.log("Şifre değişim isteği alındı");
  
  return res.json({ 
    message: 'Şifre başarıyla güncellendi!' 
  });
});
export default app;