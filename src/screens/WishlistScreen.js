import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeWishlist } from '../redux/store';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { primary: '#4F46E5', black: '#111827', gray: '#6B7280', white: '#FFFFFF' };

export default function WishlistScreen({ navigation }) {
  const wishlist = useSelector(state => state.wishlist.items);
  const allProducts = useSelector(state => state.products.items);
  const dispatch = useDispatch();
  
  const wishItems = allProducts.filter(p => wishlist.includes(p.id));

  if (wishItems.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptyText}>Save your favourite items here</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: COLORS.white, fontWeight: '600' }}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist ({wishItems.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={wishItems}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => {
          const price = Math.round(item.price * 80);
          return (
            <View style={styles.card}>
              <TouchableOpacity style={styles.heartBtn} onPress={() => dispatch(removeWishlist(item.id))}>
                <Ionicons name="heart" size={18} color="red" />
              </TouchableOpacity>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.brand}>{item.id % 2 === 0? 'Vashions' : 'Zudio'}</Text>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.price}>₹{price}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16,paddingTop:50, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  emptyText: { fontSize: 14, color: COLORS.gray, marginTop: 8 },
  startBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 40, paddingVertical: 12, borderRadius: 8, marginTop: 20 },
  card: { backgroundColor: COLORS.white, width: '48%', marginBottom: 20 },
  heartBtn: { position: 'absolute', top: 8, right: 8, zIndex: 10, backgroundColor: COLORS.white, borderRadius: 20, padding: 6 },
  image: { width: '100%', height: 220, borderRadius: 8, backgroundColor: '#F3F4F6', marginBottom: 8 },
  brand: { fontSize: 13, fontWeight: '600', color: COLORS.black },
  title: { fontSize: 12, color: COLORS.gray, marginVertical: 4 },
  price: { fontSize: 15, fontWeight: '700' }
});