"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const zod_1 = require("zod");
const AppError_1 = require("../errors/AppError");
function validateBody(schema) {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const issues = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                next(new AppError_1.BadRequestError('Validation failed', issues));
            }
            else {
                next(error);
            }
        }
    };
}
