import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  discount: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const idx = state.cart.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) {
        state.cart[idx].quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateCartItem: (state, action) => {
      const idx = state.cart.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) {
        state.cart[idx] = { ...state.cart[idx], ...action.payload };
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    removeCartItem: (state, action) => {
      state.cart = state.cart.filter(i => i.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      state.discount = null;
      localStorage.removeItem('cart');
    },
    applyDiscount: (state, action) => {
      state.discount = action.payload;
    },
  },
});

export const { addToCart, updateCartItem, removeCartItem, clearCart, applyDiscount } = cartSlice.actions;
export default cartSlice.reducer;
