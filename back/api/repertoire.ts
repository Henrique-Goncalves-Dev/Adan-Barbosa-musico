import { VercelRequest, VercelResponse } from '@vercel/node';
import app from './index';

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res);
}
