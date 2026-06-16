import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, SafeAreaView, Modal, ScrollView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, setProducts, toggleWishlist } from '../redux/store';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#4F46E5',
  black: '#111827',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  bg: '#FFFFFF',
  white: '#FFFFFF',
  green: '#10B981'
};

export default function ProductsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [sortModal, setSortModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest arrivals');
  const [selectedGender, setSelectedGender] = useState('All');
  const [activeFilterTab, setActiveFilterTab] = useState('Gender');

  const dispatch = useDispatch();
  const allProducts = useSelector(state => state.products.items);
  const wishlist = useSelector(state => state.wishlist.items);
  const cartCount = useSelector(state => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
   .then(res => {
        dispatch(setProducts(res.data));
        setLoading(false);
      })
   .catch(() => setLoading(false));
  }, [dispatch]);

  const products = allProducts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());

    let matchGender = true;
    if (selectedGender === 'Men') matchGender = p.category === "men's clothing";
    if (selectedGender === 'Women') matchGender = p.category === "women's clothing";
    if (selectedGender === 'Boys') matchGender = p.category === "men's clothing";
    if (selectedGender === 'Girls') matchGender = p.category === "women's clothing";

    return matchSearch && matchGender;
  }).sort((a, b) => {
    if (sortBy === 'Price - low to high') return a.price - b.price;
    if (sortBy === 'Price - high to low') return b.price - a.price;
    if (sortBy === 'Best sellers') return b.rating.count - a.rating.count;
    return b.id - a.id;
  });

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="dark-content" />

      {searchOpen? (
        <View style={styles.searchHeader}>
          <TouchableOpacity onPress={() => { setSearchOpen(false); setSearchQuery(''); }}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      ) : (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} /></TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="bag" size={22} color={COLORS.primary} />
            <Text style={styles.headerTitle}>T-shirts</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setSearchOpen(true)}>
              <Ionicons name="search-outline" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={{marginLeft: 18}}>
              <Ionicons name={wishlist.length > 0? "heart" : "heart-outline"} size={22} color={wishlist.length > 0? 'red' : COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{marginLeft: 18}}>
              <Ionicons name="bag-outline" size={22} />
              {cartCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.subText}>Showing {products.length} results</Text>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<View style={styles.center}><Text style={{color: COLORS.gray}}>No products found</Text></View>}
        renderItem={({ item }) => {
          const price = Math.round(item.price * 80);
          const mrp = Math.round(item.price * 100);
          const discount = Math.round(((mrp - price) / mrp) * 100);

          return (
            <View style={styles.card}>
              <TouchableOpacity style={styles.heartBtn} onPress={() => dispatch(toggleWishlist(item.id))}>
                <Ionicons name={wishlist.includes(item.id)? "heart" : "heart-outline"} size={18} color={wishlist.includes(item.id)? 'red' : COLORS.gray} />
              </TouchableOpacity>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.brand}>{item.id % 2 === 0? 'Vashions' : 'Zudio'}</Text>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{price}</Text>
                <TouchableOpacity style={styles.tryBtn} onPress={() => dispatch(addToCart(item))}>
                  <Text style={styles.tryBtnText}>TRY N BUY</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.discountRow}>
                <Text style={styles.mrp}>₹{mrp}</Text>
                <Text style={styles.discount}>{discount}% OFF</Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => setSortModal(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="swap-vertical" size={18} />
            <Text style={styles.bottomBtnText}>Sort by</Text>
          </View>
        </TouchableOpacity>
        <View style={{ width: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />
        <TouchableOpacity style={styles.bottomBtn} onPress={() => setFilterModal(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="filter-outline" size={18} />
            <Text style={styles.bottomBtnText}>Filters</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={sortModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSortModal(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.dragger} />
            <Text style={[styles.sheetTitle, { color: COLORS.primary }]}>Sort by</Text>
            {['Newest arrivals', 'Price - low to high', 'Price - high to low', 'Offers and discounts', 'Best sellers'].map(opt => (
              <TouchableOpacity key={opt} onPress={() => { setSortBy(opt); setSortModal(false); }} style={styles.sortOptionRow}>
                <Text style={[styles.sortOption, sortBy === opt && { color: COLORS.primary, fontWeight: '600' }]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={filterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterSheet}>
            <View style={styles.dragger} />
            <Text style={[styles.sheetTitle, { color: COLORS.primary }]}>Filters</Text>

            <View style={{ flexDirection: 'row', flex: 1 }}>
              <ScrollView style={{ width: 130, borderRightWidth: 1, borderColor: '#E5E7EB' }}>
                {['Suggested filters', 'Gender', 'Price', 'Brand'].map(tab => (
                  <TouchableOpacity key={tab} onPress={() => setActiveFilterTab(tab)}
                    style={[styles.tabBtn, activeFilterTab === tab && styles.activeTab]}>
                    <Text style={[styles.tabText, activeFilterTab === tab && { color: COLORS.primary, fontWeight: '600' }]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={{ flex: 1, paddingLeft: 16 }}>
                {activeFilterTab === 'Gender' && (
                  <>
                    <Text style={styles.filterSubHeading}>Select gender</Text>
                    <View style={styles.chipRow}>
                      {['All', 'Men', 'Women', 'Boys', 'Girls', 'Unisex'].map(g => (
                        <TouchableOpacity key={g} onPress={() => { setSelectedGender(g); setFilterModal(false); }}
                          style={[styles.chip, selectedGender === g && styles.chipActive]}>
                          <Text style={{fontSize: 12, color: selectedGender === g? COLORS.white : COLORS.black}}>{g}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}
                {activeFilterTab === 'Suggested filters' && (
                  <>
                    <Text style={styles.filterSubHeading}>Choose from the mostly used filters</Text>
                    <View style={styles.chipRow}>
                      {['2 days delivery', 'Brown', 'Under ₹700', '50% off'].map(chip => (
                        <View key={chip} style={styles.chip}><Text style={{fontSize: 12}}>{chip}</Text></View>
                      ))}
                    </View>
                  </>
                )}
              </ScrollView>
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => { setSelectedGender('All'); setSearchQuery(''); }}>
                <Text style={{ color: COLORS.gray }}>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterModal(false)}>
                <Text style={{ color: COLORS.white, fontWeight: '600' }}>Apply filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop:50, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', padding: 16,paddingTop:50, backgroundColor: COLORS.white, gap: 12, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  searchInput: { flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 8, paddingHorizontal: 12, height: 40 },
  headerTitle: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  badge: { position: 'absolute', right: -6, top: -6, backgroundColor: COLORS.primary, borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },
  subText: { paddingHorizontal: 16, paddingVertical: 12, fontSize: 12, color: COLORS.gray },
  card: { backgroundColor: COLORS.white, width: '48%', marginBottom: 20 },
  heartBtn: { position: 'absolute', top: 8, right: 8, zIndex: 10, backgroundColor: COLORS.white, borderRadius: 20, padding: 6 },
  image: { width: '100%', height: 220, borderRadius: 8, backgroundColor: COLORS.lightGray, marginBottom: 8 },
  brand: { fontSize: 13, fontWeight: '600', color: COLORS.black, marginBottom: 2 },
  title: { fontSize: 12, color: COLORS.gray, marginBottom: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  price: { fontSize: 15, fontWeight: '700' },
  tryBtn: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tryBtnText: { fontSize: 10, color: COLORS.primary, fontWeight: '600' },
  discountRow: { flexDirection: 'row', alignItems: 'center' },
  mrp: { fontSize: 11, color: COLORS.gray, textDecorationLine: 'line-through', marginRight: 6 },
  discount: { fontSize: 11, color: COLORS.green, fontWeight: '600' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: '#E5E7EB', height: 56 },
  bottomBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomBtnText: { fontSize: 14, fontWeight: '500', marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  dragger: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  bottomSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  filterSheet: { backgroundColor: COLORS.white, height: '70%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  sortOptionRow: { paddingVertical: 14 },
  sortOption: { fontSize: 15 },
  tabBtn: { paddingVertical: 14, paddingHorizontal: 12 },
  activeTab: { backgroundColor: '#EEF2FF', borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.gray },
  filterSubHeading: { fontSize: 11, color: COLORS.gray, marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB' },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  modalBtns: { flexDirection: 'row', gap: 12, paddingTop: 16, borderTopWidth: 1, borderColor: '#E5E7EB' },
  clearBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
  applyBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: COLORS.primary, alignItems: 'center' }
});