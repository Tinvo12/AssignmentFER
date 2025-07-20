import { createSlice } from '@reduxjs/toolkit';
import { sendAdminDebtEmail, sendUserDebtPaidEmail, sendUserDepositSuccessEmail } from '../utils/email';

const initialState = {
  debts: JSON.parse(localStorage.getItem('debts')) || [],
};

const debtSlice = createSlice({
  name: 'debt',
  initialState,
  reducers: {
    addDebt: (state, action) => {
      const newDebt = {
        ...action.payload,
        paidHistory: action.payload.paidHistory || [],
        isPaid: false,
      };
      state.debts.push(newDebt);
      localStorage.setItem('debts', JSON.stringify(state.debts));
      // Gửi email đặt ký cho user
      try {
        if (!newDebt.customer) return;
        sendUserDepositSuccessEmail({ email: newDebt.customer, deposit_id: newDebt.id, amount: newDebt.totalAmount });
      } catch (e) { /* ignore */ }
    },
    updateDebt: (state, action) => {
      const idx = state.debts.findIndex(d => d.id === action.payload.id);
      if (idx !== -1) {
        state.debts[idx] = {
          ...state.debts[idx],
          ...action.payload,
        };
        localStorage.setItem('debts', JSON.stringify(state.debts));
      }
    },
    addPayment: (state, action) => {
      // action.payload: {id, amount}
      const idx = state.debts.findIndex(d => d.id === action.payload.id);
      if (idx !== -1) {
        const debt = state.debts[idx];
        if (!debt.paidHistory) debt.paidHistory = [];
        debt.paidHistory.push({ amount: Number(action.payload.amount), date: new Date().toISOString(), orderId: action.payload.orderId });
        // Kiểm tra đã trả hết chưa
        const totalPaid = debt.paidHistory.reduce((sum, p) => sum + p.amount, 0);
        debt.isPaid = totalPaid >= debt.totalAmount;
        localStorage.setItem('debts', JSON.stringify(state.debts));
        // Gửi email cho admin và user khi trả nợ
        try {
          if (!debt.customer) return;
          sendAdminDebtEmail({ email: debt.customer, amount: action.payload.amount, debt_id: debt.id });
          sendUserDebtPaidEmail({ email: debt.customer, debt_id: debt.id, amount: action.payload.amount });
        } catch (e) { /* ignore */ }
      }
    },
    markPaid: (state, action) => {
      const idx = state.debts.findIndex(d => d.id === action.payload);
      if (idx !== -1) {
        state.debts[idx].isPaid = true;
        state.debts[idx].paidHistory = state.debts[idx].paidHistory || [];
        // Nếu chưa trả hết, thêm khoản còn lại vào lịch sử
        const totalPaid = state.debts[idx].paidHistory.reduce((sum, p) => sum + p.amount, 0);
        if (totalPaid < state.debts[idx].totalAmount) {
          state.debts[idx].paidHistory.push({ amount: state.debts[idx].totalAmount - totalPaid, date: new Date().toISOString() });
        }
        localStorage.setItem('debts', JSON.stringify(state.debts));
      }
    },
    deleteDebt: (state, action) => {
      // Chỉ chuyển trạng thái đã thanh toán, không xóa thật
      const idx = state.debts.findIndex(d => d.id === action.payload);
      if (idx !== -1) {
        state.debts[idx].isPaid = true;
        localStorage.setItem('debts', JSON.stringify(state.debts));
      }
    },
  },
});

export const { addDebt, updateDebt, addPayment, markPaid, deleteDebt } = debtSlice.actions;
export default debtSlice.reducer;
