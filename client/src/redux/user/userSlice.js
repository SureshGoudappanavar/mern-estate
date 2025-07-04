import { createSlice } from "@reduxjs/toolkit";

// ✅ Get user from localStorage initially
const initialState = {
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload)); // ✅ persist login
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload; // ✅ store updated user
      state.loading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload)); // ✅ persist updated user
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Optional: Logout action
    signOut: (state) => {
      state.currentUser = null;
      localStorage.removeItem('user');
    }
  },
});

export const {
  signInStart,
  signInFailure,
  signInSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOut
} = userSlice.actions;

export default userSlice.reducer;
