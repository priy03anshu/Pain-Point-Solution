"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from root or local
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
dotenv_1.default.config();
exports.config = {
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
