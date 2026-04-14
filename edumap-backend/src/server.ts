import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Keep the .js extension here! 
import { authentication } from './middleware/authentication.js';

import courseRoutes from './routes/courseRoutes.js';
// import modRoutes from './routes/modRoutes.js';
import programRoutes from './routes/programRoutes.js';
import termRoutes from './routes/termRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 1. PUBLIC
app.use('/api/courses', courseRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/terms', termRoutes);
// app.use('/api/modifications', modRoutes); 

// 2. THE AUTH WALL
// This is a "Global" middleware for everything defined AFTER this point
app.use(authentication); 

// 3. PROTECTED
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend active on: http://localhost:${PORT}`);
});