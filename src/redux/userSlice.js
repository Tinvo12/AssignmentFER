import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  users: JSON.parse(localStorage.getItem('users')) || [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    register: (state, action) => {
      state.users.push({ ...action.payload, isActive: true });
      localStorage.setItem('users', JSON.stringify(state.users));
    },
    login: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(u => u.email !== action.payload);
      localStorage.setItem('users', JSON.stringify(state.users));
      if (state.currentUser && state.currentUser.email === action.payload) {
        state.currentUser = null;
        localStorage.removeItem('currentUser');
      }
    },
    toggleActiveUser: (state, action) => {
      const idx = state.users.findIndex(u => u.email === action.payload);
      if (idx !== -1) {
        state.users[idx].isActive = !state.users[idx].isActive;
        localStorage.setItem('users', JSON.stringify(state.users));
        // Nếu tự ngưng hoạt động thì đăng xuất
        if (state.currentUser && state.currentUser.email === action.payload && !state.users[idx].isActive) {
          state.currentUser = null;
          localStorage.removeItem('currentUser');
        }
      }
    },
  },
});

export const { register, login, logout, deleteUser, toggleActiveUser } = userSlice.actions;
export default userSlice.reducer;
