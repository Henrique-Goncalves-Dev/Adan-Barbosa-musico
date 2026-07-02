import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '../firebase';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const COL = 'shows';

interface Show {
  id: string;
  month: string;
  day: string;
  year: string;
  city: string;
  street: string;
  venue: string;
  time: string;
  available: boolean;
  status?: string;
}

const MONTH_ORDER: Record<string, number> = {
  JAN: 1, FEV: 2, MAR: 3, ABR: 4, MAI: 5, JUN: 6,
  JUL: 7, AGO: 8, SET: 9, OUT: 10, NOV: 11, DEZ: 12,
};

function isShowPast(show: Show): boolean {
  const now = new Date();
  const monthNum = MONTH_ORDER[show.month];
  if (!monthNum) return false;
  const showDate = new Date(parseInt(show.year), monthNum - 1, parseInt(show.day));
  return showDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function sortShows(shows: Show[]): Show[] {
  return [...shows].sort((a, b) => {
    const ya = parseInt(a.year) || 0, yb = parseInt(b.year) || 0;
    if (ya !== yb) return ya - yb;
    const ma = MONTH_ORDER[a.month] || 0, mb = MONTH_ORDER[b.month] || 0;
    if (ma !== mb) return ma - mb;
    return parseInt(a.day) - parseInt(b.day);
  });
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

router.get('/shows', async (_req: Request, res: Response) => {
  try {
    const snap = await getDocs(collection(db, COL));
    const shows = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Show[];
    const now = new Date();
    const updated = shows.map((s) => {
      if (isShowPast(s) && s.available) {
        return { ...s, available: false, status: 'finalizado' };
      }
      return s;
    });
    res.json(sortShows(updated));
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/shows', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = {
      month: req.body.month || '',
      day: req.body.day || '',
      year: req.body.year || '',
      city: req.body.city || '',
      street: req.body.street || '',
      venue: req.body.venue || '',
      time: req.body.time || '',
      available: req.body.available ?? true,
      status: '',
    };
    const docRef = await addDoc(collection(db, COL), data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/shows/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, ...rest } = req.body;
    await updateDoc(doc(db, COL, req.params.id), rest);
    res.json({ id: req.params.id, ...rest });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/shows/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await deleteDoc(doc(db, COL, req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
