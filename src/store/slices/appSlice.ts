import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Policy, Claim, Payment, User } from '../../types';
import { demoPolicies, demoClaims, demoPayments, demoUsers } from '../../data/demoData';

interface AppState {
  policies: Policy[];
  claims: Claim[];
  payments: Payment[];
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  policies: demoPolicies,
  claims: demoClaims,
  payments: demoPayments,
  users: demoUsers,
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addPolicy: (state, action: PayloadAction<Policy>) => {
      state.policies.push(action.payload);
    },
    updatePolicy: (state, action: PayloadAction<Policy>) => {
      const index = state.policies.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.policies[index] = action.payload;
      }
    },
    updateClaim: (state, action: PayloadAction<Claim>) => {
      const index = state.claims.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    },
    addClaim: (state, action: PayloadAction<Claim>) => {
      state.claims.push(action.payload);
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  addPolicy,
  updatePolicy,
  updateClaim,
  addClaim,
  addPayment,
  updateUser,
  addUser,
} = appSlice.actions;

export default appSlice.reducer;