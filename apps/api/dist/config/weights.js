"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeightsForRole = getWeightsForRole;
const shared_1 = require("@placementos/shared");
function getWeightsForRole(targetRole) {
    const normalizedRole = targetRole.toLowerCase();
    // Role archetype detection without rigid restriction
    if (normalizedRole.includes('engineer') ||
        normalizedRole.includes('developer') ||
        normalizedRole.includes('sde') ||
        normalizedRole.includes('devops') ||
        normalizedRole.includes('cloud') ||
        normalizedRole.includes('architect')) {
        return shared_1.DEFAULT_ROLE_WEIGHTS.engineering;
    }
    if (normalizedRole.includes('product') ||
        normalizedRole.includes('analyst') ||
        normalizedRole.includes('consultant') ||
        normalizedRole.includes('strategy')) {
        return shared_1.DEFAULT_ROLE_WEIGHTS.product;
    }
    if (normalizedRole.includes('sales') ||
        normalizedRole.includes('marketing') ||
        normalizedRole.includes('business development') ||
        normalizedRole.includes('hr') ||
        normalizedRole.includes('human resources') ||
        normalizedRole.includes('recruiter')) {
        return shared_1.DEFAULT_ROLE_WEIGHTS.business;
    }
    return shared_1.DEFAULT_ROLE_WEIGHTS.default;
}
