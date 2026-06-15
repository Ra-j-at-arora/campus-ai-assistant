import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ai } from '../ai/config/gemini';

const checkDbConnection = () => mongoose.connection.readyState === 1;

export const checkLibraryHealth = async (req: Request, res: Response) => {
  const isHealthy = checkDbConnection();
  res.status(isHealthy ? 200 : 503).json({ status: isHealthy ? 'healthy' : 'unhealthy' });
};

export const checkEventsHealth = async (req: Request, res: Response) => {
  const isHealthy = checkDbConnection();
  res.status(isHealthy ? 200 : 503).json({ status: isHealthy ? 'healthy' : 'unhealthy' });
};

export const checkCafeteriaHealth = async (req: Request, res: Response) => {
  const isHealthy = checkDbConnection();
  res.status(isHealthy ? 200 : 503).json({ status: isHealthy ? 'healthy' : 'unhealthy' });
};

export const checkAcademicHealth = async (req: Request, res: Response) => {
  const isHealthy = checkDbConnection();
  res.status(isHealthy ? 200 : 503).json({ status: isHealthy ? 'healthy' : 'unhealthy' });
};

export const checkAiHealth = async (req: Request, res: Response) => {
  try {
    // Quick ping to check if API key exists
    if (!process.env.GEMINI_API_KEY) throw new Error('No API key');
    res.status(200).json({ status: 'healthy' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy' });
  }
};
