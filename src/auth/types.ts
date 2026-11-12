import type { AuthUser } from '../types';

export interface AuthService {
  mode: 'supabase' | 'demo',
  getUser(): Promise<AuthUser | null>,
  signIn(email: string, password: string): Promise<AuthUser>,
  // retorna null quando o provedor exige confirmação do e-mail antes do login
  signUp(email: string, password: string): Promise<AuthUser | null>,
  signOut(): Promise<void>,
  onChange(callback: (user: AuthUser | null) => void): () => void,
}

export const INVALID_CREDENTIALS = 'E-mail ou senha incorretos.';
export const EMAIL_TAKEN = 'Este e-mail já está cadastrado.';
