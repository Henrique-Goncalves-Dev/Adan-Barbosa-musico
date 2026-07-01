import { Router, Request, Response } from 'express';

const router = Router();

router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query || query.trim().length < 2) {
    res.json([]);
    return;
  }

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=10&entity=song`;
    const response = await fetch(url);
    const data = await response.json();

    const results = (data.results || []).map((item: any) => ({
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      imageUrl: item.artworkUrl100?.replace('100x100', '300x300') || '',
    }));

    res.json(results);
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao buscar músicas.' });
  }
});

export default router;
