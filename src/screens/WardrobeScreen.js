import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useStore, deleteItem } from '../data/store';
import { colors, fonts, layout } from '../theme';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'top', label: 'Tops' },
  { key: 'bottom', label: 'Trousers' },
  { key: 'skirt', label: 'Skirts' },
  { key: 'dress', label: 'Dresses' },
  { key: 'shoes', label: 'Footwear' },
  { key: 'bag', label: 'Bags' },
  { key: 'accessory', label: 'Accessories' },
  { key: 'outerwear', label: 'Outerwear' },
];

function ItemCard({ item, onDelete }) {
  return (
    <View style={styles.itemCard}>
      <View style={[
        styles.colorBlock,
        { backgroundColor: item.color },
        (item.color === '#FFFFFF' || item.color === '#F5F5DC') && styles.colorBlockBorder,
      ]} />
      <Text style={styles.itemLabel} numberOfLines={2}>{item.label}</Text>
      <Text style={styles.itemOccasion}>{item.occasion}</Text>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => {
          Alert.alert('Remove item', `Delete "${item.label}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
          ]);
        }}
      >
        <Text style={styles.deleteTxt}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WardrobeScreen({ navigation }) {
  const { items } = useStore();
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = selectedCat === 'all'
    ? items
    : items.filter(i => i.category === selectedCat);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Wardrobe</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('Add')}
        >
          <Text style={styles.addBtnText}>＋ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORIES.map(cat => {
          const count = cat.key === 'all'
            ? items.length
            : items.filter(i => i.category === cat.key).length;
          if (count === 0 && cat.key !== 'all') return null;
          const active = selectedCat === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat.label}{count > 0 ? ` (${count})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grid */}
      <ScrollView
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyHint}>Tap + Add to grow your wardrobe.</Text>
          </View>
        ) : (
          <View style={styles.gridRow}>
            {filtered.map(item => (
              <ItemCard key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 16,
  },
  heading: { ...fonts.heading },
  addBtn: {
    backgroundColor: colors.black, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: layout.chipRadius,
  },
  addBtnText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  filterBar: { maxHeight: 52 },
  filterContent: { paddingHorizontal: layout.px, gap: 8 },
  chip: {
    backgroundColor: colors.chipOutlineBg, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: layout.chipRadius,
  },
  chipActive: { backgroundColor: colors.black },
  chipText: { fontSize: 14, color: colors.chipOutlineText, fontWeight: '500' },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  grid: { flex: 1 },
  gridContent: { padding: layout.px, paddingTop: 16, paddingBottom: 100 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  itemCard: {
    width: '47%', backgroundColor: colors.cardBg,
    borderRadius: layout.cardRadius, padding: 14,
    ...layout.cardShadow, position: 'relative',
  },
  colorBlock: { width: '100%', height: 80, borderRadius: 10, marginBottom: 12 },
  colorBlockBorder: { borderWidth: 1, borderColor: colors.border },
  itemLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  itemOccasion: { fontSize: 12, color: colors.textSecondary },
  deleteBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center',
  },
  deleteTxt: { fontSize: 11, color: colors.textSecondary },
  emptyState: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  emptyHint: { fontSize: 14, color: colors.textSecondary },
});
