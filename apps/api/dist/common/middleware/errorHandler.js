"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
function errorHandler(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details || null
        });
        return;
    }
    console.error('[Unhandled Server Error]', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : null
    });
}
