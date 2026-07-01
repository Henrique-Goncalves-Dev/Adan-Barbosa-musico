import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '../firebase';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const COL = 'repertoire';

interface RepertoireSong {
  id: string;
  categoryId: string;
  title: string;
  artist: string;
  key: string;
  capo: string;
}

interface RepertoireCategory {
  id: string;
  name: string;
  icon: string;
  songs: RepertoireSong[];
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

router.get('/repertoire', async (_req: Request, res: Response) => {
  try {
    const snap = await getDocs(collection(db, COL));
    const categories = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as RepertoireCategory[];
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/repertoire/categories', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = {
      name: req.body.name || '',
      icon: req.body.icon || '🎵',
      songs: [],
    };
    const docRef = await addDoc(collection(db, COL), data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/repertoire/categories/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await deleteDoc(doc(db, COL, req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/repertoire/songs', authMiddleware, async (req: Request, res: Response) => {
  try {
    const catRef = doc(db, COL, req.body.categoryId);
    const catSnap = await getDocs(collection(db, COL));
    const catDoc = catSnap.docs.find((d) => d.id === req.body.categoryId);

    if (!catDoc) {
      res.status(404).json({ success: false, message: 'Categoria não encontrada.' });
      return;
    }

    const catData = catDoc.data() as RepertoireCategory;
    const newSong: RepertoireSong = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      categoryId: req.body.categoryId,
      title: req.body.title || '',
      artist: req.body.artist || '',
      key: req.body.key || '',
      capo: req.body.capo || '',
    };

    const songs = [...(catData.songs || []), newSong];
    await updateDoc(catRef, { songs });

    res.status(201).json(newSong);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/repertoire/songs/:categoryId/:songId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const catRef = doc(db, COL, req.params.categoryId);
    const catSnap = await getDocs(collection(db, COL));
    const catDoc = catSnap.docs.find((d) => d.id === req.params.categoryId);

    if (!catDoc) {
      res.status(404).json({ success: false, message: 'Categoria não encontrada.' });
      return;
    }

    const catData = catDoc.data() as RepertoireCategory;
    const songs = (catData.songs || []).filter((s: RepertoireSong) => s.id !== req.params.songId);
    await updateDoc(catRef, { songs });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
