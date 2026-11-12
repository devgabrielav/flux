import { BASE_CURRENCY } from './constants';
import type { Expense } from './types';

export const toBRL = (expense: Expense) => expense.value * expense.rate;

export const isValidAmount = (value: string) => Number.isFinite(Number(value))
  && Number(value) > 0;

// Evita ids repetidos depois de exclusões (o original usava expenses.length).
export const nextId = (expenses: Expense[]) => expenses
  .reduce((max, { id }) => Math.max(max, id), -1) + 1;

export function formatMoney(value: number, currency = BASE_CURRENCY) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}
