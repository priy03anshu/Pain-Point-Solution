"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../common/utils/response");
class AuthController {
    static async register(req, res, next) {
        try {
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip;
            const result = await auth_service_1.AuthService.register(req.body, userAgent, ipAddress);
            (0, response_1.sendCreated)(res, result, 'Registration successful');
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip;
            const result = await auth_service_1.AuthService.login(req.body, userAgent, ipAddress);
            (0, response_1.sendSuccess)(res, result, 'Login successful');
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await auth_service_1.AuthService.refresh(refreshToken);
            (0, response_1.sendSuccess)(res, result, 'Token refreshed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            if (req.user) {
                await auth_service_1.AuthService.logout(req.user.userId);
            }
            (0, response_1.sendSuccess)(res, { loggedOut: true }, 'Logged out successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getMe(req, res, next) {
        try {
            const user = await auth_service_1.AuthService.getMe(req.user.userId);
            (0, response_1.sendSuccess)(res, user);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
