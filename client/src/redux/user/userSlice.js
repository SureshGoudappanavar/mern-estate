// src/redux/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Sign In
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Update User
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Delete User
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      localStorage.removeItem('user');
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Sign Out
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      localStorage.removeItem('user');
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

 
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  resetError,
} = userSlice.actions;

export default userSlice.reducer;
