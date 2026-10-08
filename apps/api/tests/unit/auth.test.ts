import { hashPassword, comparePassword } from '../../src/common/utils/hash';
import { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from '../../src/common/utils/jwt';

describe('Auth Security Utilities (Unit Tests)', () => {
  test('Hashes passwords securely with bcrypt salt', async () => {
    const raw = 'SuperSecurePass123';
    const hash = await hashPassword(raw);

    expect(hash).not.toEqual(raw);
    expect(hash.startsWith('$2')).toBe(true);

    const isMatch = await comparePassword(raw, hash);
    expect(isMatch).toBe(true);

    const isWrong = await comparePassword('WrongPassword', hash);
    expect(isWrong).toBe(false);
  });

  test('Signs and verifies valid JWT access and refresh tokens', () => {
    const payload = {
      userId: 'test_user_123',
      email: 'student@placementos.com',
      role: 'student'
    };

    const accessToken = generateAccessToken(payload);
    expect(typeof accessToken).toBe('string');

    const decoded = verifyAccessToken(accessToken);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);

    const refreshToken = generateRefreshToken(payload);
    const decodedRefresh = verifyRefreshToken(refreshToken);
    expect(decodedRefresh.userId).toBe(payload.userId);
  });
});
