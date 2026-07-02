import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:4000',
    'https://adanbarbosa.com.br',
    'https://www.adanbarbosa.com.br',
    'https://adan-barbosa-musico.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());

// Firebase lazy init
let _db: any = null;
async function getDb() {
  if (!_db) {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    const app = initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    });
    _db = getFirestore(app);
  }
  return _db;
}

// Auth middleware
function authMiddleware(req: any, res: any, next: any) {
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

// ── AUTH ──
app.post('/api/auth', async (req: any, res: any) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
    return;
  }
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const db = await getDb();
    const snap = await getDocs(collection(db, 'users'));
    const user = snap.docs.find((d: any) => {
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
      { expiresIn: 1800 }
    );
    res.json({ success: true, token, username: userData.username, displayName: userData.displayName });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao autenticar.' });
  }
});

app.get('/api/auth/verify', (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token não fornecido.' });
    return;
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
  }
});

// ── SHOWS ──
const MONTH_ORDER: Record<string, number> = {
  JAN: 1, FEV: 2, MAR: 3, ABR: 4, MAI: 5, JUN: 6,
  JUL: 7, AGO: 8, SET: 9, OUT: 10, NOV: 11, DEZ: 12,
};

function sortShows(shows: any[]): any[] {
  return [...shows].sort((a: any, b: any) => {
    const ya = parseInt(a.year) || 0, yb = parseInt(b.year) || 0;
    if (ya !== yb) return ya - yb;
    const ma = MONTH_ORDER[a.month] || 0, mb = MONTH_ORDER[b.month] || 0;
    if (ma !== mb) return ma - mb;
    return parseInt(a.day) - parseInt(b.day);
  });
}

