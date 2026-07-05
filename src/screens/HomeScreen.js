import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../data/store';
import { colors, fonts, layout } from '../theme';

const CATEGORY_LABELS = {
  top: 'Tops', bottom: 'Trousers', skirt: 'Skirts',
  dress: 'Dresses', shoes: 'Footwear', bag: 'Bags',
  accessory: 'Accessories', outerwear: 'Outerwear',
};

function StatCard({ count, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ColorDot({ color, size = 28 }) {
  return (
    <View style={[
      styles.colorDot,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      (color === '#FFFFFF' || color === '#F5F5DC') && styles.colorDotBorder,
    ]} />
  );
}

function OutfitRow({ outfit, items }) {
  if (!outfit) return null;
  const outfitItems = outfit.itemIds
    .map(id => items.find(i => i.id === id))
    .filter(Boolean);

  return (
    <View style={styles.outfitRow}>
      <View style={styles.outfitDots}>
        {outfitItems.map(item => (
          <ColorDot key={item.id} color={item.color} size={32} />
        ))}
      </View>
      <View style={styles.outfitInfo}>
        <Text style={styles.outfitName}>{outfit.name}</Text>
        <Text style={styles.outfitMeta}>
          {outfitItems.map(i => i.label).join(' + ')}
        </Text>
      </View>
      <View style={[styles.vibeChip]}>
        <Text style={styles.vibeChipText}>{outfit.vibe}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { items, outfits, todayOutfit } = useStore();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = days[new Date().getDay()];

  // Count by category
  const counts = {};
  items.forEach(i => {
    counts[i.category] = (counts[i.category] || 0) + 1;
  });

  const statEntries = Object.entries(CATEGORY_LABELS)
    .map(([cat, label]) => ({ label, count: counts[cat] || 0 }))
    .filter(s => s.count > 0);

  // Recent outfits for "wear this today" section
  const wearToday = todayOutfit
    ? [todayOutfit]
    : outfits.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Divya's Closet</Text>
        <Text style={styles.subheading}>
          {items.length} items · {outfits.length} outfits
        </Text>
      </View>

      {/* Stats grid */}
      {statEntries.length > 0 && (
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            {statEntries.map(s => (
              <StatCard key={s.label} count={s.count} label={s.label} />
            ))}
          </View>
        </View>
      )}

      {items.length === 0 && (
        <View style={styles.emptyStats}>
          <Text style={styles.emptyText}>Your closet is empty.</Text>
          <Text style={styles.emptyHint}>Tap + to add your first item.</Text>
        </View>
      )}

      {/* Wear this today */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {todayOutfit ? `Wearing today · ${todayName}` : 'Wear this today'}
          </Text>
          {outfits.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('Outfits')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          )}
        </View>

        {wearToday.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No outfits yet.</Text>
            <Text style={styles.emptyCardHint}>Create one with the + button.</Text>
          </View>
        ) : (
          wearToday.map(outfit => (
            <View key={outfit.id} style={styles.outfitCard}>
              <OutfitRow outfit={outfit} items={items} />
            </View>
          ))
        )}
      </View>

      {/* Quick actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.actionIcon}>＋</Text>
            <Text style={styles.actionLabel}>Add item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Planner')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionLabel}>Plan week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Wardrobe')}
          >
            <Text style={styles.actionIcon}>👗</Text>
            <Text style={styles.actionLabel}>Wardrobe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 100 },
  header: { paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 24 },
  heading: { ...fonts.heading },
  subheading: { ...fonts.subtitle, marginTop: 4 },
  statsCard: {
    marginHorizontal: layout.px, backgroundColor: colors.cardBg,
    borderRadius: layout.cardRadius, padding: layout.cardPad,
    ...layout.cardShadow, marginBottom: 24,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  statCard: { width: '33.33%', paddingVertical: 10, paddingHorizontal: 4 },
  statNumber: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  emptyStats: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 17, color: colors.textSecondary, fontWeight: '600' },
  emptyHint: { fontSize: 14, color: colors.textTertiary, marginTop: 6 },
  section: { paddingHorizontal: layout.px, marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  seeAll: { fontSize: 14, color: colors.textSecondary },
  outfitCard: {
    backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    padding: layout.cardPad, marginBottom: 10, ...layout.cardShadow,
  },
  outfitRow: { flexDirection: 'row', alignItems: 'center' },
  outfitDots: { flexDirection: 'row', gap: 6, marginRight: 12 },
  outfitInfo: { flex: 1 },
  outfitName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  outfitMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  vibeChip: {
    backgroundColor: colors.black, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  vibeChipText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  colorDot: {},
  colorDotBorder: { borderWidth: 1, borderColor: colors.border },
  emptyCard: {
    backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    padding: 24, alignItems: 'center', ...layout.cardShadow,
  },
  emptyCardText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
  emptyCardHint: { fontSize: 13, color: colors.textTertiary, marginTop: 6 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionCard: {
    flex: 1, backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    paddingVertical: 20, alignItems: 'center', ...layout.cardShadow,
  },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
});
