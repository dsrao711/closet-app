import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useStore, deleteItem } from '../data/store';
import GarmentThumbnail from '../components/GarmentThumbnail';
import { colors, fonts, layout } from '../theme';

const CATS = [
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
    <TouchableOpacity
      style={s.itemCard}
      onLongPress={() =>
        Alert.alert('Remove item', `Delete "${item.label}"?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
        ])
      }
      activeOpacity={0.88}
    >
      <View style={s.thumbWrap}>
        <GarmentThumbnail item={item} size={160} round={false} />
      </View>
      <View style={s.itemInfo}>
        <Text style={s.itemLabel} numberOfLines={2}>{item.label}</Text>
        <Text style={s.itemOccasion}>{item.occasion.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function WardrobeScreen({ navigation }) {
  const { items } = useStore();
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = selectedCat === 'all'
    ? items
    : items.filter(i => i.category === selectedCat);

  const visibleCats = CATS.filter(c =>
    c.key === 'all' || items.some(i => i.category === c.key)
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.heading}>Wardrobe</Text>
          <Text style={s.subMono}>{items.length} PIECES</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => navigation.navigate('Add')}>
          <Text style={s.addBtnText}>＋ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={s.filterBar} contentContainerStyle={s.filterContent}
      >
        {visibleCats.map(cat => {
          const active = selectedCat === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[s.chip, active && s.chipActive]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Text style={[s.chipText, active && s.chipTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grid */}
      <ScrollView style={s.grid} contentContainerStyle={s.gridContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyTitle}>Nothing here yet</Text>
            <Text style={s.emptyHint}>Long-press any item to remove it.</Text>
          </View>
        ) : (
          <View style={s.gridRow}>
            {filtered.map(item => (
              <ItemCard key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 16,
  },
  heading: {
    fontFamily: fonts.sans800, fontSize: 33,
    letterSpacing: -1, color: colors.ink, lineHeight: 34,
  },
  subMono: {
    fontFamily: fonts.mono, fontSize: 11,
    letterSpacing: 0.9, color: colors.inkFaint, marginTop: 8,
  },
  addBtn: {
    backgroundColor: colors.ink, borderRadius: 999,
    paddingHorizontal: 18, paddingVertical: 10, marginTop: 4,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  addBtnText: { fontFamily: fonts.sans700, fontSize: 13.5, color: colors.white },
  filterBar: { maxHeight: 52 },
  filterContent: { paddingHorizontal: layout.px, gap: 8 },
  chip: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.lineStrong,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.sans600, fontSize: 13, color: colors.inkSoft },
  chipTextActive: { color: colors.white },
  grid: { flex: 1 },
  gridContent: { padding: layout.px, paddingTop: 16, paddingBottom: 110 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  itemCard: { width: '47%' },
  thumbWrap: {
    width: '100%', aspectRatio: 1,
    borderRadius: 14, overflow: 'hidden',
    backgroundColor: colors.garmentBg,
  },
  itemInfo: { marginTop: 9 },
  itemLabel: {
    fontFamily: fonts.sans600, fontSize: 14,
    letterSpacing: -0.1, color: colors.ink,
  },
  itemOccasion: {
    fontFamily: fonts.mono, fontSize: 9.5,
    letterSpacing: 0.6, color: colors.inkGhost, marginTop: 3,
  },
  empty: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontFamily: fonts.sans700, fontSize: 17, color: colors.inkFaint },
  emptyHint: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkGhost, marginTop: 6 },
});
