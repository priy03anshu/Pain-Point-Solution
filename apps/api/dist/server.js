"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const env_1 = require("./config/env");
async function bootstrap() {
    try {
        await (0, database_1.connectDB)();
        const server = app_1.default.listen(env_1.config.port, () => {
            console.log(`[PlacementOS API] Server running in ${env_1.config.env} mode on port ${env_1.config.port}`);
            console.log(`[PlacementOS API] Base URL: http://localhost:${env_1.config.port}/api/v1`);
        });
        const shutdown = async () => {
            console.log('\n[PlacementOS API] Gracefully shutting down...');
            server.close(() => {
                console.log('[PlacementOS API] HTTP server closed.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        console.error('[PlacementOS API] Failed to start server:', error);
        process.exit(1);
    }
}
bootstrap();
