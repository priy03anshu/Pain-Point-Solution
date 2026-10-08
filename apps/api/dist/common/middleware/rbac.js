"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const AppError_1 = require("../errors/AppError");
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError_1.UnauthorizedError();
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError_1.ForbiddenError(`Access restricted to roles: ${allowedRoles.join(', ')}`);
        }
        next();
    };
}
