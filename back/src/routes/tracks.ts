import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from '../firebase';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const COL = 'tracks';

interface Track {
  id: string;
  title: string;
  type: string;
  albumId: string;
  year: string;
  imageUrl: string;
  youtubeUrl: string;
  spotifyUrl: string;
}

function authMiddleware(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Não autorizado.' });
    return;
  }
  try {
    jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido.' });
  }
}

router.get('/tracks', async (req: Request, res: Response) => {
  try {
    const snap = await getDocs(collection(db, COL));
    let tracks = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Track[];
    if (req.query.albumId) {
      tracks = tracks.filter((t) => t.albumId === req.query.albumId);
    }
    res.json(tracks);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/tracks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = {
      title: req.body.title || '',
      type: req.body.type || 'musica',
      albumId: req.body.albumId || '',
      year: req.body.year || '',
      imageUrl: req.body.imageUrl || '',
      youtubeUrl: req.body.youtubeUrl || '',
      spotifyUrl: req.body.spotifyUrl || '',
    };
    const docRef = await addDoc(collection(db, COL), data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/tracks/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, ...rest } = req.body;
    await updateDoc(doc(db, COL, req.params.id), rest);
    res.json({ id: req.params.id, ...rest });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/tracks/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await deleteDoc(doc(db, COL, req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
