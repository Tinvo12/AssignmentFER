import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coupons: JSON.parse(localStorage.getItem('coupons')) || [],
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    addCoupon: (state, action) => {
      state.coupons.push({ ...action.payload, isActive: true });
      localStorage.setItem('coupons', JSON.stringify(state.coupons));
    },
    updateCoupon: (state, action) => {
      const idx = state.coupons.findIndex(c => c.code === action.payload.code);
      if (idx !== -1) {
        state.coupons[idx] = { ...action.payload, isActive: state.coupons[idx].isActive };
        localStorage.setItem('coupons', JSON.stringify(state.coupons));
      }
    },
    toggleActiveCoupon: (state, action) => {
      const idx = state.coupons.findIndex(c => c.code === action.payload);
      if (idx !== -1) {
        state.coupons[idx].isActive = !state.coupons[idx].isActive;
        localStorage.setItem('coupons', JSON.stringify(state.coupons));
      }
    },
    markUsed: (state, action) => {
      const idx = state.coupons.findIndex(c => c.code === action.payload.code);
      if (idx !== -1) {
        if (!state.coupons[idx].usedBy) state.coupons[idx].usedBy = [];
        state.coupons[idx].usedBy.push(action.payload.user);
        localStorage.setItem('coupons', JSON.stringify(state.coupons));
      }
    },
  },
});

export const { addCoupon, updateCoupon, toggleActiveCoupon, markUsed } = couponSlice.actions;
export default couponSlice.reducer;
