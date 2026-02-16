import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Minimal localStorage mock for tests (shared storage so api.js and tests see same state)
const storage = {};
const localStorageMock = {
  getItem: vi.fn((key) => storage[key] ?? null),
  setItem: vi.fn((key, value) => { storage[key] = String(value); }),
  removeItem: vi.fn((key) => { delete storage[key]; }),
  clear: vi.fn(() => { Object.keys(storage).forEach((k) => delete storage[k]); }),
  get length() { return Object.keys(storage).length; },
  key: vi.fn((i) => Object.keys(storage)[i] ?? null),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });
