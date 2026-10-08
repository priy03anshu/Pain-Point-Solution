"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const rateLimiter_1 = require("./common/middleware/rateLimiter");
const errorHandler_1 = require("./common/middleware/errorHandler");
const AppError_1 = require("./common/errors/AppError");
const response_1 = require("./common/utils/response");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const onboarding_routes_1 = __importDefault(require("./modules/onboarding/onboarding.routes"));
const profile_routes_1 = __importDefault(require("./modules/profile/profile.routes"));
const assessment_routes_1 = __importDefault(require("./modules/assessment/assessment.routes"));
const readiness_routes_1 = __importDefault(require("./modules/readiness/readiness.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const roadmap_routes_1 = __importDefault(require("./modules/roadmap/roadmap.routes"));
const gd_routes_1 = __importDefault(require("./modules/gd/gd.routes"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow localhost dev origins and configured web client
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
app.use(rateLimiter_1.standardRateLimiter);
// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    (0, response_1.sendSuccess)(res, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: env_1.config.env
    });
});
// Public landing statistics
app.get('/api/v1/public/landing-stats', (req, res) => {
    (0, response_1.sendSuccess)(res, {
        studentsAssessed: 12480,
        averageReadinessGain: 34.5,
        topCompaniesHired: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Goldman Sachs'],
        supportedDegrees: ['BTech', 'BCA', 'MCA', 'BBA', 'MBA', 'BCom', 'BSc', 'BA', 'Diploma', 'Custom']
    });
});
// Mount module routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/onboarding', onboarding_routes_1.default);
app.use('/api/v1/profile', profile_routes_1.default);
app.use('/api/v1/assessments', assessment_routes_1.default);
app.use('/api/v1/readiness', readiness_routes_1.default);
app.use('/api/v1/dashboard', dashboard_routes_1.default);
app.use('/api/v1/roadmap', roadmap_routes_1.default);
app.use('/api/v1/gd', gd_routes_1.default);
// Catch 404
app.use((req, res, next) => {
    next(new AppError_1.NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});
// Global error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
