import '@testing-library/jest-dom/vitest';
import { webcrypto } from 'node:crypto';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom não expõe crypto.subtle (usado no modo demo de autenticação)
Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});
