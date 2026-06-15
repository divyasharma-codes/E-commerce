import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.quantity += 1;
      else state.items.push({...action.payload, quantity: 1 });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    }
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    toggleWishlist: (state, action) => {
      const id = action.payload;
      if (state.items.includes(id)) {
        state.items = state.items.filter(x => x !== id);
      } else {
        state.items.push(id);
      }
    },
    removeWishlist: (state, action) => {
      state.items = state.items.filter(x => x !== action.payload);
    }
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export const { toggleWishlist, removeWishlist } = wishlistSlice.actions;
export const { setProducts } = productsSlice.actions;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart', 'wishlist']
};

const rootReducer = combineReducers({
  cart: cartSlice.reducer,
  wishlist: wishlistSlice.reducer,
  products: productsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);