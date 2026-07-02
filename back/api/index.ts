import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth';
import showsRoutes from '../src/routes/shows';
import albumsRoutes from '../src/routes/albums';
import tracksRoutes from '../src/routes/tracks';
import repertoireRoutes from '../src/routes/repertoire';
import searchRoutes from '../src/routes/search';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:4000',
    'https://adanbarbosa.com.br',
    'https://www.adanbarbosa.com.br',
    'https://adan-barbosa-musico.vercel.app/,'
    
  ],
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

export default app;
