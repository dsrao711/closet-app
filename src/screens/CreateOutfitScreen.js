import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useStore, addOutfit } from '../data/store';
import GarmentThumbnail, { ThumbnailRow } from '../components/GarmentThumbnail';
import { colors, fonts, layout } from '../theme';
import { itemDisplayName, occasionDisplay } from '../utils/labels';

const OCCASIONS = ['Workwear', 'Casual', 'Date night', 'Party', 'Vacation', 'Brunch', 'Concert'];
const COMBO_TYPES = [
  { key: 'dress', label: 'Dress', desc: 'A single statement piece' },
  { key: 'separates', label: 'Top + Bottom', desc: 'Mix and match separates' },
];

const TOP_CATS = ['top'];
const BOTTOM_CATS = ['bottom', 'skirt'];
const FOOTWEAR_CATS = ['shoes'];
const ACC_CATS = ['bag', 'accessory', 'outerwear'];
const DRESS_CATS = ['dress'];

const STEP_LABELS = ['OCCASION', 'COMBINATION', 'TOP', 'BOTTOM', 'FOOTWEAR', 'ACCESSORIES'];

function ProgressBar({ step, total }) {
  return (
    <View style={s.progressRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[s.progressSeg, i < step && { backgroundColor: colors.accent }]}
        />
      ))}
    </View>
  );
}

