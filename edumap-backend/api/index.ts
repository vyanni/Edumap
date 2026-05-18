import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../dist/server.js';

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
