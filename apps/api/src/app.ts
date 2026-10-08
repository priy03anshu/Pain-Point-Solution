import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { standardRateLimiter } from './common/middleware/rateLimiter';
import { errorHandler } from './common/middleware/errorHandler';
import { NotFoundError } from './common/errors/AppError';
import { sendSuccess } from './common/utils/response';

import authRoutes from './modules/auth/auth.routes';
import onboardingRoutes from './modules/onboarding/onboarding.routes';
import profileRoutes from './modules/profile/profile.routes';
import assessmentRoutes from './modules/assessment/assessment.routes';
import readinessRoutes from './modules/readiness/readiness.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import roadmapRoutes from './modules/roadmap/roadmap.routes';
import gdRoutes from './modules/gd/gd.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === config.corsOrigin ||
        (config.env !== 'production' && origin.startsWith('http://localhost:'))
      ) {
        callback(null, true);
      } else {
        callback(new Error('Origin is not allowed by CORS.'));
      }
    },
    credentials: true
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(standardRateLimiter);

// Health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

// Public landing statistics
app.get('/api/v1/public/landing-stats', (req: Request, res: Response) => {
  sendSuccess(res, {
    studentsAssessed: 12480,
    averageReadinessGain: 34.5,
    topCompaniesHired: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Goldman Sachs'],
    supportedDegrees: ['BTech', 'BCA', 'MCA', 'BBA', 'MBA', 'BCom', 'BSc', 'BA', 'Diploma', 'Custom']
  });
});

// Mount module routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/readiness', readinessRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/roadmap', roadmapRoutes);
app.use('/api/v1/gd', gdRoutes);

// Catch 404
app.use((req: Request, res: Response, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

export default app;
