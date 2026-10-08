"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectDB() {
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(env_1.config.mongoUri);
        console.log(`[Database] MongoDB connected successfully to ${env_1.config.mongoUri}`);
    }
    catch (error) {
        console.error('[Database] MongoDB connection error:', error);
        process.exit(1);
    }
}
async function disconnectDB() {
    await mongoose_1.default.disconnect();
}
