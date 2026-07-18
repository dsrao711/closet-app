import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../data/store';
import { ThumbnailRow } from '../components/GarmentThumbnail';
import Icon from '../components/Icon';
import { colors, fonts, layout } from '../theme';
import { itemDisplayName, outfitDisplayName } from '../utils/labels';

const STAT_CATS = [
  { key: 'top',       label: 'TOPS' },
  { key: 'bottom',    label: 'TROUSERS' },
  { key: 'skirt',     label: 'SKIRTS' },
  { key: 'dress',     label: 'DRESSES' },
  { key: 'shoes',     label: 'FOOTWEAR' },
  { key: 'bag',       label: 'BAGS' },
  { key: 'accessory', label: 'ACCESSORIES' },
  { key: 'outerwear', label: 'OUTERWEAR' },
];

const DAYS_LONG = { Sun: 'SUN', Mon: 'MON', Tue: 'TUE', Wed: 'WED', Thu: 'THU', Fri: 'FRI', Sat: 'SAT' };
const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HomeScreen({ navigation }) {
  const { items, outfits, weeklyPlan, todayOutfit, profile } = useStore();

  const todayKey = DAY_MAP[new Date().getDay()];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  const hour = now.getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.name?.split(' ')[0] || '';

  const counts = {};
  items.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
  const statCats = STAT_CATS.filter(c => counts[c.key] > 0);

  return (
    <View style={s.screen}>
      {/* Header — fixed above the scroll area so it can never be scrolled/bounced under the status bar */}
      <View style={s.header}>
        <Text style={s.greeting}>{timeGreeting}{firstName ? `, ${firstName}` : ''}</Text>
        <Text style={s.heading}>Divya's{'\n'}Closet</Text>
        <Text style={s.subMono}>{items.length} ITEMS · {outfits.length} OUTFITS</Text>
      </View>

      <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Stats grid */}
      {statCats.length > 0 && (
        <View style={s.statsGrid}>
          {statCats.map(c => (
            <View key={c.key} style={s.statCard}>
              <Text style={s.statNum}>{counts[c.key]}</Text>
              <Text style={s.statLabel}>{c.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Today's outfit — only shown when today actually has a planned outfit */}
      {todayOutfit && (
        <View style={s.section}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Today's outfit</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Planner')}>
              <Text style={s.sectionMeta}>{DAYS_LONG[todayKey]} · {dateStr.split(',')[1]?.trim()} →</Text>
            </TouchableOpacity>
          </View>

          <View style={s.outfitCard}>
            <Text style={s.outfitVibeMono}>{todayOutfit.vibe.toUpperCase()}</Text>
            <Text style={s.outfitName}>{outfitDisplayName(todayOutfit)}</Text>
            <View style={{ marginTop: 16 }}>
              <ThumbnailRow itemIds={todayOutfit.itemIds} items={items} size={56} overlap={14} />
            </View>
            <Text style={s.outfitItems}>
              {todayOutfit.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean).map(itemDisplayName).join(' · ')}
            </Text>
          </View>
        </View>
      )}

      {/* Quick actions */}
      <View style={s.actionsRow}>
        <TouchableOpacity style={[s.actionCard, s.actionCardDark]} onPress={() => navigation.navigate('Add')}>
          <Icon name="plus" size={20} color={colors.white} strokeWidth={1.8} />
          <Text style={[s.actionLabel, { color: colors.white }]}>Add item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionCard} onPress={() => navigation.navigate('Planner')}>
          <Icon name="planner" size={20} color={colors.ink} strokeWidth={1.8} />
          <Text style={s.actionLabel}>Plan week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionCard} onPress={() => navigation.navigate('Wardrobe')}>
          <Icon name="wardrobe" size={20} color={colors.ink} strokeWidth={1.8} />
          <Text style={s.actionLabel}>Wardrobe</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 110 },
  header: { paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 20, backgroundColor: colors.bg },
  greeting: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5,
    textTransform: 'uppercase', color: colors.inkGhost, marginBottom: 6,
  },
  heading: {
    fontFamily: fonts.serif, fontSize: 52, lineHeight: 50,
    color: colors.ink, letterSpacing: -0.5,
  },
  subMono: {
    fontFamily: fonts.mono, fontSize: 11.5, letterSpacing: 1,
    color: colors.inkFaint, marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: layout.px, gap: 9, marginBottom: 28,
  },
  statCard: {
    width: '31%', backgroundColor: colors.paper,
    borderWidth: 1, borderColor: colors.paperBorder,
    borderRadius: layout.statRadius, paddingVertical: 12, paddingHorizontal: 12,
  },
  statNum: {
    fontFamily: fonts.sans800, fontSize: 24, letterSpacing: -0.5,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.6,
    color: colors.inkGhost, marginTop: 2,
  },
  section: { paddingHorizontal: layout.px, marginBottom: 24 },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'baseline', marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.sans800, fontSize: 18, letterSpacing: -0.4,
    color: colors.ink,
  },
  sectionMeta: {
    fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.8,
    color: colors.ink,
  },
  outfitCard: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line,
    borderRadius: 20, padding: 18,
    ...layout.cardShadow, marginBottom: 10,
  },
  outfitVibeMono: {
    fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1,
    color: colors.inkGhost,
  },
  outfitName: {
    fontFamily: fonts.sans800, fontSize: 22, letterSpacing: -0.5,
    color: colors.ink, marginTop: 5,
  },
  outfitItems: {
    fontFamily: fonts.sans, fontSize: 12.5, color: colors.inkFaint,
    marginTop: 14, lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row', paddingHorizontal: layout.px, gap: 9,
  },
  actionCard: {
    flex: 1, backgroundColor: colors.paper, borderWidth: 1,
    borderColor: colors.paperBorder, borderRadius: layout.cardRadius,
    paddingVertical: 15, paddingHorizontal: 12,
    gap: 10,
  },
  actionCardDark: {
    backgroundColor: colors.ink, borderColor: colors.ink,
  },
  actionLabel: {
    fontFamily: fonts.sans700, fontSize: 13, letterSpacing: -0.1,
    color: colors.ink,
  },
});
