import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { AuthUser } from '../types';
import { AuthService, EMAIL_TAKEN, INVALID_CREDENTIALS } from './types';

const toUser = (user: User): AuthUser => ({ id: user.id, email: user.email ?? '' });

function friendly(message: string) {
  if (/invalid login/i.test(message)) return INVALID_CREDENTIALS;
  if (/already registered/i.test(message)) return EMAIL_TAKEN;
  if (/not confirmed/i.test(message)) return 'Confirme seu e-mail antes de entrar.';
  if (/rate limit|too many/i.test(message)) return 'Muitas tentativas. Aguarde um pouco.';
  return 'Não foi possível concluir. Tente novamente.';
}

// O SDK só é carregado (import dinâmico) quando o Supabase está configurado.
export function createSupabaseAuth(url: string, anonKey: string): AuthService {
  let client: Promise<SupabaseClient> | null = null;
  const getClient = () => {
    client ??= import('@supabase/supabase-js')
      .then((mod) => mod.createClient(url, anonKey));
    return client;
  };

  return {
    mode: 'supabase',

    async getUser() {
      const { data } = await (await getClient()).auth.getSession();
      return data.session?.user ? toUser(data.session.user) : null;
    },

    async signIn(email, password) {
      const { data, error } = await (await getClient()).auth
        .signInWithPassword({ email, password });
      if (error || !data.user) throw new Error(friendly(error?.message ?? ''));
      return toUser(data.user);
    },

    async signUp(email, password) {
      const { data, error } = await (await getClient()).auth.signUp({ email, password });
      if (error) throw new Error(friendly(error.message));
      return data.session && data.user ? toUser(data.user) : null;
    },

    async signOut() {
      await (await getClient()).auth.signOut();
    },

    onChange(callback) {
      let cancelled = false;
      let unsubscribe = () => {};
      getClient().then((c) => {
        if (cancelled) return;
        const { data } = c.auth.onAuthStateChange((_event, session) => {
          callback(session?.user ? toUser(session.user) : null);
        });
        unsubscribe = () => data.subscription.unsubscribe();
      });
      return () => {
        cancelled = true;
        unsubscribe();
      };
    },
  };
}
