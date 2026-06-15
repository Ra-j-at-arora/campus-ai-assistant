import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors/AppError';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = (err as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409;
    errorCode = 'CONFLICT_ERROR';
    message = 'Duplicate key error: Resource already exists';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'AUTH_ERROR';
    message = 'Invalid token';
  }

  // Fallback logging for unhandled errors
  if (statusCode === 500) {
    console.error('Unhandled Exception:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
};
