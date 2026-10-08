import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): Response {
  return sendSuccess(res, data, message, 201);
}
