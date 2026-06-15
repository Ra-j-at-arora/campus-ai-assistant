import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import libraryRoutes from './routes/libraryRoutes';
import eventRoutes from './routes/eventRoutes';
import cafeteriaRoutes from './routes/cafeteriaRoutes';
import academicRoutes from './routes/academicRoutes';
import chatRoutes from './routes/chatRoutes';
import healthRoutes from './routes/healthRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

import { errorHandler } from './middlewares/errorHandler';

dotenv.config({ override: true });

// Connect to MongoDB
connectDB();

const app = express();

// Production Hardening: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
// 1. Request Size Limits
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 2. CORS restrictions (configured for Production vs Dev)
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Security Headers
app.use(helmet());

// (NoSQL sanitization handled strictly via Zod schemas)

// 5. Rate Limiting applies to all routes
app.use('/api', limiter);

// 6. Request Logging
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/cafeteria', cafeteriaRoutes);
app.use('/api/v1/academics', academicRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Global Error Handler must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