function isShowPast(show: any): boolean {
  const now = new Date();
  const monthNum = MONTH_ORDER[show.month];
  if (!monthNum) return false;
  const showDate = new Date(parseInt(show.year), monthNum - 1, parseInt(show.day));
  return showDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

app.get('/api/shows', async (_req: any, res: any) => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const db = await getDb();
    const snap = await getDocs(collection(db, 'shows'));
    const shows = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const updated = shows.map((s: any) => {
      if (isShowPast(s) && s.available) return { ...s, available: false, status: 'finalizado' };
      return s;
    });
    res.json(sortShows(updated));
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/shows', authMiddleware, async (req: any, res: any) => {
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    const db = await getDb();
    const data = {
      month: req.body.month || '', day: req.body.day || '', year: req.body.year || '',
      city: req.body.city || '', street: req.body.street || '', venue: req.body.venue || '',
      time: req.body.time || '', available: req.body.available ?? true, status: '',
    };
    const docRef = await addDoc(collection(db, 'shows'), data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/shows/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const db = await getDb();
    const { id, ...rest } = req.body;
    await updateDoc(doc(db, 'shows', req.params.id), rest);
    res.json({ id: req.params.id, ...rest });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/shows/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const db = await getDb();
    await deleteDoc(doc(db, 'shows', req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ALBUMS ──
app.get('/api/albums', async (_req: any, res: any) => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const db = await getDb();
    const snap = await getDocs(collection(db, 'albums'));
    res.json(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/albums', authMiddleware, async (req: any, res: any) => {
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    const db = await getDb();
    const data = { name: req.body.name || '', year: req.body.year || '', imageUrl: req.body.imageUrl || '', youtubeUrl: req.body.youtubeUrl || '', spotifyUrl: req.body.spotifyUrl || '' };
    const docRef = await addDoc(collection(db, 'albums'), data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/albums/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const db = await getDb();
    const { id, ...rest } = req.body;
    await updateDoc(doc(db, 'albums', req.params.id), rest);
    res.json({ id: req.params.id, ...rest });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/albums/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const db = await getDb();
    await deleteDoc(doc(db, 'albums', req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── TRACKS ──
app.get('/api/tracks', async (req: any, res: any) => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const db = await getDb();
    const snap = await getDocs(collection(db, 'tracks'));
    let tracks = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    if (req.query.albumId) tracks = tracks.filter((t: any) => t.albumId === req.query.albumId);
    res.json(tracks);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/tracks', authMiddleware, async (req: any, res: any) => {
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    const db = await getDb();
    const data = { title: req.body.title || '', type: req.body.type || 'musica', albumId: req.body.albumId || '', year: req.body.year || '', imageUrl: req.body.imageUrl || '', youtubeUrl: req.body.youtubeUrl || '', spotifyUrl: req.body.spotifyUrl || '' };
    const docRef = await addDoc(collection(db, 'tracks'), data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/tracks/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const db = await getDb();
    const { id, ...rest } = req.body;
    await updateDoc(doc(db, 'tracks', req.params.id), rest);
    res.json({ id: req.params.id, ...rest });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/tracks/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const db = await getDb();
    await deleteDoc(doc(db, 'tracks', req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── REPERTOIRE ──
app.get('/api/repertoire', async (_req: any, res: any) => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const db = await getDb();
    const snap = await getDocs(collection(db, 'repertoire'));
    res.json(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/repertoire/categories', authMiddleware, async (req: any, res: any) => {
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    const db = await getDb();
    const data = { name: req.body.name || '', icon: req.body.icon || '🎵', songs: [] };
    const docRef = await addDoc(collection(db, 'repertoire'), data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/repertoire/categories/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const db = await getDb();
    const { id, ...rest } = req.body;
    await updateDoc(doc(db, 'repertoire', req.params.id), rest);
    res.json({ id: req.params.id, ...rest });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/repertoire/categories/:id', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const db = await getDb();
    await deleteDoc(doc(db, 'repertoire', req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/repertoire/songs', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, getDocs, collection, updateDoc } = await import('firebase/firestore');
    const db = await getDb();
    const catSnap = await getDocs(collection(db, 'repertoire'));
    const catDoc = catSnap.docs.find((d: any) => d.id === req.body.categoryId);
    if (!catDoc) { res.status(404).json({ success: false, message: 'Categoria não encontrada.' }); return; }
    const catData = catDoc.data();
    const newSong = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), categoryId: req.body.categoryId, title: req.body.title || '', artist: req.body.artist || '', key: req.body.key || '', capo: req.body.capo || '' };
    const songs = [...(catData.songs || []), newSong];
    await updateDoc(doc(db, 'repertoire', req.body.categoryId), { songs });
    res.status(201).json(newSong);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/repertoire/songs/:categoryId/:songId', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, getDocs, collection, updateDoc } = await import('firebase/firestore');
    const db = await getDb();
    const catSnap = await getDocs(collection(db, 'repertoire'));
    const catDoc = catSnap.docs.find((d: any) => d.id === req.params.categoryId);
    if (!catDoc) { res.status(404).json({ success: false, message: 'Categoria não encontrada.' }); return; }
    const catData = catDoc.data();
    const songs = (catData.songs || []).filter((s: any) => s.id !== req.params.songId);
    await updateDoc(doc(db, 'repertoire', req.params.categoryId), { songs });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/repertoire/songs/move', authMiddleware, async (req: any, res: any) => {
  try {
    const { doc, getDocs, collection, updateDoc } = await import('firebase/firestore');
    const db = await getDb();
    const { fromCategoryId, toCategoryId, songId } = req.body;
    if (!fromCategoryId || !toCategoryId || !songId) {
      res.status(400).json({ success: false, message: 'fromCategoryId, toCategoryId e songId são obrigatórios.' });
      return;
    }
    const catSnap = await getDocs(collection(db, 'repertoire'));
    const fromCat = catSnap.docs.find((d: any) => d.id === fromCategoryId);
    const toCat = catSnap.docs.find((d: any) => d.id === toCategoryId);
    if (!fromCat) { res.status(404).json({ success: false, message: 'Categoria de origem não encontrada.' }); return; }
    if (!toCat) { res.status(404).json({ success: false, message: 'Categoria de destino não encontrada.' }); return; }
    const fromData = fromCat.data();
    const toData = toCat.data();
    const song = (fromData.songs || []).find((s: any) => s.id === songId);
    if (!song) { res.status(404).json({ success: false, message: 'Música não encontrada.' }); return; }
    const updatedSong = { ...song, categoryId: toCategoryId };
    const fromSongs = (fromData.songs || []).filter((s: any) => s.id !== songId);
    const toSongs = [...(toData.songs || []), updatedSong];
    await updateDoc(doc(db, 'repertoire', fromCategoryId), { songs: fromSongs });
    await updateDoc(doc(db, 'repertoire', toCategoryId), { songs: toSongs });
    res.json({ success: true, song: updatedSong });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── SEARCH ──
app.get('/api/search', async (req: any, res: any) => {
  const q = req.query.q as string;
  if (!q || q.trim().length < 2) { res.json([]); return; }
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&limit=10&entity=song`);
    const data = await response.json();
    const results = (data.results || []).map((item: any) => ({
      title: item.trackName, artist: item.artistName, album: item.collectionName,
      imageUrl: item.artworkUrl100?.replace('100x100', '300x300') || '',
    }));
    res.json(results);
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao buscar músicas.' });
  }
});

// ── HEALTH ──
app.get('/api/health', (_req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res);
}
