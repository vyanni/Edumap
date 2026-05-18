import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import raw Express app factory
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { authentication } from './middleware/authentication.js';
import courseRoutes from './routes/courseRoutes.js';
import programRoutes from './routes/programRoutes.js';
import termRoutes from './routes/termRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

// Create a fresh app instance
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

// Routes
app.use('/api/test', testRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/terms', termRoutes);
app.use(authentication);
app.use('/api/users', userRoutes);

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
