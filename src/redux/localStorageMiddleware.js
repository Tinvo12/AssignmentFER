
export const localStorageMiddleware = store => next => action => {
    const result = next(action);
    const state = store.getState();
    localStorage.setItem('users', JSON.stringify(state.user.users));
    localStorage.setItem('currentUser', JSON.stringify(state.user.currentUser));
    localStorage.setItem('products', JSON.stringify(state.product.products));
    localStorage.setItem('cart', JSON.stringify(state.cart.cart));
    localStorage.setItem('orders', JSON.stringify(state.order.orders));
    localStorage.setItem('coupons', JSON.stringify(state.coupon.coupons));
    localStorage.setItem('debts', JSON.stringify(state.debt.debts));
    return result;
  };

