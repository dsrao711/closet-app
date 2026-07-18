import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useStore, deleteOutfit } from '../data/store';
import { ThumbnailRow } from '../components/GarmentThumbnail';
import Icon from '../components/Icon';
import { colors, fonts, layout } from '../theme';
import { itemDisplayName, outfitDisplayName } from '../utils/labels';

const VIBES = ['All', 'workwear', 'casual', 'date night', 'party', 'vacation'];
const VIBE_DISPLAY = v => v.charAt(0).toUpperCase() + v.slice(1);

function OutfitCard({ outfit, items, onPress, onDelete }) {
  const outfitItems = outfit.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean);
  return (
    <TouchableOpacity style={s.card} onPress={() => onPress(outfit)} activeOpacity={0.9}>
      <ThumbnailRow itemIds={outfit.itemIds} items={items} size={46} overlap={14} />
      <View style={s.cardRow}>
        <Text style={s.cardTitle}>{outfitDisplayName(outfit)}</Text>
        <View style={s.vibeChip}>
          <Text style={s.vibeChipText}>{outfit.vibe.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={s.cardItems}>{outfitItems.map(itemDisplayName).join(' · ')}</Text>
      <TouchableOpacity
        style={s.deleteBtn}
        onPress={() => Alert.alert('Remove outfit', `Delete "${outfitDisplayName(outfit)}"?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete(outfit.id) },
        ])}
      >
        <Text style={s.deleteTxt}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function OutfitsScreen({ navigation }) {
  const { items, outfits } = useStore();
  const [vibe, setVibe] = useState('All');

  const filtered = vibe === 'All' ? outfits : outfits.filter(o => o.vibe === vibe);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.heading}>Outfits</Text>
          <Text style={s.subMono}>{outfits.length} OUTFITS</Text>
        </View>
        <TouchableOpacity style={s.createBtn} onPress={() => navigation.navigate('Add')}>
          <Icon name="plus" size={15} color={colors.white} strokeWidth={2.2} />
          <Text style={s.createBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={s.filterBar} contentContainerStyle={s.filterContent}>
        {VIBES.map(v => {
          const active = vibe === v;
          return (
            <TouchableOpacity key={v} style={[s.chip, active && s.chipActive]} onPress={() => setVibe(v)}>
              <Text style={[s.chipText, active && s.chipTextActive]}>{VIBE_DISPLAY(v)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView style={s.list} contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No outfits yet</Text>
            <Text style={s.emptyHint}>
              {vibe === 'All' ? 'Tap + Create to build your first combination.' : `No ${vibe} outfits yet.`}
            </Text>
          </View>
        ) : (
          filtered.map(outfit => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              items={items}
              onPress={(o) => navigation.navigate('EditOutfit', { outfit: o })}
              onDelete={deleteOutfit}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 16,
  },
  heading: { fontFamily: fonts.sans800, fontSize: 33, letterSpacing: -1, color: colors.ink, lineHeight: 34 },
  subMono: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.9, color: colors.inkFaint, marginTop: 8 },
  createBtn: {
    backgroundColor: colors.ink, borderRadius: 999,
    paddingHorizontal: 18, paddingVertical: 10, marginTop: 4,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  createBtnText: { fontFamily: fonts.sans700, fontSize: 13.5, color: colors.white },
  filterBar: { maxHeight: 52 },
  filterContent: { paddingHorizontal: layout.px, gap: 8, alignItems: 'center' },
  chip: {
    backgroundColor: colors.bg, borderWidth: 1,
    borderColor: colors.lineStrong, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.sans600, fontSize: 13, color: colors.inkSoft },
  chipTextActive: { color: colors.white },
  list: { flex: 1 },
  listContent: { padding: layout.px, paddingTop: 16, paddingBottom: 110, gap: 14 },
  card: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line,
    borderRadius: 18, padding: 16, position: 'relative',
    ...layout.cardShadowSm,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  cardTitle: { fontFamily: fonts.sans800, fontSize: 18, letterSpacing: -0.4, color: colors.ink, flex: 1 },
  vibeChip: {
    borderWidth: 1, borderColor: colors.lineStrong, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  vibeChipText: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.6, color: colors.inkSoft },
  cardItems: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.inkFaint, marginTop: 6, lineHeight: 18 },
  deleteBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center',
  },
  deleteTxt: { fontSize: 11, color: colors.inkFaint },
  empty: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontFamily: fonts.sans700, fontSize: 17, color: colors.inkFaint },
  emptyHint: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkGhost, textAlign: 'center', marginTop: 8 },
});
