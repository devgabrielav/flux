import type { AuthUser } from '../types';
import { AuthService, EMAIL_TAKEN, INVALID_CREDENTIALS } from './types';

// MODO DEMO: contas guardadas no navegador, só para testar a interface.
// A senha nunca é salva em texto puro (PBKDF2 + salt), mas isso NÃO substitui
// um backend: use o Supabase (ver README) para autenticação de verdade.
const USERS_KEY = 'fluxo:demo-users';
const SESSION_KEY = 'fluxo:demo-session';

type StoredUser = { id: string, email: string, salt: string, hash: string };

const toHex = (bytes: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(bytes))
  .map((byte) => byte.toString(16).padStart(2, '0')).join('');

async function hashPassword(password: string, salt: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle
    .importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100_000, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(bits);
}

const readUsers = (): StoredUser[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const publicUser = ({ id, email }: StoredUser): AuthUser => ({ id, email });

const startSession = (user: AuthUser) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
};

export const demoAuth: AuthService = {
  mode: 'demo',

  async getUser() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null');
    } catch {
      return null;
    }
  },

  async signIn(email, password) {
    const found = readUsers().find((user) => user.email === email.toLowerCase());
    if (!found) throw new Error(INVALID_CREDENTIALS);
    if (await hashPassword(password, found.salt) !== found.hash) {
      throw new Error(INVALID_CREDENTIALS);
    }
    return startSession(publicUser(found));
  },

  async signUp(email, password) {
    const users = readUsers();
    const normalized = email.toLowerCase();
    if (users.some((user) => user.email === normalized)) throw new Error(EMAIL_TAKEN);
    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    const created: StoredUser = {
      id: crypto.randomUUID(),
      email: normalized,
      salt,
      hash: await hashPassword(password, salt),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, created]));
    return startSession(publicUser(created));
  },

  async signOut() {
    sessionStorage.removeItem(SESSION_KEY);
  },

  onChange: () => () => {},
};
