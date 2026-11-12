import { demoAuth } from './demo';
import { createSupabaseAuth } from './supabase';
import type { AuthService } from './types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const auth: AuthService = url && anonKey
  ? createSupabaseAuth(url, anonKey)
  : demoAuth;
