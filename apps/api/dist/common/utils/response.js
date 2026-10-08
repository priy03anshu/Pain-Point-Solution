"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
function sendSuccess(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}
function sendCreated(res, data, message = 'Created successfully') {
    return sendSuccess(res, data, message, 201);
}
