import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useStore } from '../data/store';
import { deleteOutfit } from '../data/store';
import { colors, fonts, layout } from '../theme';

const VIBES = ['All', 'workwear', 'casual', 'date night', 'party', 'vacation'];

function ColorDot({ color, size = 28 }) {
  return (
    <View style={[
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      (color === '#FFFFFF' || color === '#F5F5DC') && { borderWidth: 1, borderColor: colors.border },
    ]} />
  );
}

function OutfitCard({ outfit, items, onDelete }) {
  const outfitItems = outfit.itemIds
    .map(id => items.find(i => i.id === id))
    .filter(Boolean);

  return (
    <View style={styles.card}>
      {/* Color swatches */}
      <View style={styles.swatches}>
        {outfitItems.map(item => (
          <ColorDot key={item.id} color={item.color} size={36} />
        ))}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.outfitName}>{outfit.name}</Text>
          <View style={styles.vibeChip}>
            <Text style={styles.vibeChipText}>{outfit.vibe}</Text>
          </View>
        </View>
        <Text style={styles.itemsText}>
          {outfitItems.map(i => i.label).join('  ·  ')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => {
          Alert.alert('Remove outfit', `Delete "${outfit.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onDelete(outfit.id) },
          ]);
        }}
      >
        <Text style={styles.deleteTxt}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OutfitsScreen({ navigation }) {
  const { items, outfits } = useStore();
  const [selectedVibe, setSelectedVibe] = useState('All');

  const filtered = selectedVibe === 'All'
    ? outfits
    : outfits.filter(o => o.vibe === selectedVibe);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Outfits</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('Add')}
        >
          <Text style={styles.addBtnText}>＋ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Vibe filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {VIBES.map(vibe => {
          const active = selectedVibe === vibe;
          return (
            <TouchableOpacity
              key={vibe}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedVibe(vibe)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Outfits list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No outfits yet</Text>
            <Text style={styles.emptyHint}>
              {selectedVibe === 'All'
                ? 'Tap + Create to build your first combination.'
                : `No ${selectedVibe} outfits yet.`}
            </Text>
          </View>
        ) : (
          filtered.map(outfit => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              items={items}
              onDelete={deleteOutfit}
            />
          ))
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
  list: { flex: 1 },
  listContent: { padding: layout.px, paddingTop: 16, paddingBottom: 100, gap: 12 },
  card: {
    backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    padding: layout.cardPad, ...layout.cardShadow,
  },
  swatches: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  outfitName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  vibeChip: {
    backgroundColor: colors.black, paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, marginLeft: 8,
  },
  vibeChipText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  itemsText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  deleteBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.highlight, alignItems: 'center', justifyContent: 'center',
  },
  deleteTxt: { fontSize: 12, color: colors.textSecondary },
  emptyState: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  emptyHint: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
});
