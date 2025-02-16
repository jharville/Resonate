import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  user: {
    displayName: string | null;
    uid: string;
    email: string | null;
  } | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{uid: string; displayName: string | null; email: string | null}>,
    ) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = null;
    },
  },
});

export const {setUser, clearUser} = authSlice.actions;
export const authReducer = authSlice.reducer;
