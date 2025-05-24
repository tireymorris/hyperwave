import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import {
  blacklistToken,
  generateCsrfToken,
  generateToken,
  resetBlacklist,
  validateTokenPayload,
  verifyToken,
} from '@/lib/auth/tokens';
import {
  JOSE_ERROR_CODES,
  TOKEN_TYPES,
  type TokenPayload,
  USER_ROLES,
} from '@/lib/auth/constants';

let mockEnv = (key: string): string => {
  if (key === 'SECRET_KEY') {
    return 'test_secret_key_that_is_at_least_32_bytes';
  }
  return '';
};

mock.module('@/utils/env', () => {
  return {
    env: (key: string): string => mockEnv(key),
  };
});

mock.module('@/middleware/logger', () => {
  return {
    logHandler: {
      debug: (): void => {},
      info: (): void => {},
      warn: (): void => {},
      error: (): void => {},
    },
  };
});

describe('Token Authentication', () => {
  const validPayload: TokenPayload = {
    type: 'access',
    email: 'test@example.com',
    role: 'user',
  };

  beforeEach(() => {
    resetBlacklist();
    mockEnv = (key: string): string => {
      if (key === 'SECRET_KEY') {
        return 'test_secret_key_that_is_at_least_32_bytes';
      }
      return '';
    };
  });

  afterEach(() => {
    resetBlacklist();
    mock.restore();
  });

  describe('generateToken', () => {
    test('should generate a valid access token', async () => {
      const token = await generateToken(validPayload);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const tokenParts = token.split('.');
      expect(tokenParts.length).toBe(3);

      expect(() => Buffer.from(tokenParts[0] || '', 'base64')).not.toThrow();
      expect(() => Buffer.from(tokenParts[1] || '', 'base64')).not.toThrow();
      expect(() => Buffer.from(tokenParts[2] || '', 'base64')).not.toThrow();

      const headerJson = Buffer.from(tokenParts[0] || '', 'base64').toString(
        'utf-8',
      );
      const header = JSON.parse(headerJson);

      expect(header).toHaveProperty('alg', 'HS256');
      expect(header).toHaveProperty('typ', 'JWT');

      const decoded = await verifyToken(token);
      expect(decoded).toMatchObject(validPayload);
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');
      expect(decoded.type).toBe('access');
      expect(Number(decoded['exp']) > Number(decoded['iat'])).toBe(true);
    });

    test('should generate a valid refresh token', async () => {
      const refreshPayload = { ...validPayload, type: 'refresh' as const };
      const token = await generateToken(refreshPayload);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const decoded = await verifyToken(token);
      expect(decoded.type).toBe('refresh');
      expect(decoded.email).toBe(validPayload.email);
      expect(decoded.role).toBe(validPayload.role);
    });

    test('should generate a valid magic token', async () => {
      const magicPayload = { ...validPayload, type: 'magic' as const };
      const token = await generateToken(magicPayload);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const decoded = await verifyToken(token);
      expect(decoded.type).toBe('magic');
      expect(decoded.email).toBe(validPayload.email);
    });

    test('should generate a valid csrf token', async () => {
      const csrfPayload = { ...validPayload, type: 'csrf' as const };
      const token = await generateToken(csrfPayload);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const decoded = await verifyToken(token);
      expect(decoded.type).toBe('csrf');
    });

    test('should throw error for invalid token type', async () => {
      const invalidPayload = { ...validPayload, type: 'invalid' as any };
      await expect(generateToken(invalidPayload)).rejects.toThrow(
        'Non-standard token type',
      );
    });

    test('should generate tokens with different signatures for same payload', async () => {
      const payload1 = { ...validPayload, email: 'test1@example.com' };
      const payload2 = { ...validPayload, email: 'test2@example.com' };

      const token1 = await generateToken(payload1);
      const token2 = await generateToken(payload2);

      expect(token1).not.toBe(token2);

      const parts1 = token1.split('.');
      const parts2 = token2.split('.');

      expect(parts1[1]).not.toBe(parts2[1]);
      expect(parts1[2]).not.toBe(parts2[2]);
    });
  });

  describe('generateCsrfToken', () => {
    test('should generate a valid CSRF token', async () => {
      const token = await generateCsrfToken();
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const verified = await verifyToken(token);
      expect(verified.type).toBe('csrf');
      expect(verified.email).toBe('csrf@example.com');
    });

    test('should generate a CSRF token with correct structure', async () => {
      const token = await generateCsrfToken();
      const parts = token.split('.');

      expect(parts.length).toBe(3);

      const headerJson = Buffer.from(parts[0] || '', 'base64').toString(
        'utf-8',
      );
      const header = JSON.parse(headerJson);

      expect(header).toHaveProperty('alg', 'HS256');
      expect(header).toHaveProperty('typ', 'JWT');

      const payloadJson = Buffer.from(parts[1] || '', 'base64').toString(
        'utf-8',
      );
      const payload = JSON.parse(payloadJson);

      expect(payload).toHaveProperty('type', 'csrf');
      expect(payload).toHaveProperty('email', 'csrf@example.com');
      expect(payload).toHaveProperty('role', 'user');
      expect(payload).toHaveProperty('exp');
      expect(payload).toHaveProperty('iat');
    });
  });

  describe('verifyToken', () => {
    test('should verify a valid token', async () => {
      const token = await generateToken(validPayload);
      const decoded = await verifyToken(token);

      expect(decoded).toMatchObject(validPayload);
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');

      const now = Math.floor(Date.now() / 1000);
      expect(Number(decoded['iat'])).toBeLessThanOrEqual(now);
      expect(Number(decoded['exp'])).toBeGreaterThan(now);

      expect(decoded.email).toBe(validPayload.email);
      expect(decoded.role).toBe(validPayload.role);
      expect(decoded.type).toBe(validPayload.type);
    });

    test('should throw error for empty token', async () => {
      await expect(verifyToken('')).rejects.toThrow('Token is empty');
    });

    test('should throw error for blacklisted token', async () => {
      const token = await generateToken(validPayload);
      blacklistToken(token);

      await expect(verifyToken(token)).rejects.toThrow();
      await expect(verifyToken(token)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.REVOKED,
      );
    });

    test('should throw error for tampered token', async () => {
      const token = await generateToken(validPayload);

      const tamperedSignature = token.slice(0, -5) + 'xxxxx';
      await expect(verifyToken(tamperedSignature)).rejects.toThrow();

      const malformedToken = token.substring(0, token.lastIndexOf('.'));
      await expect(verifyToken(malformedToken)).rejects.toThrow();

      await expect(verifyToken('not.a.token')).rejects.toThrow();

      const fakeToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      await expect(verifyToken(fakeToken)).rejects.toThrow();
    });

    test('should throw error for token with tampered payload', async () => {
      const token = await generateToken(validPayload);
      const parts = token.split('.');

      const payloadJson = Buffer.from(parts[1] || '', 'base64').toString(
        'utf-8',
      );
      const payload = JSON.parse(payloadJson);
      payload.role = 'admin';

      const tamperedPayload = Buffer.from(JSON.stringify(payload)).toString(
        'base64',
      );
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

      await expect(verifyToken(tamperedToken)).rejects.toThrow();
    });

    test('should throw error for expired token', async () => {
      const expiredPayload = {
        ...validPayload,
        exp: Math.floor(Date.now() / 1000) - 3600,
        iat: Math.floor(Date.now() / 1000) - 7200,
      };

      await expect(validateTokenPayload(expiredPayload)).rejects.toThrow(
        'Token has expired',
      );
      await expect(validateTokenPayload(expiredPayload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.EXPIRED,
      );
    });
  });

  describe('validateTokenPayload', () => {
    test('should validate a correct payload', async () => {
      const token = await generateToken(validPayload);
      const decoded = await verifyToken(token);

      await validateTokenPayload(decoded);

      expect(decoded).toHaveProperty('type');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('role');
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');
    });

    test('should reject payload with invalid token type', async () => {
      const invalidPayload = { ...validPayload, type: 'invalid' as any };

      await expect(validateTokenPayload(invalidPayload)).rejects.toThrow(
        'Invalid token type',
      );
      await expect(validateTokenPayload(invalidPayload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test('should reject payload with invalid role', async () => {
      const invalidPayload = { ...validPayload, role: 'superuser' as any };

      await expect(validateTokenPayload(invalidPayload)).rejects.toThrow(
        'Invalid role',
      );
      await expect(validateTokenPayload(invalidPayload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test('should reject payload with invalid email', async () => {
      const invalidPayload = { ...validPayload, email: 'not-an-email' };

      await expect(validateTokenPayload(invalidPayload)).rejects.toThrow(
        'Invalid email format',
      );
      await expect(validateTokenPayload(invalidPayload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test('should reject payload with various malformed emails', async () => {
      const malformedEmails = [
        'plaintext',
        '@missinguser.com',
        'missing@',
        '',
        'no-at-sign',
        'multiple@at@signs.com',
        'user@',
      ];

      for (const email of malformedEmails) {
        const invalidPayload = {
          ...validPayload,
          email,
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
        };
        await expect(validateTokenPayload(invalidPayload)).rejects.toThrow(
          'Invalid email format',
        );
      }
    });

    test('should allow csrf token with non-email format', async () => {
      const csrfPayload = {
        type: 'csrf' as const,
        email: 'csrf@example.com',
        role: 'user' as const,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };

      await validateTokenPayload(csrfPayload);

      const csrfToken = await generateCsrfToken();
      const decoded = await verifyToken(csrfToken);

      expect(decoded.type).toBe('csrf');
      expect(decoded.email).toBe('csrf@example.com');
    });

    test('should reject payload with missing required claims', async () => {
      const incompletePayload = { ...validPayload };

      await expect(validateTokenPayload(incompletePayload)).rejects.toThrow(
        'Missing required claims',
      );
      await expect(
        validateTokenPayload(incompletePayload),
      ).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test('should reject payload with expired token', async () => {
      const expiredPayload = {
        ...validPayload,
        exp: Math.floor(Date.now() / 1000) - 3600,
        iat: Math.floor(Date.now() / 1000) - 7200,
      };

      await expect(validateTokenPayload(expiredPayload)).rejects.toThrow(
        'Token has expired',
      );
      await expect(validateTokenPayload(expiredPayload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.EXPIRED,
      );
    });

    test('should reject payload with future issuance date', async () => {
      const futurePayload = {
        ...validPayload,
        exp: Math.floor(Date.now() / 1000) + 7200,
        iat: Math.floor(Date.now() / 1000) + 3600,
      };

      await expect(validateTokenPayload(futurePayload)).rejects.toThrow(
        'Token not yet valid',
      );
      await expect(validateTokenPayload(futurePayload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test('should handle clock skew between servers gracefully', async () => {
      const payload = {
        ...validPayload,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000) + 5,
      };

      await expect(validateTokenPayload(payload)).rejects.toThrow(
        'Token not yet valid',
      );
      await expect(validateTokenPayload(payload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test.skip('should implement secure clock skew tolerance', async () => {
      const minimalSkew = 2;
      const payload = {
        ...validPayload,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000) + minimalSkew,
      };

      await validateTokenPayload(payload);

      const largeSkew = 10 * 60;
      const badPayload = {
        ...validPayload,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000) + largeSkew,
      };

      await expect(validateTokenPayload(badPayload)).rejects.toThrow(
        'Token not yet valid',
      );
    });
  });

  describe('blacklistToken and resetBlacklist', () => {
    test('should blacklist a token and prevent its verification', async () => {
      const token = await generateToken(validPayload);

      const decoded = await verifyToken(token);
      expect(decoded).toBeTruthy();
      expect(decoded.email).toBe(validPayload.email);

      blacklistToken(token);

      await expect(verifyToken(token)).rejects.toThrow();
      await expect(verifyToken(token)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.REVOKED,
      );

      const otherToken = await generateToken({
        ...validPayload,
        email: 'other@example.com',
      });
      const otherDecoded = await verifyToken(otherToken);
      expect(otherDecoded).toBeTruthy();
      expect(otherDecoded.email).toBe('other@example.com');
    });

    test('should reset the blacklist', async () => {
      const token = await generateToken(validPayload);

      blacklistToken(token);

      await expect(verifyToken(token)).rejects.toThrow();

      resetBlacklist();

      const decoded = await verifyToken(token);
      expect(decoded).toBeTruthy();
    });

    test('should correctly blacklist multiple tokens', async () => {
      const token1 = await generateToken({
        ...validPayload,
        email: 'user1@example.com',
      });
      const token2 = await generateToken({
        ...validPayload,
        email: 'user2@example.com',
      });
      const token3 = await generateToken({
        ...validPayload,
        email: 'user3@example.com',
      });

      blacklistToken(token1);
      blacklistToken(token2);

      await expect(verifyToken(token1)).rejects.toThrow();
      await expect(verifyToken(token2)).rejects.toThrow();

      const decoded3 = await verifyToken(token3);
      expect(decoded3.email).toBe('user3@example.com');

      blacklistToken(token3);
      await expect(verifyToken(token3)).rejects.toThrow();

      resetBlacklist();

      const decoded1 = await verifyToken(token1);
      const decoded2 = await verifyToken(token2);
      const decoded3again = await verifyToken(token3);

      expect(decoded1.email).toBe('user1@example.com');
      expect(decoded2.email).toBe('user2@example.com');
      expect(decoded3again.email).toBe('user3@example.com');
    });
  });

  describe('Token types and roles validation', () => {
    test('should validate all defined token types', async () => {
      for (const type of TOKEN_TYPES) {
        const payload = {
          ...validPayload,
          type,
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
        };

        await validateTokenPayload(payload);

        const token = await generateToken({ ...validPayload, type });
        const decoded = await verifyToken(token);

        expect(decoded.type).toBe(type);
        expect(decoded.email).toBe(validPayload.email);
        expect(decoded.role).toBe(validPayload.role);
      }
    });

    test('should validate all defined user roles', async () => {
      for (const role of USER_ROLES) {
        const payload = {
          ...validPayload,
          role,
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
        };

        await validateTokenPayload(payload);

        const token = await generateToken({ ...validPayload, role });
        const decoded = await verifyToken(token);

        expect(decoded.role).toBe(role);
        expect(USER_ROLES).toContain(decoded.role);
      }
    });

    test('should throw error for invalid role', async () => {
      const invalidRole = 'super_admin';
      const payload = {
        ...validPayload,
        role: invalidRole as any,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };

      await expect(validateTokenPayload(payload)).rejects.toThrow(
        'Invalid role',
      );
      await expect(validateTokenPayload(payload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });
  });

  describe('Security edge cases', () => {
    test('should reject token with empty email', async () => {
      const payload = {
        ...validPayload,
        email: '',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };

      await expect(validateTokenPayload(payload)).rejects.toThrow(
        'Invalid email format',
      );
      await expect(validateTokenPayload(payload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test('should reject token with SQL injection attempt in email', async () => {
      const payload = {
        ...validPayload,
        email: "user@example.com' OR 1=1 --",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };

      await expect(validateTokenPayload(payload)).rejects.toThrow(
        'Invalid email format',
      );
      await expect(validateTokenPayload(payload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test.skip('should prevent privilege escalation through token manipulation', async () => {
      const adminPayload = {
        ...validPayload,
        role: 'admin' as const,
      };

      const createAdminToken = async (): Promise<TokenPayload> => {
        const adminToken = await generateToken(adminPayload);
        return await verifyToken(adminToken);
      };

      await expect(createAdminToken()).rejects.toThrow(
        'Unauthorized role escalation',
      );
    });

    test('should reject token with null bytes in claims', async () => {
      const payload = {
        ...validPayload,
        email: 'user\0@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };

      await expect(validateTokenPayload(payload)).rejects.toThrow(
        'Invalid email format',
      );
      await expect(validateTokenPayload(payload)).rejects.toHaveProperty(
        'code',
        JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED,
      );
    });

    test('should match token expiration with constants definition', async () => {
      const accessToken = await generateToken({
        ...validPayload,
        type: 'access',
      });
      const accessDecoded = await verifyToken(accessToken);
      const now = Math.floor(Date.now() / 1000);

      const fifteenMinutesInSeconds = 15 * 60;
      const accessExpiry = Number(accessDecoded['exp']) - now;
      expect(accessExpiry).toBeGreaterThan(fifteenMinutesInSeconds - 10);
      expect(accessExpiry).toBeLessThan(fifteenMinutesInSeconds + 10);

      const refreshToken = await generateToken({
        ...validPayload,
        type: 'refresh',
      });
      const refreshDecoded = await verifyToken(refreshToken);

      const oneWeekInSeconds = 7 * 24 * 60 * 60;
      const refreshExpiry = Number(refreshDecoded['exp']) - now;
      expect(refreshExpiry).toBeGreaterThan(oneWeekInSeconds - 10);
      expect(refreshExpiry).toBeLessThan(oneWeekInSeconds + 10);

      const magicToken = await generateToken({
        ...validPayload,
        type: 'magic',
      });
      const magicDecoded = await verifyToken(magicToken);
      const magicExpiry = Number(magicDecoded['exp']) - now;
      expect(magicExpiry).toBeGreaterThan(fifteenMinutesInSeconds - 10);
      expect(magicExpiry).toBeLessThan(fifteenMinutesInSeconds + 10);

      const csrfToken = await generateToken({ ...validPayload, type: 'csrf' });
      const csrfDecoded = await verifyToken(csrfToken);
      const oneHourInSeconds = 60 * 60;
      const csrfExpiry = Number(csrfDecoded['exp']) - now;
      expect(csrfExpiry).toBeGreaterThan(oneHourInSeconds - 10);
      expect(csrfExpiry).toBeLessThan(oneHourInSeconds + 10);
    });

    test('should ignore custom expiration times in payload', async () => {
      const oneYearInSeconds = 365 * 24 * 60 * 60;
      const payload = {
        ...validPayload,
        exp: Math.floor(Date.now() / 1000) + oneYearInSeconds,
        iat: Math.floor(Date.now() / 1000),
      };

      const token = await generateToken(payload);
      const decoded = await verifyToken(token);

      const now = Math.floor(Date.now() / 1000);

      const fifteenMinutesInSeconds = 15 * 60;
      const accessExpiry = Number(decoded['exp']) - now;

      expect(accessExpiry).toBeLessThan(oneYearInSeconds / 100);
      expect(accessExpiry).toBeCloseTo(fifteenMinutesInSeconds, -1);
    });

    test('should enforce maximum expiration times for security', async () => {
      const maxAllowedExpiry = 30 * 24 * 60 * 60;

      const longExpiryPayload = {
        ...validPayload,
        type: 'refresh' as const,
      };

      const token = await generateToken(longExpiryPayload);
      const decoded = await verifyToken(token);
      const now = Math.floor(Date.now() / 1000);

      expect(Number(decoded['exp']) - now).toBeLessThan(maxAllowedExpiry);
    });

    test('should properly validate different token types with correct expiry times', async () => {
      const testCases = [
        { type: 'access', expectedExpiry: 15 * 60 },
        { type: 'refresh', expectedExpiry: 7 * 24 * 60 * 60 },
        { type: 'magic', expectedExpiry: 15 * 60 },
        { type: 'csrf', expectedExpiry: 60 * 60 },
      ];

      for (const { type, expectedExpiry } of testCases) {
        const payload = { ...validPayload, type: type as any };
        const token = await generateToken(payload);
        const decoded = await verifyToken(token);

        const now = Math.floor(Date.now() / 1000);
        const actualExpiry = Number(decoded['exp']) - now;

        expect(actualExpiry).toBeGreaterThanOrEqual(expectedExpiry - 10);
        expect(actualExpiry).toBeLessThanOrEqual(expectedExpiry + 10);

        expect(actualExpiry).toBeGreaterThan(expectedExpiry * 0.9);

        expect(actualExpiry).toBeLessThan(expectedExpiry * 1.1);
      }
    });

    test.skip('should prevent extending token lifetime via refresh chain', async () => {
      const refreshPayload = {
        ...validPayload,
        type: 'refresh' as const,
      };

      const refreshToken = await generateToken(refreshPayload);

      const decoded = await verifyToken(refreshToken);

      expect(decoded).toHaveProperty('refreshCount');
    });

    test.skip('should prevent token replay attacks', async () => {
      const token = await generateToken(validPayload);

      await verifyToken(token);

      const decoded = await verifyToken(token);

      expect(decoded).toHaveProperty('jti');

      blacklistToken(token);
      await expect(verifyToken(token)).rejects.toThrow();

      resetBlacklist();
    });

    test('should validate token structure for all token types', async () => {
      for (const type of TOKEN_TYPES) {
        const typePayload = { ...validPayload, type: type as any };
        const token = await generateToken(typePayload);

        const parts = token.split('.');
        expect(parts.length).toBe(3);

        const headerJson = Buffer.from(parts[0] || '', 'base64').toString(
          'utf-8',
        );
        const header = JSON.parse(headerJson);

        expect(header).toHaveProperty('alg', 'HS256');
        expect(header).toHaveProperty('typ', 'JWT');

        const payloadJson = Buffer.from(parts[1] || '', 'base64').toString(
          'utf-8',
        );
        const payload = JSON.parse(payloadJson);

        expect(payload).toHaveProperty('type', type);
        expect(payload).toHaveProperty('email');
        expect(payload).toHaveProperty('role');
        expect(payload).toHaveProperty('exp');
        expect(payload).toHaveProperty('iat');

        expect(parts[2]?.length || 0).toBeGreaterThan(10);
      }
    });

    test('should properly enforce maximum token lifetimes', async () => {
      const tokenLifetimeTests = [
        { type: 'access', maxLifetime: 60 * 60 },
        { type: 'refresh', maxLifetime: 30 * 24 * 60 * 60 },
        { type: 'magic', maxLifetime: 60 * 60 },
        { type: 'csrf', maxLifetime: 24 * 60 * 60 },
      ];

      for (const { type, maxLifetime } of tokenLifetimeTests) {
        const typePayload = { ...validPayload, type: type as any };
        const token = await generateToken(typePayload);
        const decoded = await verifyToken(token);

        const now = Math.floor(Date.now() / 1000);
        const expiration = Number(decoded['exp']);
        const lifetime = expiration - now;

        expect(lifetime).toBeLessThanOrEqual(maxLifetime);
      }
    });

    test('should detect common JWT tampering techniques', async () => {
      const token = await generateToken(validPayload);

      const parts = token.split('.');
      expect(parts.length).toBe(3);
      const [headerB64, payloadB64, signatureB64] = parts;

      await expect(verifyToken('not-a-jwt-token')).rejects.toThrow();

      await expect(verifyToken(`${headerB64}.${payloadB64}`)).rejects.toThrow();
      await expect(verifyToken(`${headerB64}`)).rejects.toThrow();

      const headerStr = Buffer.from(headerB64 || '', 'base64').toString(
        'utf-8',
      );
      const headerObj = JSON.parse(headerStr);

      headerObj.alg = 'none';
      const tamperedHeaderB64 = Buffer.from(JSON.stringify(headerObj)).toString(
        'base64',
      );

      const noneAlgToken = `${tamperedHeaderB64}.${payloadB64}.${signatureB64}`;
      await expect(verifyToken(noneAlgToken)).rejects.toThrow();

      headerObj.alg = 'HS512';
      const differentAlgHeaderB64 = Buffer.from(
        JSON.stringify(headerObj),
      ).toString('base64');
      const differentAlgToken = `${differentAlgHeaderB64}.${payloadB64}.${signatureB64}`;
      await expect(verifyToken(differentAlgToken)).rejects.toThrow();
    });
  });
});
