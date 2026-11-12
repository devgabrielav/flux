export type AuthUser = { id: string; email: string };

export type Rate = { name: string; ask: number };
export type Rates = Record<string, Rate>;

export type Expense = {
  id: number,
  value: number,
  currency: string,
  currencyName: string,
  rate: number, // cotação (em BRL) usada no momento do lançamento
  method: string,
  tag: string,
  description: string,
};

export type ExpenseDraft = {
  value: string,
  currency: string,
  method: string,
  tag: string,
  description: string,
};

export type UserState = {
  id: string | null,
  email: string,
  status: 'loading' | 'authenticated' | 'anonymous',
};

export type WalletState = {
  ownerId: string | null, // dono das despesas carregadas (usado na persistência)
  rates: Rates,
  ratesStatus: 'idle' | 'loading' | 'ready' | 'error',
  expenses: Expense[],
  editingId: number | null,
  displayCurrency: string,
};
