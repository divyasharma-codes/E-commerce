import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount += action.payload.price;
    },
    removeFromCart: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      state.totalAmount -= item.price * item.quantity;
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      item.quantity += 1;
      state.totalAmount += item.price;
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item.quantity > 1) {
        item.quantity -= 1;
        state.totalAmount -= item.price;
      } else {
        state.totalAmount -= item.price;
        state.items = state.items.filter(i => i.id !== action.payload.id);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  }
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;