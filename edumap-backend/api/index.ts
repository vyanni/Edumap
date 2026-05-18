import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        /\.vercel\.app$/,
        /^https:\/\/edumap/
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Import routes
import courseRoutes from '../src/routes/courseRoutes.js';
import programRoutes from '../src/routes/programRoutes.js';
import termRoutes from '../src/routes/termRoutes.js';
import userRoutes from '../src/routes/userRoutes.js';
import testRoutes from '../src/routes/testRoutes.js';
import { authentication } from '../src/middleware/authentication.js';

app.use('/api/courses', courseRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/terms', termRoutes);
app.use('/api/test', testRoutes);
app.use(authentication);
app.use('/api/users', userRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Edumap API is running' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message });
});

// Vercel serverless handler
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
