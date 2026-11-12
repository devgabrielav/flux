import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, UserState } from '../types';

const initialState: UserState = { id: null, email: '', status: 'loading' };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_state, action: PayloadAction<AuthUser | null>): UserState {
      const user = action.payload;
      return user
        ? { id: user.id, email: user.email, status: 'authenticated' }
        : { id: null, email: '', status: 'anonymous' };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
