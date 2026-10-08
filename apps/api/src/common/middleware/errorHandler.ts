import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || null
    });
    return;
  }

  console.error('[Unhandled Server Error]', err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : null
  });
}
