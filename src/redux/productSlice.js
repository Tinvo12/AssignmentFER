import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: JSON.parse(localStorage.getItem('products')) || [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      // action.payload phải có unit
      state.products.push({ ...action.payload, history: [] });
      localStorage.setItem('products', JSON.stringify(state.products));
    },
    updateProduct: (state, action) => {
      const idx = state.products.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.products[idx] = action.payload; // phải có unit
        localStorage.setItem('products', JSON.stringify(state.products));
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      localStorage.setItem('products', JSON.stringify(state.products));
    },
    importStock: (state, action) => {
      const idx = state.products.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.products[idx].stock += action.payload.quantity;
        // Ghi lịch sử nhập kho
        state.products[idx].history = state.products[idx].history || [];
        state.products[idx].history.push({
          type: 'import',
          quantity: action.payload.quantity,
          date: new Date().toISOString(),
          note: action.payload.note || '',
        });
        localStorage.setItem('products', JSON.stringify(state.products));
      }
    },
    exportStock: (state, action) => {
      const idx = state.products.findIndex(p => p.id === action.payload.id);
      if (idx !== -1 && state.products[idx].stock >= action.payload.quantity) {
        state.products[idx].stock -= action.payload.quantity;
        // Ghi lịch sử xuất kho
        state.products[idx].history = state.products[idx].history || [];
        state.products[idx].history.push({
          type: 'export',
          quantity: action.payload.quantity,
          date: new Date().toISOString(),
          note: action.payload.note || '',
        });
        localStorage.setItem('products', JSON.stringify(state.products));
      }
    },
    adjustStock: (state, action) => {
      const idx = state.products.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.products[idx].stock = action.payload.newStock;
        state.products[idx].history = state.products[idx].history || [];
        state.products[idx].history.push({
          type: 'adjust',
          quantity: action.payload.newStock,
          date: new Date().toISOString(),
          note: action.payload.note || '',
        });
        localStorage.setItem('products', JSON.stringify(state.products));
      }
    },
  },
});

export const { addProduct, updateProduct, deleteProduct, importStock, exportStock, adjustStock } = productSlice.actions;
export default productSlice.reducer;
