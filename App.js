import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import ProductsScreen from './src/screens/ProductScreen';
import CartScreen from './src/screens/CartScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle='dark-content' backgroundColor="transparent" translucent/>
            <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}