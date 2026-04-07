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
// ... mevcut login rotasının (app.post('/api/auth/login', ...)) bittiği yerin altına ekle:

app.post('/api/auth/update-password', (req, res) => {
  const { newPassword } = req.body;
  
  // Şimdilik sadece başarılı dönelim, ileride buraya DB mantığı eklersin
  console.log("Yeni şifre talebi:", newPassword);
  
  return res.json({ 
    message: 'Şifre başarıyla güncellendi!' 
  });
});

// export default app satırı en altta kalmaya devam etsin

export default app;