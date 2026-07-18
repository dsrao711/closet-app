import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useStore, setDayOutfit, clearDayOutfit } from '../data/store';
import { ThumbnailRow } from '../components/GarmentThumbnail';
import { colors, fonts, layout } from '../theme';
import { itemDisplayName, outfitDisplayName } from '../utils/labels';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const TODAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function OutfitPickerModal({ visible, day, week, outfits, items, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={s.modalContainer}>
        <View style={s.modalHeader}>
          <Text style={s.modalTitle}>Pick outfit</Text>
          <Text style={s.modalSub}>{DAY_FULL[day]}</Text>
          <TouchableOpacity style={s.doneBtn} onPress={onClose}>
            <Text style={s.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.modalList}>
          <TouchableOpacity
            style={s.clearRow}
            onPress={() => { clearDayOutfit(week, day); onClose(); }}
          >
            <Text style={s.clearText}>— Clear this day</Text>
          </TouchableOpacity>

          {outfits.length === 0 ? (
            <View style={s.modalEmpty}>
              <Text style={s.modalEmptyTitle}>No outfits yet</Text>
              <Text style={s.modalEmptyHint}>Create one from the + tab.</Text>
            </View>
          ) : (
            outfits.map(outfit => {
              const outfitItems = outfit.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean);
              return (
                <TouchableOpacity
                  key={outfit.id}
                  style={s.outfitOption}
                  onPress={() => { setDayOutfit(week, day, outfit.id); onClose(); }}
                >
                  <ThumbnailRow itemIds={outfit.itemIds} items={items} size={40} overlap={12} />
                  <View style={s.optionInfo}>
                    <Text style={s.optionName}>{outfitDisplayName(outfit)}</Text>
                    <Text style={s.optionItems} numberOfLines={1}>
                      {outfitItems.map(itemDisplayName).join(' · ')}
                    </Text>
                  </View>
                  <View style={s.optionVibe}>
                    <Text style={s.optionVibeText}>{outfit.vibe.toUpperCase()}</Text>
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

  return (
    <TouchableOpacity style={[s.dayRow, isToday && s.dayRowToday]} onPress={onPress} activeOpacity={0.8}>
      <View style={s.dayLabelCol}>
        <Text style={[s.dayAbbr, isToday && s.dayAbbrToday]}>{day.toUpperCase()}</Text>
        {isToday && <View style={s.todayDot} />}
      </View>

      <View style={s.dayContent}>
        {outfit ? (
          <>
            <ThumbnailRow itemIds={outfit.itemIds} items={items} size={30} overlap={9} />
            <Text style={s.dayOutfitName}>{outfitDisplayName(outfit)}</Text>
          </>
        ) : (
          <Text style={s.dayEmpty}>Tap to plan</Text>
        )}
      </View>

      <Text style={s.dayChevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function PlannerScreen({ navigation }) {
  const { outfits, items, weeklyPlan } = useStore();
  const [activeWeek, setActiveWeek] = useState('current');
  const [pickerDay, setPickerDay] = useState(null);

  const today = TODAY_MAP[new Date().getDay()];
  const plan = weeklyPlan[activeWeek];

  const weekLabel = activeWeek === 'current'
    ? `WEEK OF ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`
    : 'NEXT WEEK';

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.heading}>Planner</Text>
        <Text style={s.subMono}>{weekLabel}</Text>

        {/* Week toggle */}
        <View style={s.toggle}>
          {['current', 'next'].map(w => (
            <TouchableOpacity
              key={w}
              style={[s.toggleBtn, activeWeek === w && s.toggleBtnActive]}
              onPress={() => setActiveWeek(w)}
            >
              <Text style={[s.toggleText, activeWeek === w && s.toggleTextActive]}>
                {w === 'current' ? 'This week' : 'Next week'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {DAYS.map(day => (
          <DayRow
            key={day}
            day={day}
            week={activeWeek}
            plan={plan}
            outfits={outfits}
            items={items}
            isToday={activeWeek === 'current' && day === today}
            onPress={() => setPickerDay(day)}
          />
        ))}
      </ScrollView>

      {outfits.length === 0 && (
        <View style={s.hint}>
          <Text style={s.hintText}>Create outfits first, then plan your week here.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Add')}>
            <Text style={s.hintLink}>Create an outfit →</Text>
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

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 16 },
  heading: { fontFamily: fonts.sans800, fontSize: 33, letterSpacing: -1, color: colors.ink, lineHeight: 34 },
  subMono: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.9, color: colors.inkFaint, marginTop: 8, marginBottom: 18 },
  toggle: {
    flexDirection: 'row', backgroundColor: colors.paperSunk,
    borderRadius: 999, padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 999 },
  toggleBtnActive: { backgroundColor: colors.bg, ...layout.cardShadowSm },
  toggleText: { fontFamily: fonts.sans600, fontSize: 13.5, color: colors.inkSoft },
  toggleTextActive: { fontFamily: fonts.sans700, color: colors.ink },
  list: { paddingHorizontal: layout.px, paddingTop: 18, paddingBottom: 120 },
  dayRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: colors.line,
    borderRadius: 14, padding: 12, paddingHorizontal: 14, marginBottom: 10,
  },
  dayRowToday: { borderWidth: 1.5, borderColor: colors.ink },
  dayLabelCol: { width: 34, alignItems: 'center' },
  dayAbbr: { fontFamily: fonts.sans800, fontSize: 13, letterSpacing: 0.2, color: colors.inkFaint },
  dayAbbrToday: { color: colors.ink },
  todayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.ink, marginTop: 4 },
  dayContent: { flex: 1, gap: 6 },
  dayOutfitName: { fontFamily: fonts.sans600, fontSize: 13.5, color: colors.ink },
  dayEmpty: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkGhost },
  dayChevron: { fontSize: 18, color: colors.inkGhost },
  hint: { position: 'absolute', bottom: 110, left: 0, right: 0, alignItems: 'center', paddingHorizontal: layout.px },
  hintText: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkFaint, textAlign: 'center' },
  hintLink: { fontFamily: fonts.sans700, fontSize: 14, color: colors.ink, marginTop: 8 },
  // Modal
  modalContainer: { flex: 1, backgroundColor: colors.bg },
  modalHeader: { padding: layout.px, paddingTop: 32, borderBottomWidth: 1, borderBottomColor: colors.line },
  modalTitle: { fontFamily: fonts.sans800, fontSize: 22, letterSpacing: -0.4, color: colors.ink },
  modalSub: { fontFamily: fonts.sans, fontSize: 15, color: colors.inkFaint, marginTop: 4 },
  doneBtn: { position: 'absolute', right: layout.px, top: 36 },
  doneBtnText: { fontFamily: fonts.sans700, fontSize: 16, color: colors.ink },
  modalList: { padding: layout.px, paddingBottom: 60 },
  clearRow: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line, marginBottom: 12 },
  clearText: { fontFamily: fonts.sans600, fontSize: 15, color: colors.danger },
  outfitOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: colors.line, borderRadius: 14,
    padding: 14, marginBottom: 10,
  },
  optionInfo: { flex: 1 },
  optionName: { fontFamily: fonts.sans700, fontSize: 15, color: colors.ink },
  optionItems: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkFaint, marginTop: 2 },
  optionVibe: {
    borderWidth: 1, borderColor: colors.lineStrong, borderRadius: 999,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  optionVibeText: { fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 0.5, color: colors.inkSoft },
  modalEmpty: { paddingTop: 60, alignItems: 'center' },
  modalEmptyTitle: { fontFamily: fonts.sans700, fontSize: 16, color: colors.inkFaint },
  modalEmptyHint: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkGhost, marginTop: 6 },
});
