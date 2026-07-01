import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import showsRoutes from './routes/shows';
import albumsRoutes from './routes/albums';
import tracksRoutes from './routes/tracks';
import repertoireRoutes from './routes/repertoire';
import searchRoutes from './routes/search';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  credentials: true,
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', showsRoutes);
app.use('/api', albumsRoutes);
app.use('/api', tracksRoutes);
app.use('/api', repertoireRoutes);
app.use('/api', searchRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
