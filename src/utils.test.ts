import { describe, expect, it } from 'vitest';
import type { Expense } from './types';
import { formatMoney, isValidAmount, nextId, toBRL } from './utils';

const expense = (id: number): Expense => ({
  id,
  value: 10,
  currency: 'USD',
  currencyName: 'Dólar',
  rate: 5,
  method: 'Pix',
  tag: 'Lazer',
  description: 'x',
});

describe('utils', () => {
  it('nextId nunca repete id depois de excluir', () => {
    expect(nextId([])).toBe(0);
    expect(nextId([expense(0), expense(1), expense(2)])).toBe(3);
    expect(nextId([expense(0), expense(2)])).toBe(3);
  });

  it('converte para BRL usando a cotação do lançamento', () => {
    expect(toBRL(expense(0))).toBe(50);
  });

  it('valida valores', () => {
    expect(isValidAmount('12.5')).toBe(true);
    expect(isValidAmount('0')).toBe(false);
    expect(isValidAmount('')).toBe(false);
    expect(isValidAmount('-3')).toBe(false);
  });

  it('formata dinheiro e tolera moedas não ISO', () => {
    expect(formatMoney(1234.5)).toContain('1.234,50');
    expect(formatMoney(1, 'BTC')).toContain('1,00');
  });
});
