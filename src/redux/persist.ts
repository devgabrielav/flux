import type { Expense } from '../types';
import type { AppStore } from '.';

const storageKey = (userId: string) => `fluxo:expenses:${userId}`;

const isExpense = (item: Partial<Expense>): item is Expense => (
  typeof item?.id === 'number'
  && typeof item.value === 'number' && typeof item.rate === 'number'
  && typeof item.currency === 'string');

export function loadExpenses(userId: string): Expense[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(userId)) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isExpense) : [];
  } catch {
    return [];
  }
}

// Salva as despesas de cada usuário separadamente, só depois de carregadas
// (ownerId === user.id), para nunca sobrescrever dados com uma lista vazia.
export function attachPersistence(store: AppStore) {
  return store.subscribe(() => {
    const { user, wallet } = store.getState();
    if (!user.id || wallet.ownerId !== user.id) return;
    try {
      localStorage.setItem(storageKey(user.id), JSON.stringify(wallet.expenses));
    } catch {
      // armazenamento cheio ou bloqueado: o app segue funcionando em memória
    }
  });
}
