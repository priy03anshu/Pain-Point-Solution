import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or local
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placementos',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'placementos_super_secret_access_key_2026_dev_mode',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'placementos_super_secret_refresh_key_2026_dev_mode',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  corsOrigin: process.env.WEB_URL || 'http://localhost:3000'
};
