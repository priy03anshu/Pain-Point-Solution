import { getWeightsForRole } from '../../src/config/weights';
import { DEFAULT_ROLE_WEIGHTS, READINESS_DIMENSIONS } from '@placementos/shared';

describe('Deterministic Readiness Scoring Logic (Unit Tests)', () => {
  test('All default dimension weights must strictly sum to 1.0 (100%)', () => {
    Object.entries(DEFAULT_ROLE_WEIGHTS).forEach(([archetype, weights]) => {
      const sum = Object.values(weights).reduce((acc, w) => acc + w, 0);
      expect(Math.abs(sum - 1.0)).toBeLessThan(0.0001);
    });
  });

  test('All 8 dimensions are defined in weight archetypes', () => {
    Object.values(DEFAULT_ROLE_WEIGHTS).forEach((weights) => {
      READINESS_DIMENSIONS.forEach((dim) => {
        expect(weights[dim]).toBeDefined();
        expect(weights[dim]).toBeGreaterThan(0);
      });
    });
  });

  test('Dynamically adapts weights based on target role', () => {
    const sdeWeights = getWeightsForRole('Software Development Engineer');
    expect(sdeWeights.technical).toBe(0.25);
    expect(sdeWeights.communication).toBe(0.10);

    const bizWeights = getWeightsForRole('Business Development / Sales Lead');
    expect(bizWeights.technical).toBe(0.10);
    expect(bizWeights.communication).toBe(0.25);

    const productWeights = getWeightsForRole('Associate Product Manager');
    expect(productWeights.problemSolving).toBe(0.25);
  });

  test('Calculates weighted score deterministically within bounds [0, 100]', () => {
    const weights = getWeightsForRole('Software Engineer');
    const perfectScores = {
      technical: 100,
      problemSolving: 100,
      roleMatch: 100,
      communication: 100,
      interview: 100,
      resume: 100,
      profile: 100,
      consistency: 100
    };

    let total = 0;
    for (const key of Object.keys(weights) as (keyof typeof weights)[]) {
      total += weights[key] * perfectScores[key];
    }

    expect(Math.round(total)).toBe(100);

    const zeroScores = {
      technical: 0,
      problemSolving: 0,
      roleMatch: 0,
      communication: 0,
      interview: 0,
      resume: 0,
      profile: 0,
      consistency: 0
    };

    let zeroTotal = 0;
    for (const key of Object.keys(weights) as (keyof typeof weights)[]) {
      zeroTotal += weights[key] * zeroScores[key];
    }

    expect(Math.round(zeroTotal)).toBe(0);
  });

  test('Correctly identifies top improvement opportunities by potential point gain', () => {
    const weights = getWeightsForRole('Software Engineer');
    // Scores where technical is low (30), communication is high (90)
    const scores = {
      technical: 30, // gap 70 * 0.25 = 17.5 potential gain
      problemSolving: 50, // gap 50 * 0.20 = 10 potential gain
      roleMatch: 40, // gap 60 * 0.15 = 9 potential gain
      communication: 90, // gap 10 * 0.10 = 1 potential gain
      interview: 60,
      resume: 50,
      profile: 70,
      consistency: 80
    };

    const opportunities = (Object.keys(weights) as (keyof typeof weights)[])
      .map((dim) => {
        const gap = 100 - scores[dim];
        return {
          dim,
          potentialGain: gap * weights[dim]
        };
      })
      .sort((a, b) => b.potentialGain - a.potentialGain);

    // Technical must be #1 improvement opportunity
    expect(opportunities[0].dim).toBe('technical');
    expect(opportunities[0].potentialGain).toBeCloseTo(17.5, 1);
  });
});
