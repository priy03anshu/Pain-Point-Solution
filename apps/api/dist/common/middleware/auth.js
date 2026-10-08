"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../errors/AppError");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError_1.UnauthorizedError('Authentication token missing or invalid format');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        throw new AppError_1.UnauthorizedError('Session expired or token invalid');
    }
}
