import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet,
} from 'react-native';
import { useStore, setDayOutfit, clearDayOutfit } from '../data/store';
import { colors, fonts, layout } from '../theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };

function getTodayKey() {
  const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return map[new Date().getDay()];
}

function ColorDot({ color, size = 24 }) {
  return (
    <View style={[
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      (color === '#FFFFFF' || color === '#F5F5DC') && { borderWidth: 1, borderColor: colors.border },
    ]} />
  );
}

function OutfitPickerModal({ visible, day, week, outfits, items, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Pick outfit</Text>
          <Text style={styles.modalSub}>{DAY_LABELS[day]}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalList}>
          {/* Clear option */}
          <TouchableOpacity
            style={styles.clearRow}
            onPress={() => { clearDayOutfit(week, day); onClose(); }}
          >
            <Text style={styles.clearRowText}>— Clear day</Text>
          </TouchableOpacity>

          {outfits.length === 0 ? (
            <View style={styles.modalEmpty}>
              <Text style={styles.modalEmptyText}>No outfits yet.</Text>
              <Text style={styles.modalEmptyHint}>Create one from the + tab.</Text>
            </View>
          ) : (
            outfits.map(outfit => {
              const outfitItems = outfit.itemIds
                .map(id => items.find(i => i.id === id))
                .filter(Boolean);
              return (
                <TouchableOpacity
                  key={outfit.id}
                  style={styles.outfitOption}
                  onPress={() => { setDayOutfit(week, day, outfit.id); onClose(); }}
                >
                  <View style={styles.optionSwatches}>
                    {outfitItems.map(item => (
                      <ColorDot key={item.id} color={item.color} size={28} />
                    ))}
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionName}>{outfit.name}</Text>
                    <Text style={styles.optionMeta}>{outfitItems.map(i => i.label).join('  ·  ')}</Text>
                  </View>
                  <View style={styles.vibeChip}>
                    <Text style={styles.vibeChipText}>{outfit.vibe}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

function DayRow({ day, week, plan, outfits, items, isToday, onPress }) {
  const outfitId = plan[day];
  const outfit = outfitId ? outfits.find(o => o.id === outfitId) : null;
  const outfitItems = outfit
    ? outfit.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean)
    : [];

  return (
    <TouchableOpacity
      style={[styles.dayRow, isToday && styles.dayRowToday]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.dayLabel}>
        <Text style={[styles.dayAbbr, isToday && styles.dayAbbrToday]}>{day}</Text>
        {isToday && <View style={styles.todayDot} />}
      </View>

      <View style={styles.dayContent}>
        {outfit ? (
          <>
            <View style={styles.swatches}>
              {outfitItems.map(item => (
                <ColorDot key={item.id} color={item.color} size={24} />
              ))}
            </View>
            <Text style={styles.outfitName}>{outfit.name}</Text>
          </>
        ) : (
          <Text style={styles.emptyDay}>Tap to plan</Text>
        )}
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function PlannerScreen({ navigation }) {
  const { outfits, items, weeklyPlan } = useStore();
  const [activeWeek, setActiveWeek] = useState('current');
  const [pickerDay, setPickerDay] = useState(null);
  const todayKey = getTodayKey();

  const plan = weeklyPlan[activeWeek];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Planner</Text>

        {/* Week toggle */}
        <View style={styles.weekToggle}>
          {['current', 'next'].map(w => (
            <TouchableOpacity
              key={w}
              style={[styles.toggleBtn, activeWeek === w && styles.toggleBtnActive]}
              onPress={() => setActiveWeek(w)}
            >
              <Text style={[styles.toggleBtnText, activeWeek === w && styles.toggleBtnTextActive]}>
                {w === 'current' ? 'This week' : 'Next week'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {DAYS.map(day => (
          <DayRow
            key={day}
            day={day}
            week={activeWeek}
            plan={plan}
            outfits={outfits}
            items={items}
            isToday={activeWeek === 'current' && day === todayKey}
            onPress={() => setPickerDay(day)}
          />
        ))}
      </ScrollView>

      {outfits.length === 0 && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Create outfits first — then plan your week here.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Add')}>
            <Text style={styles.hintLink}>Create an outfit →</Text>
          </TouchableOpacity>
        </View>
      )}

      <OutfitPickerModal
        visible={pickerDay !== null}
        day={pickerDay || 'Mon'}
        week={activeWeek}
        outfits={outfits}
        items={items}
        onClose={() => setPickerDay(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 16 },
  heading: { ...fonts.heading, marginBottom: 16 },
  weekToggle: {
    flexDirection: 'row', backgroundColor: colors.highlight,
    borderRadius: 12, padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  toggleBtnActive: { backgroundColor: colors.white, ...layout.cardShadow },
  toggleBtnText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  toggleBtnTextActive: { color: colors.textPrimary, fontWeight: '700' },
  list: { paddingHorizontal: layout.px, paddingBottom: 120 },
  dayRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    padding: layout.cardPad, marginBottom: 10, ...layout.cardShadow,
  },
  dayRowToday: { borderWidth: 2, borderColor: colors.black },
  dayLabel: { width: 44, alignItems: 'center', marginRight: 12 },
  dayAbbr: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
  dayAbbrToday: { color: colors.textPrimary },
  todayDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: colors.black, marginTop: 4,
  },
  dayContent: { flex: 1 },
  swatches: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  outfitName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  emptyDay: { fontSize: 14, color: colors.textTertiary },
  chevron: { fontSize: 20, color: colors.textTertiary, marginLeft: 8 },
  hint: {
    position: 'absolute', bottom: 100, left: 0, right: 0,
    alignItems: 'center', paddingHorizontal: layout.px,
  },
  hintText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  hintLink: { fontSize: 14, color: colors.textPrimary, fontWeight: '700', marginTop: 8 },
  // Modal
  modalContainer: { flex: 1, backgroundColor: colors.bg },
  modalHeader: { padding: layout.px, paddingTop: 32, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { ...fonts.title },
  modalSub: { ...fonts.subtitle, marginTop: 4 },
  closeBtn: { position: 'absolute', right: layout.px, top: 36 },
  closeBtnText: { fontSize: 16, color: colors.textPrimary, fontWeight: '600' },
  modalList: { padding: layout.px, paddingBottom: 60 },
  clearRow: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 12 },
  clearRowText: { fontSize: 15, color: colors.danger },
  outfitOption: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    padding: layout.cardPad, marginBottom: 10, ...layout.cardShadow,
  },
  optionSwatches: { flexDirection: 'row', gap: 6, marginRight: 12 },
  optionInfo: { flex: 1 },
  optionName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  optionMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  vibeChip: {
    backgroundColor: colors.black, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20, marginLeft: 8,
  },
  vibeChipText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  modalEmpty: { paddingTop: 60, alignItems: 'center' },
  modalEmptyText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  modalEmptyHint: { fontSize: 13, color: colors.textTertiary, marginTop: 6 },
});
