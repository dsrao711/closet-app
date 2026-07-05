import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { addItem } from '../data/store';
import { colors, fonts, layout } from '../theme';

const CATEGORIES = [
  { key: 'top', label: 'Top' },
  { key: 'bottom', label: 'Trouser' },
  { key: 'skirt', label: 'Skirt' },
  { key: 'dress', label: 'Dress' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'bag', label: 'Bag' },
  { key: 'accessory', label: 'Accessory' },
  { key: 'outerwear', label: 'Outerwear' },
];

const OCCASIONS = [
  { key: 'workwear', label: 'Workwear' },
  { key: 'casual', label: 'Casual' },
  { key: 'date night', label: 'Date night' },
  { key: 'party', label: 'Party' },
  { key: 'vacation', label: 'Vacation' },
];

const COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Olive', hex: '#6B7C3B' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Blush', hex: '#FFB6C1' },
  { name: 'Red', hex: '#CC0000' },
  { name: 'Blue', hex: '#4169E1' },
  { name: 'Green', hex: '#228B22' },
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Orange', hex: '#FF8C00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Brown', hex: '#8B4513' },
];

function SectionLabel({ children }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function ChipPicker({ options, value, onChange }) {
  return (
    <View style={styles.chipRow}>
      {options.map(opt => {
        const active = value === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(opt.key)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AddItemScreen({ navigation }) {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('top');
  const [occasion, setOccasion] = useState('workwear');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  function handleSave() {
    if (!label.trim()) {
      Alert.alert('Name required', 'Give this item a name so you can recognize it.');
      return;
    }
    addItem({
      label: label.trim(),
      category,
      color: selectedColor.hex,
      colorName: selectedColor.name,
      occasion,
    });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Add item</Text>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        {/* Name */}
        <SectionLabel>Name</SectionLabel>
        <TextInput
          style={styles.input}
          placeholder="e.g. White linen shirt"
          placeholderTextColor={colors.textTertiary}
          value={label}
          onChangeText={setLabel}
          returnKeyType="done"
        />

        {/* Category */}
        <SectionLabel>Category</SectionLabel>
        <ChipPicker options={CATEGORIES} value={category} onChange={setCategory} />

        {/* Occasion */}
        <SectionLabel>Occasion</SectionLabel>
        <ChipPicker options={OCCASIONS} value={occasion} onChange={setOccasion} />

        {/* Color */}
        <SectionLabel>Colour</SectionLabel>
        <View style={styles.colorGrid}>
          {COLORS.map(c => (
            <TouchableOpacity
              key={c.hex}
              onPress={() => setSelectedColor(c)}
              style={[
                styles.colorSwatch,
                { backgroundColor: c.hex },
                (c.hex === '#FFFFFF' || c.hex === '#F5F5DC') && styles.colorSwatchBorder,
                selectedColor.hex === c.hex && styles.colorSwatchSelected,
              ]}
            />
          ))}
        </View>
        <Text style={styles.colorName}>{selectedColor.name}</Text>

        {/* Preview */}
        <View style={styles.preview}>
          <View style={[styles.previewSwatch, { backgroundColor: selectedColor.hex },
            (selectedColor.hex === '#FFFFFF' || selectedColor.hex === '#F5F5DC') && styles.previewSwatchBorder,
          ]} />
          <View style={styles.previewText}>
            <Text style={styles.previewLabel}>{label || 'Item name'}</Text>
            <Text style={styles.previewMeta}>
              {CATEGORIES.find(c => c.key === category)?.label}  ·  {selectedColor.name}
            </Text>
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save item</Text>
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
  form: { flex: 1 },
  formContent: { padding: layout.px, paddingBottom: 60 },
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
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  colorSwatch: { width: 40, height: 40, borderRadius: 20 },
  colorSwatchBorder: { borderWidth: 1, borderColor: colors.border },
  colorSwatchSelected: { borderWidth: 3, borderColor: colors.black },
  colorName: { fontSize: 13, color: colors.textSecondary, marginBottom: 20 },
  preview: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    padding: layout.cardPad, marginTop: 8, marginBottom: 24, ...layout.cardShadow,
  },
  previewSwatch: { width: 52, height: 52, borderRadius: 26, marginRight: 16 },
  previewSwatchBorder: { borderWidth: 1, borderColor: colors.border },
  previewText: { flex: 1 },
  previewLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  previewMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  saveBtn: {
    backgroundColor: colors.black, borderRadius: 14, padding: 18,
    alignItems: 'center',
  },
  saveBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
