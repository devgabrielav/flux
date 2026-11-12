import {
  combineReducers, configureStore, ThunkAction, UnknownAction,
} from '@reduxjs/toolkit';
import type { AuthUser } from '../types';
import { loadExpenses } from './persist';
import user, { setUser } from './userSlice';
import wallet, { hydrate } from './walletSlice';

const rootReducer = combineReducers({ user, wallet });

export const createStore = (preloadedState?: Partial<ReturnType<typeof rootReducer>>) => (
  configureStore({ reducer: rootReducer, preloadedState }));

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, UnknownAction>;

// Ponto único para entrar/sair: atualiza o usuário e carrega as despesas dele.
export const applyUser = (
  authUser: AuthUser | null,
): AppThunk => (dispatch, getState) => {
  if ((getState().user.id ?? null) === (authUser?.id ?? null)
    && getState().user.status !== 'loading') return;
  dispatch(setUser(authUser));
  dispatch(hydrate({
    ownerId: authUser?.id ?? null,
    expenses: authUser ? loadExpenses(authUser.id) : [],
  }));
};
