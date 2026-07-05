import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useStore, addOutfit } from '../data/store';
import { colors, fonts, layout } from '../theme';

const VIBES = [
  { key: 'workwear', label: 'Workwear' },
  { key: 'casual', label: 'Casual' },
  { key: 'date night', label: 'Date night' },
  { key: 'party', label: 'Party' },
  { key: 'vacation', label: 'Vacation' },
];

const CAT_ORDER = ['top', 'bottom', 'skirt', 'dress', 'shoes', 'bag', 'accessory', 'outerwear'];
const CAT_LABELS = {
  top: 'Tops', bottom: 'Trousers', skirt: 'Skirts', dress: 'Dresses',
  shoes: 'Footwear', bag: 'Bags', accessory: 'Accessories', outerwear: 'Outerwear',
};

function ColorDot({ color, size = 32 }) {
  return (
    <View style={[
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      (color === '#FFFFFF' || color === '#F5F5DC') && { borderWidth: 1, borderColor: colors.border },
    ]} />
  );
}

export default function CreateOutfitScreen({ navigation }) {
  const { items } = useStore();
  const [name, setName] = useState('');
  const [vibe, setVibe] = useState('workwear');
  const [selectedIds, setSelectedIds] = useState([]);

  function toggleItem(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this outfit a name.');
      return;
    }
    if (selectedIds.length < 2) {
      Alert.alert('Select items', 'Pick at least 2 items to build an outfit.');
      return;
    }
    addOutfit({ name: name.trim(), vibe, itemIds: selectedIds });
    navigation.goBack();
  }

  // Group items by category, ordered
  const grouped = CAT_ORDER.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {});

  const selectedItems = selectedIds.map(id => items.find(i => i.id === id)).filter(Boolean);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Create outfit</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Name */}
        <Text style={styles.sectionLabel}>Outfit name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Office Monday"
          placeholderTextColor={colors.textTertiary}
          value={name}
          onChangeText={setName}
          returnKeyType="done"
        />

        {/* Vibe */}
        <Text style={styles.sectionLabel}>Vibe</Text>
        <View style={styles.chipRow}>
          {VIBES.map(v => {
            const active = vibe === v.key;
            return (
              <TouchableOpacity
                key={v.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setVibe(v.key)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{v.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected preview */}
        {selectedItems.length > 0 && (
          <View style={styles.preview}>
            <View style={styles.previewSwatches}>
              {selectedItems.map(item => (
                <ColorDot key={item.id} color={item.color} size={36} />
              ))}
            </View>
            <Text style={styles.previewText}>
              {selectedItems.map(i => i.label).join('  ·  ')}
            </Text>
          </View>
        )}

        {/* Item picker */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
          Select items · {selectedIds.length} chosen
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyItems}>
            <Text style={styles.emptyText}>Your wardrobe is empty.</Text>
            <Text style={styles.emptyHint}>Add clothing items first.</Text>
          </View>
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => (
            <View key={cat}>
              <Text style={styles.catLabel}>{CAT_LABELS[cat]}</Text>
              {catItems.map(item => {
                const selected = selectedIds.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemRow, selected && styles.itemRowSelected]}
                    onPress={() => toggleItem(item.id)}
                    activeOpacity={0.8}
                  >
                    <ColorDot color={item.color} size={36} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                      <Text style={styles.itemMeta}>{item.colorName}  ·  {item.occasion}</Text>
                    </View>
                    {selected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save outfit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 8 },
  backBtn: { marginBottom: 8 },
  backBtnText: { fontSize: 16, color: colors.textSecondary },
  heading: { ...fonts.heading },
  scroll: { flex: 1 },
  scrollContent: { padding: layout.px, paddingBottom: 60 },
  sectionLabel: { ...fonts.label, marginBottom: 10, marginTop: 20 },
  input: {
    backgroundColor: colors.cardBg, borderRadius: 12, padding: 14,
    fontSize: 15, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.chipOutlineBg, paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: layout.chipRadius,
  },
  chipActive: { backgroundColor: colors.black },
  chipText: { fontSize: 14, color: colors.chipOutlineText, fontWeight: '500' },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  preview: {
    backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    padding: layout.cardPad, marginTop: 16, ...layout.cardShadow,
  },
  previewSwatches: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  previewText: { fontSize: 13, color: colors.textSecondary },
  catLabel: {
    fontSize: 12, fontWeight: '600', color: colors.textTertiary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 16,
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: 12,
    padding: 12, marginBottom: 8, ...layout.cardShadow,
  },
  itemRowSelected: {
    borderWidth: 2, borderColor: colors.black,
  },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  itemMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  checkmark: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center',
  },
  checkmarkText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  emptyItems: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  emptyHint: { fontSize: 13, color: colors.textTertiary, marginTop: 6 },
  saveBtn: {
    backgroundColor: colors.black, borderRadius: 14, padding: 18,
    alignItems: 'center', marginTop: 32,
  },
  saveBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
