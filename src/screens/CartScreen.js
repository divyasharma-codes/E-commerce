import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/store';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { 
  primary: '#4F46E5', 
  black: '#111827', 
  gray: '#6B7280', 
  lightGray: '#F3F4F6', 
  white: '#FFFFFF',
  blue: '#2563EB'
};

export default function CartScreen({ navigation }) {
  const cart = useSelector(state => state.cart?.items || []);
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState(cart.map(item => item.id));

  const toggleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(x => x !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item.id));
    }
  };

  const increaseQty = (item) => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  const decreaseQty = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  const total = cart.filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (Math.round(item.price * 80) * item.quantity), 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bag</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* DELIVERY INFO */}
        <View style={styles.deliveryBox}>
          <View style={styles.deliveryRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons name="bicycle" size={20} color="#F59E0B" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.deliveryText}>Delivering in just 60 min</Text>
                <Text style={styles.addressText}>Full address - 29 Aparna Complex, Gurgaon...</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
          </View>
          
          <View style={styles.freeDeliveryRow}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.blue} />
            <Text style={styles.freeDeliveryText}> Yayy! Your order is eligible for FREE delivery.</Text>
          </View>
        </View>

        {/* DESELECT ALL */}
        <TouchableOpacity onPress={toggleSelectAll}>
          <Text style={styles.deselectText}>Deselect all items</Text>
        </TouchableOpacity>

        {/* CART ITEMS */}
        {cart.map(item => {
          const price = Math.round(item.price * 80);
          const mrp = Math.round(item.price * 100);
          const isSelected = selectedItems.includes(item.id);

          return (
            <View key={item.id} style={styles.cartItem}>
              <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                </View>
              </TouchableOpacity>

              <Image source={{ uri: item.image }} style={styles.cartImage} />

              <View style={styles.cartInfo}>
                <Text style={styles.productTitle}>Chanel Brown Top</Text>
                <Text style={styles.productDesc} numberOfLines={1}>Product description line 1</Text>
                <Text style={styles.productDesc} numberOfLines={1}>Product description line 2</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{price}</Text>
                  <Text style={styles.mrp}>₹{mrp}</Text>
                </View>

                <Text style={styles.tryBuy}>TRY N BUY</Text>

                <View style={styles.qtyBox}>
                  <TouchableOpacity onPress={() => decreaseQty(item)} style={styles.qtyBtn}>
                    {item.quantity === 1 ? 
                      <Ionicons name="trash-outline" size={16} color={COLORS.gray} /> : 
                      <Text style={styles.qtyText}>-</Text>
                    }
                  </TouchableOpacity>
                  <Text style={styles.qtyNumber}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQty(item)} style={styles.qtyBtn}>
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* PROCEED BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.proceedBtn}>
          <Text style={styles.proceedText}>Proceed to pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16,
    paddingTop:50,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  
  deliveryBox: { padding: 16, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  deliveryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  deliveryText: { fontSize: 14, fontWeight: '600', color: COLORS.black },
  addressText: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  freeDeliveryRow: { flexDirection: 'row', alignItems: 'center' },
  freeDeliveryText: { fontSize: 12, color: COLORS.blue, fontWeight: '500' },
  
  deselectText: { paddingHorizontal: 16, paddingVertical: 12, fontSize: 13, color: COLORS.blue, fontWeight: '500' },
  
  cartItem: { 
    flexDirection: 'row', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderColor: '#F3F4F6',
    alignItems: 'flex-start'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue
  },
  cartImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    marginRight: 12
  },
  cartInfo: { flex: 1 },
  productTitle: { fontSize: 15, fontWeight: '600', color: COLORS.black, marginBottom: 2 },
  productDesc: { fontSize: 12, color: COLORS.gray, marginBottom: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '700', marginRight: 8 },
  mrp: { fontSize: 13, color: COLORS.gray, textDecorationLine: 'line-through' },
  tryBuy: { fontSize: 11, color: COLORS.blue, fontWeight: '600', marginBottom: 8 },
  
  qtyBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 20,
    width: 80,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 32
  },
  qtyBtn: { padding: 4 },
  qtyText: { fontSize: 18, fontWeight: '600', color: COLORS.black },
  qtyNumber: { fontSize: 14, fontWeight: '600' },
  
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: COLORS.white
  },
  proceedBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  proceedText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600'
  }
});