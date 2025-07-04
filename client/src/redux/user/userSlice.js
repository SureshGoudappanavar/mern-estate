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
   deleteUserSuccess: (state) => {
      state.currentUser = null; // Clear user on delete
      localStorage.removeItem('user'); // Remove from localStorage  
      state.loading = false;
      state.error = null;  
    },
   deleteUserFailure: (state,action) => {
      state.error = action.payload;
      state.loading = false;
    },
  deleteUserStart: (state) => {
      state.loading = true;
    },  

 
  },
});

export const {
  signInStart,
  signInFailure,
  signInSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserSuccess,
  deleteUserFailure,
  deleteUserStart,
} = userSlice.actions;

export default userSlice.reducer;
