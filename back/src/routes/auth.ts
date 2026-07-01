import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../data/users';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = 86400;

router.post('/auth', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
    return;
  }

  const user = users[username];

  if (!user || user.password !== password) {
    res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
    return;
  }

  const token = jwt.sign(
    { username: user.username, displayName: user.displayName },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({
    success: true,
    token,
    username: user.username,
    displayName: user.displayName,
  });
});

router.get('/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
  }
});

export default router;
