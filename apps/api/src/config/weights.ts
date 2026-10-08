import { DimensionWeights, DEFAULT_ROLE_WEIGHTS } from '@placementos/shared';

export function getWeightsForRole(targetRole: string): DimensionWeights {
  const normalizedRole = targetRole.toLowerCase();

  // Role archetype detection without rigid restriction
  if (
    normalizedRole.includes('engineer') ||
    normalizedRole.includes('developer') ||
    normalizedRole.includes('sde') ||
    normalizedRole.includes('devops') ||
    normalizedRole.includes('cloud') ||
    normalizedRole.includes('architect')
  ) {
    return DEFAULT_ROLE_WEIGHTS.engineering;
  }

  if (
    normalizedRole.includes('product') ||
    normalizedRole.includes('analyst') ||
    normalizedRole.includes('consultant') ||
    normalizedRole.includes('strategy')
  ) {
    return DEFAULT_ROLE_WEIGHTS.product;
  }

  if (
    normalizedRole.includes('sales') ||
    normalizedRole.includes('marketing') ||
    normalizedRole.includes('business development') ||
    normalizedRole.includes('hr') ||
    normalizedRole.includes('human resources') ||
    normalizedRole.includes('recruiter')
  ) {
    return DEFAULT_ROLE_WEIGHTS.business;
  }

  return DEFAULT_ROLE_WEIGHTS.default;
}
