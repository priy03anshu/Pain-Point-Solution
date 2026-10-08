import app from './app';
import { connectDB } from './config/database';
import { config } from './config/env';

async function bootstrap() {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`[PlacementOS API] Server running in ${config.env} mode on port ${config.port}`);
      console.log(`[PlacementOS API] Base URL: http://localhost:${config.port}/api/v1`);
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
  } catch (error) {
    console.error('[PlacementOS API] Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
