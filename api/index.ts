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

export default app;