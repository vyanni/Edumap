import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authentication } from './middleware/authentication.js';

import cookieParser from 'cookie-parser';
import courseRoutes from './routes/courseRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/courses', courseRoutes); 

app.listen(5000);