import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db, collection, getDocs } from '../firebase';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = 1800;

router.post('/auth', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
    return;
  }

  try {
    const snap = await getDocs(collection(db, 'users'));
    const user = snap.docs.find((d) => {
      const data = d.data();
      return data.username === username && data.password === password;
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
      return;
    }

    const userData = user.data();
    const token = jwt.sign(
      { username: userData.username, displayName: userData.displayName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      username: userData.username,
      displayName: userData.displayName,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Erro ao autenticar.' });
  }
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
