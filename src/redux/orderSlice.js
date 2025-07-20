import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: JSON.parse(localStorage.getItem('orders')) || [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrder: (state, action) => {
      state.orders.push(action.payload);
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    updateOrderStatus: (state, action) => {
      const idx = state.orders.findIndex(o => o.id === action.payload.id);
      if (idx !== -1) {
        state.orders[idx] = { ...state.orders[idx], ...action.payload };
        localStorage.setItem('orders', JSON.stringify(state.orders));
      }
    },
  },
});

export const { createOrder, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
