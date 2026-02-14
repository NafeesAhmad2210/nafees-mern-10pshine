import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  setToken,
  isAuthenticated,
  getAuthHeaders,
  signup,
  login,
} from './api.js';

describe('api', () => {
  let fetchMock;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  describe('setToken', () => {
    it('stores token when provided', () => {
      setToken('abc123');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
    });

    it('removes token when null/undefined', () => {
      setToken('x');
      setToken(null);
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no token', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when token is set', () => {
      localStorage.setItem('token', 't');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getAuthHeaders', () => {
    it('returns empty object when no token', () => {
      expect(getAuthHeaders()).toEqual({});
    });

    it('returns Authorization Bearer when token set', () => {
      localStorage.setItem('token', 'my-token');
      expect(getAuthHeaders()).toEqual({ Authorization: 'Bearer my-token' });
    });
  });

  describe('signup', () => {
    it('calls POST /api/auth/signup with name, email, password', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ token: 't', user: { id: '1', name: 'Test', email: 'a@b.com' } }),
      });
      await signup('Test', 'a@b.com', 'password1');
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/signup'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test', email: 'a@b.com', password: 'password1' }),
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        })
      );
    });

    it('throws with server error message when !res.ok', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Email already registered' }),
      });
      await expect(signup('Test', 'a@b.com', 'pass')).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('calls POST /api/auth/login with email, password', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ token: 't', user: { id: '1', name: 'Test', email: 'a@b.com' } }),
      });
      await login('a@b.com', 'pass');
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'a@b.com', password: 'pass' }),
        })
      );
    });

    it('throws when request fails', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Invalid email or password' }),
      });
      await expect(login('a@b.com', 'wrong')).rejects.toThrow('Invalid email or password');
    });
  });
});
