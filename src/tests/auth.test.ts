import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "../auth/jwt.js";
import { checkPasswordHash, hashPassword } from "../auth/auth.js";
import jwt from 'jsonwebtoken';

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe('JWT Utilities', () => {
  const secret = 'test-secret';
  const userId = 'user-123';
  let token: string;

  beforeAll(() => {
    token = makeJWT(userId, 60, secret); // 60s expiration
  });

  it('should generate a valid JWT token', () => {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    expect(decoded).toBeDefined();
    expect(decoded.sub).toBe(userId);
    expect(decoded.iss).toBe('chirpy');
    expect(typeof decoded.iat).toBe('number');
    expect(typeof decoded.exp).toBe('number');
  });

  it('should validate a valid JWT and return user ID', () => {
    const result = validateJWT(token, secret);
    expect(result).toBe(userId);
  });

  it('should throw an error for an invalid token', () => {
    const invalidToken = token.slice(0, -1); // corrupt token

    expect(() => validateJWT(invalidToken, secret)).toThrow('Invalid token');
  });

  it('should throw an error for a token with wrong secret', () => {
    expect(() => validateJWT(token, 'wrong-secret')).toThrow('Invalid token');
  });

  it('should throw an error for an expired token', async () => {
    const shortLivedToken = makeJWT(userId, 1, secret); // expires in 1s

    // Wait for 2s so token expires
    await new Promise((resolve) => setTimeout(resolve, 2000));

    expect(() => validateJWT(shortLivedToken, secret)).toThrow('Invalid token');
  });
});