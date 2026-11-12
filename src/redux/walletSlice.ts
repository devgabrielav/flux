import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRates } from '../api';
import { BASE_CURRENCY } from '../constants';
import type { Expense, ExpenseDraft, WalletState } from '../types';
import { nextId } from '../utils';
import type { AppThunk } from '.';

const initialState: WalletState = {
  ownerId: null,
  rates: {},
  ratesStatus: 'idle',
  expenses: [],
  editingId: null,
  displayCurrency: BASE_CURRENCY,
};

type HydratePayload = { ownerId: string | null, expenses: Expense[] };

export const fetchRates = createAsyncThunk('wallet/fetchRates', getRates);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<HydratePayload>) {
      state.ownerId = action.payload.ownerId;
      state.expenses = action.payload.expenses;
      state.editingId = null;
    },
    expenseAdded(state, action: PayloadAction<Expense>) {
      state.expenses.push(action.payload);
    },
    expenseUpdated(state, action: PayloadAction<Expense>) {
      state.expenses = state.expenses
        .map((expense) => (expense.id === action.payload.id ? action.payload : expense));
      state.editingId = null;
    },
    expenseRemoved(state, action: PayloadAction<number>) {
      state.expenses = state.expenses.filter(({ id }) => id !== action.payload);
      if (state.editingId === action.payload) state.editingId = null;
    },
    startEdit(state, action: PayloadAction<number>) {
      state.editingId = action.payload;
    },
    cancelEdit(state) {
      state.editingId = null;
    },
    setDisplayCurrency(state, action: PayloadAction<string>) {
      state.displayCurrency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => { state.ratesStatus = 'loading'; })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.rates = action.payload;
        state.ratesStatus = 'ready';
      })
      // Em caso de erro mantemos as últimas cotações conhecidas.
      .addCase(fetchRates.rejected, (state) => { state.ratesStatus = 'error'; });
  },
});

export const {
  hydrate, expenseAdded, expenseUpdated, expenseRemoved, startEdit, cancelEdit,
  setDisplayCurrency,
} = walletSlice.actions;

// Adiciona ou edita (conforme editingId). Retorna false se não houver cotação.
export const saveExpense = (draft: ExpenseDraft): AppThunk<Promise<boolean>> => (
  async (dispatch, getState) => {
    const { editingId, expenses } = getState().wallet;
    const current = expenses.find(({ id }) => id === editingId);
    const keepRate = current !== undefined && current.currency === draft.currency;
    if (!keepRate) await dispatch(fetchRates());

    const rate = getState().wallet.rates[draft.currency];
    if (!keepRate && !rate) return false;

    const expense: Expense = {
      id: current ? current.id : nextId(expenses),
      value: Number(draft.value),
      currency: draft.currency,
      currencyName: keepRate ? current.currencyName : rate.name,
      rate: keepRate ? current.rate : rate.ask,
      method: draft.method,
      tag: draft.tag,
      description: draft.description.trim(),
    };
    dispatch(current ? expenseUpdated(expense) : expenseAdded(expense));
    return true;
  }
);

export default walletSlice.reducer;
