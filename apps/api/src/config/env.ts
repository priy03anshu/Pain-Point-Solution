import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or local
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const accessSecret =
  process.env.JWT_ACCESS_SECRET ||
  (environment === 'production' ? '' : 'placementos_super_secret_access_key_2026_dev_mode');
const refreshSecret =
  process.env.JWT_REFRESH_SECRET ||
  (environment === 'production' ? '' : 'placementos_super_secret_refresh_key_2026_dev_mode');

if (environment === 'production') {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured in production.');
  }
  if (accessSecret.length < 32 || refreshSecret.length < 32) {
    throw new Error('Production JWT secrets must each be at least 32 characters.');
  }
  if (accessSecret === refreshSecret) {
    throw new Error('Production JWT access and refresh secrets must be different.');
  }
  if (!process.env.WEB_URL) {
    throw new Error('WEB_URL must be configured in production.');
  }
}

export const config = {
  env: environment,
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placementos',
  jwt: {
    accessSecret,
    refreshSecret,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  corsOrigin: process.env.WEB_URL || 'http://localhost:3000'
};