function ItemGrid({ categoryItems, selected, onToggle, size = 2 }) {
  if (categoryItems.length === 0) {
    return (
      <View style={s.noItems}>
        <Text style={s.noItemsText}>No items in this category yet.</Text>
      </View>
    );
  }
  return (
    <View style={s.grid}>
      {categoryItems.map(item => {
        const sel = selected.includes(item.id);
        return (
          <TouchableOpacity key={item.id} style={s.gridItem} onPress={() => onToggle(item.id)} activeOpacity={0.85}>
            <View style={[s.gridThumb, sel && s.gridThumbSelected]}>
              <GarmentThumbnail item={item} size={160} round={false} />
              {sel && (
                <View style={s.checkOverlay}>
                  <View style={s.checkCircle}>
                    <Text style={s.checkMark}>✓</Text>
                  </View>
                </View>
              )}
            </View>
            <Text style={s.gridLabel} numberOfLines={2}>{itemDisplayName(item)}</Text>
            <Text style={s.gridOcc} numberOfLines={1}>{occasionDisplay(item.occasion).toUpperCase()}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function CreateOutfitScreen({ navigation }) {
  const { items } = useStore();
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState('Date night');
  const [comboType, setComboType] = useState('dress');
  const [selectedIds, setSelectedIds] = useState([]);
  const [outfitName, setOutfitName] = useState('');
  const [saving, setSaving] = useState(false);

  const TOTAL_STEPS = comboType === 'dress' ? 5 : 6;

  function toggle(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function clearCatSelection(cats) {
    setSelectedIds(prev => prev.filter(id => {
      const item = items.find(i => i.id === id);
      return item && !cats.includes(item.category);
    }));
  }

  function next() {
    if (step === 2 && comboType === 'dress') {
      // skip bottom step
      setStep(4); // jump to footwear (step 4 in dress flow = step 5 in separates)
      return;
    }
    setStep(s => s + 1);
  }

  function prev() {
    if (step === 4 && comboType === 'dress') {
      setStep(2); return;
    }
    setStep(s => s - 1);
  }

  async function handleSave() {
    if (selectedIds.length === 0) {
      Alert.alert('No items', 'Select at least one piece.');
      return;
    }
    setSaving(true);
    try {
      await addOutfit({ name: outfitName.trim(), vibe: occasion.toLowerCase(), itemIds: selectedIds });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Save failed', 'Could not save outfit. Check your connection and try again.');
      setSaving(false);
    }
  }

  const selectedItems = selectedIds.map(id => items.find(i => i.id === id)).filter(Boolean);

  // Which step number to display (dress flow collapses step 4)
  const displayStep = comboType === 'dress' && step >= 4 ? step - 1 : step;

  function renderStep() {
    // STEP 1 — Occasion
    if (step === 1) return (
      <View style={s.stepContent}>
        <Text style={s.stepQ}>Where are you{'\n'}headed?</Text>
        <Text style={s.stepHint}>Pick the occasion and we'll build around it.</Text>
        <Text style={s.monoLabel}>OCCASION</Text>
        {/* Dropdown-style list */}
        <View style={s.occList}>
          {OCCASIONS.map((occ, idx) => {
            const sel = occ === occasion;
            return (
              <TouchableOpacity
                key={occ}
                style={[
                  s.occRow,
                  idx === 0 && s.occRowFirst,
                  idx === OCCASIONS.length - 1 && s.occRowLast,
                  sel && s.occRowSelected,
                ]}
                onPress={() => setOccasion(occ)}
              >
                <Text style={[s.occText, sel && s.occTextSelected]}>{occ}</Text>
                {sel && <Text style={{ color: colors.accent, fontSize: 14, fontFamily: fonts.sans700 }}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );

    // STEP 2 — Combination type
    if (step === 2) return (
      <View style={s.stepContent}>
        <Text style={s.stepQ}>One piece or two?</Text>
        <Text style={s.stepHint}>Choose how you're putting this look together.</Text>
        <View style={s.comboCards}>
          {COMBO_TYPES.map(ct => {
            const sel = comboType === ct.key;
            return (
              <TouchableOpacity
                key={ct.key}
                style={[s.comboCard, sel && s.comboCardSelected]}
                onPress={() => { setComboType(ct.key); clearCatSelection(sel ? [] : []); }}
              >
                <Text style={{ fontSize: 36, marginBottom: 12 }}>{ct.key === 'dress' ? '👗' : '👕'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.comboTitle}>{ct.label}</Text>
                  <Text style={s.comboDesc}>{ct.desc}</Text>
                </View>
                <View style={[s.comboCheck, sel && s.comboCheckActive]}>
                  {sel && <Text style={{ color: colors.white, fontSize: 13, fontFamily: fonts.sans700 }}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );

    // STEP 3 — Top (or Dress)
    if (step === 3) {
      const cats = comboType === 'dress' ? DRESS_CATS : TOP_CATS;
      const catItems = items.filter(i => cats.includes(i.category));
      return (
        <View style={s.stepContent}>
          <Text style={s.stepQ}>{comboType === 'dress' ? 'Pick a dress' : 'Pick a top'}</Text>
          <ItemGrid categoryItems={catItems} selected={selectedIds} onToggle={toggle} />
        </View>
      );
    }

    // STEP 4 — Bottom (separates only)
    if (step === 4 && comboType === 'separates') {
      const catItems = items.filter(i => BOTTOM_CATS.includes(i.category));
      return (
        <View style={s.stepContent}>
          <Text style={s.stepQ}>Pick a bottom</Text>
          <ItemGrid categoryItems={catItems} selected={selectedIds} onToggle={toggle} />
        </View>
      );
    }

    // STEP 4 (dress) or STEP 5 (separates) — Footwear
    if ((step === 4 && comboType === 'dress') || (step === 5 && comboType === 'separates')) {
      const catItems = items.filter(i => FOOTWEAR_CATS.includes(i.category));
      return (
        <View style={s.stepContent}>
          <Text style={s.stepQ}>Pick footwear</Text>
          <ItemGrid categoryItems={catItems} selected={selectedIds} onToggle={toggle} />
        </View>
      );
    }

    // STEP 5 (dress) or STEP 6 (separates) — Accessories + Name
    const catItems = items.filter(i => ACC_CATS.includes(i.category));
    return (
      <View style={s.stepContent}>
        <Text style={s.stepQ}>Finish it off</Text>
        <Text style={s.stepHint}>Add accessories, then name your outfit.</Text>
        <Text style={s.monoLabel}>ACCESSORIES (OPTIONAL)</Text>
        <ItemGrid categoryItems={catItems} selected={selectedIds} onToggle={toggle} />
        <Text style={s.monoLabel}>OUTFIT NAME (OPTIONAL)</Text>
        <TextInput
          style={s.nameInput}
          placeholder="e.g. Dinner Reservations"
          placeholderTextColor={colors.inkGhost}
          value={outfitName}
          onChangeText={setOutfitName}
          returnKeyType="done"
        />
      </View>
    );
  }

  const isFinalStep = (comboType === 'dress' && step === 5) || (comboType === 'separates' && step === 6);

  return (
    <View style={s.container}>
      {/* Nav bar */}
      <View style={s.navbar}>
        <TouchableOpacity style={s.backCircle} onPress={() => step === 1 ? navigation.goBack() : prev()}>
          <Text style={s.backChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>Create outfit</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={s.progressHeader}>
          <Text style={s.stepNumMono}>STEP {displayStep} OF {TOTAL_STEPS}</Text>
          <Text style={s.stepNameMono}>{STEP_LABELS[step - 1]}</Text>
        </View>
        <ProgressBar step={displayStep} total={TOTAL_STEPS} />

        {/* Selected preview strip */}
        {selectedItems.length > 0 && (
          <View style={s.previewStrip}>
            <ThumbnailRow itemIds={selectedIds} items={items} size={40} overlap={12} />
            <Text style={s.previewText} numberOfLines={1}>
              {selectedItems.map(itemDisplayName).join('  ·  ')}
            </Text>
          </View>
        )}

        {renderStep()}
      </ScrollView>

      {/* Footer CTA */}
      <View style={s.footer}>
        <TouchableOpacity style={[s.cta, saving && { opacity: 0.6 }]} onPress={isFinalStep ? handleSave : next} disabled={saving}>
          {saving
            ? <ActivityIndicator color={colors.white} />
            : <Text style={s.ctaText}>{isFinalStep ? 'Save outfit' : 'Continue →'}</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  navbar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: layout.px, paddingTop: 54, paddingBottom: 12,
    backgroundColor: colors.bg,
  },
  backCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.paperSunk,
    alignItems: 'center', justifyContent: 'center',
  },
  backChevron: { fontSize: 22, color: colors.ink, lineHeight: 26, marginTop: -2 },
  navTitle: {
    fontFamily: fonts.sans700, fontSize: 16, letterSpacing: -0.2,
    color: colors.ink, flex: 1, textAlign: 'center', marginLeft: -38,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: layout.px, paddingBottom: 20 },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9,
  },
  stepNumMono: {
    fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, color: colors.accent,
  },
  stepNameMono: {
    fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.8, color: colors.inkGhost,
  },
  progressRow: { flexDirection: 'row', gap: 5, marginBottom: 22 },
  progressSeg: {
    flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong,
  },
  previewStrip: {
    backgroundColor: colors.paper, borderRadius: 14,
    padding: 14, marginBottom: 18, gap: 10,
  },
  previewText: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkFaint },
  stepContent: { gap: 4 },
  stepQ: {
    fontFamily: fonts.sans800, fontSize: 26, letterSpacing: -0.5,
    color: colors.ink, lineHeight: 30, marginBottom: 4,
  },
  stepHint: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkFaint, marginBottom: 8 },
  monoLabel: {
    fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1,
    textTransform: 'uppercase', color: colors.inkGhost,
    marginTop: 22, marginBottom: 10,
  },
  // Occasion list
  occList: {
    borderWidth: 1.5, borderColor: colors.ink, borderRadius: 14, overflow: 'hidden',
    ...layout.cardShadow,
  },
  occRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 12, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0EEEB',
    backgroundColor: colors.bg,
  },
  occRowFirst: { borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  occRowLast: { borderBottomWidth: 0, borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
  occRowSelected: { backgroundColor: '#FCEEF2' },
  occText: { fontFamily: fonts.sans, fontSize: 14.5, color: colors.inkSoft },
  occTextSelected: { fontFamily: fonts.sans700, color: colors.ink },
  // Combo cards
  comboCards: { gap: 14, marginTop: 24 },
  comboCard: {
    borderWidth: 1.5, borderColor: colors.lineStrong, borderRadius: 18,
    padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: colors.bg,
  },
  comboCardSelected: { borderColor: colors.ink, backgroundColor: colors.paperRaised },
  comboTitle: { fontFamily: fonts.sans800, fontSize: 18, letterSpacing: -0.2, color: colors.ink },
  comboDesc: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkFaint, marginTop: 3 },
  comboCheck: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5, borderColor: colors.lineStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  comboCheckActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  // Item grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 4 },
  gridItem: { width: '47%' },
  gridThumb: {
    width: '100%', aspectRatio: 1, borderRadius: 10,
    overflow: 'hidden', backgroundColor: colors.garmentBg, position: 'relative',
  },
  gridThumbSelected: { borderWidth: 2, borderColor: colors.ink },
  checkOverlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(10,10,10,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: colors.white, fontSize: 14, fontFamily: fonts.sans700 },
  gridLabel: { fontFamily: fonts.sans600, fontSize: 14, color: colors.ink, marginTop: 9 },
  gridOcc: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.6, color: colors.inkGhost, marginTop: 3 },
  noItems: { paddingVertical: 24, alignItems: 'center' },
  noItemsText: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkFaint },
  // Name input
  nameInput: {
    height: 50, borderWidth: 1.5, borderColor: colors.ink,
    borderRadius: 14, backgroundColor: colors.bg,
    paddingHorizontal: 16, fontFamily: fonts.sans600, fontSize: 15, color: colors.ink,
  },
  // Footer
  footer: {
    padding: layout.px, paddingBottom: 34,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: '#F0EEEB',
  },
  cta: {
    backgroundColor: colors.ink, borderRadius: 16,
    height: 54, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  ctaText: { fontFamily: fonts.sans700, fontSize: 16, color: colors.white },
});
