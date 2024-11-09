// redux/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null; // Reset error khi bắt đầu đăng nhập
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null; // Reset error khi thành công
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Lưu thông báo lỗi
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Xuất các action creators
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOut,
} = userSlice.actions;

// Xuất reducer
export default userSlice.reducer;
