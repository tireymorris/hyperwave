import { TIME } from '@/utils/constants';

export interface TokenPayload extends Record<string, unknown> {
  type: TokenType;
  email: string;
  role: UserRole;
}

export interface VerifiedToken extends TokenPayload {
  exp: number;
  iat: number;
}

export const TOKEN_TYPES = ['access', 'refresh', 'magic', 'csrf'] as const;
export type TokenType = (typeof TOKEN_TYPES)[number];

export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

const ACCESS_TOKEN_MINUTES = 15;
const MAGIC_LINK_MINUTES = 15;

export const TOKEN_EXPIRY_SECONDS = {
  magic: TIME.SECONDS_IN_MINUTE * MAGIC_LINK_MINUTES,
  access: TIME.SECONDS_IN_MINUTE * ACCESS_TOKEN_MINUTES,
  refresh:
    TIME.SECONDS_IN_MINUTE *
    TIME.MINUTES_IN_HOUR *
    TIME.HOURS_IN_DAY *
    TIME.DAYS_IN_WEEK,
  csrf: TIME.SECONDS_IN_MINUTE * TIME.MINUTES_IN_HOUR,
} as const;

type StrictCookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Strict';
  domain?: string;
};

export const COOKIE_CONFIG = {
  access: {
    name: 'access_token',
    path: '/',
    maxAge: TIME.SECONDS_IN_MINUTE * ACCESS_TOKEN_MINUTES,
  },
  refresh: {
    name: 'refresh_token',
    path: '/',
    maxAge:
      TIME.SECONDS_IN_MINUTE *
      TIME.MINUTES_IN_HOUR *
      TIME.HOURS_IN_DAY *
      TIME.DAYS_IN_WEEK,
  },
} as const;

export const COOKIE_OPTIONS: StrictCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
} as const;

export const RATE_LIMITS = {
  login: {
    max: 30,
    window: 300000,
    message: 'Too many page loads. Please try again later.',
  },
  verify: {
    max: 30,
    window: 300000,
    message: 'Too many verification attempts. Please request a new magic link.',
  },
  refresh: {
    max: 10,
    window: 300000,
    message: 'Too many refresh attempts. Please log in again.',
  },
} as const;

export const JOSE_ERROR_CODES = {
  EXPIRED: 'ERR_JWT_EXPIRED',
  CLAIM_VALIDATION_FAILED: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
  INVALID_SIGNATURE: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
  INVALID_FORMAT: 'ERR_JWS_INVALID',
  REVOKED: 'ERR_JWT_REVOKED',
} as const;

export type JoseError = Error & {
  code?: string;
};

export const ERROR_CODES = {
  EXPIRED: 'expired_token',
  TAMPERED: 'tampered_token',
  INVALID: 'invalid_token',
  REVOKED: 'token_revoked',
  VERIFICATION_REQUIRED: 'verification_required',
} as const;

export const ERROR_CODE_MAP = {
  [JOSE_ERROR_CODES.EXPIRED]: ERROR_CODES.EXPIRED,
  [JOSE_ERROR_CODES.CLAIM_VALIDATION_FAILED]: ERROR_CODES.TAMPERED,
  [JOSE_ERROR_CODES.INVALID_SIGNATURE]: ERROR_CODES.TAMPERED,
  [JOSE_ERROR_CODES.INVALID_FORMAT]: ERROR_CODES.INVALID,
  [JOSE_ERROR_CODES.REVOKED]: ERROR_CODES.REVOKED,
} as const;
