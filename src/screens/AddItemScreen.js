import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Image, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addItem } from '../data/store';
import { colors, fonts, layout } from '../theme';

const CATEGORIES = [
  { key: 'top', label: 'Top' }, { key: 'bottom', label: 'Trouser' },
  { key: 'skirt', label: 'Skirt' }, { key: 'dress', label: 'Dress' },
  { key: 'shoes', label: 'Shoes' }, { key: 'bag', label: 'Bag' },
  { key: 'accessory', label: 'Accessory' }, { key: 'outerwear', label: 'Outerwear' },
];

const OCCASIONS = [
  { key: 'workwear', label: 'Workwear' }, { key: 'casual', label: 'Casual' },
  { key: 'date night', label: 'Date night' }, { key: 'party', label: 'Party' },
  { key: 'vacation', label: 'Vacation' },
];

function MonoLabel({ children }) {
  return <Text style={s.monoLabel}>{children}</Text>;
}

function ChipRow({ options, value, onChange }) {
  return (
    <View style={s.chipRow}>
      {options.map(opt => {
        const active = value === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[s.chip, active && s.chipActive]}
            onPress={() => onChange(opt.key)}
          >
            <Text style={[s.chipText, active && s.chipTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AddItemScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [category, setCategory] = useState('top');
  const [occasion, setOccasion] = useState('workwear');
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access needed', 'Please allow camera access in settings.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function uploadPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function handleSave() {
    if (!label.trim()) {
      Alert.alert('Name required', 'Give this item a name.');
      return;
    }
    setSaving(true);
    try {
      await addItem({ label: label.trim(), category, occasion, imageUri: imageUri || null });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Save failed', 'Could not save item. Check your connection and try again.');
      setSaving(false);
    }
  }

  return (
    <View style={s.container}>
      {/* Nav bar */}
      <View style={s.navbar}>
        <TouchableOpacity style={s.backCircle} onPress={() => navigation.goBack()}>
          <Text style={s.backChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>Add item</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photo section */}
        <MonoLabel>PHOTO</MonoLabel>

        {imageUri ? (
          <View style={s.photoPreview}>
            <Image source={{ uri: imageUri }} style={s.photoImg} />
            {/* Overlay badge */}
            <View style={s.photoBadge}>
              <Text style={s.photoBadgeText}>✓ PHOTO ADDED</Text>
            </View>
            {/* Action buttons */}
            <View style={s.photoActions}>
              <TouchableOpacity style={s.photoActionBtn} onPress={uploadPhoto}>
                <Text style={s.photoActionIcon}>↔</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.photoActionBtn, { backgroundColor: 'rgba(200,64,52,0.92)' }]}
                onPress={() => setImageUri(null)}
              >
                <Text style={s.photoActionIcon}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={s.photoRow}>
            <TouchableOpacity style={s.photoBtnDark} onPress={takePhoto}>
              <Text style={s.photoBtnIcon}>📷</Text>
              <Text style={s.photoBtnTextLight}>Take photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.photoBtnOutline} onPress={uploadPhoto}>
              <Text style={s.photoBtnIcon}>🖼</Text>
              <Text style={s.photoBtnTextDark}>Upload</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Category */}
        <MonoLabel>CATEGORY</MonoLabel>
        <ChipRow options={CATEGORIES} value={category} onChange={setCategory} />

        {/* Occasion */}
        <MonoLabel>OCCASION</MonoLabel>
        <ChipRow options={OCCASIONS} value={occasion} onChange={setOccasion} />

        {/* Name */}
        <MonoLabel>ITEM NAME</MonoLabel>
        <TextInput
          style={s.input}
          placeholder="e.g. Ivory silk blouse"
          placeholderTextColor={colors.inkGhost}
          value={label}
          onChangeText={setLabel}
          returnKeyType="done"
        />
      </ScrollView>

      {/* Sticky save button */}
      <View style={s.footer}>
        <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color={colors.white} />
            : <Text style={s.saveBtnText}>Save item</Text>
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
  monoLabel: {
    fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1,
    textTransform: 'uppercase', color: colors.inkGhost,
    marginTop: 22, marginBottom: 10,
  },
  photoRow: { flexDirection: 'row', gap: 10 },
  photoBtnDark: {
    flex: 1, backgroundColor: colors.ink, borderRadius: 14,
    height: 50, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  photoBtnOutline: {
    flex: 1, backgroundColor: colors.bg, borderWidth: 1.5,
    borderColor: colors.ink, borderRadius: 14,
    height: 50, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  photoBtnIcon: { fontSize: 16 },
  photoBtnTextLight: { fontFamily: fonts.sans700, fontSize: 14, color: colors.white },
  photoBtnTextDark: { fontFamily: fonts.sans700, fontSize: 14, color: colors.ink },
  photoPreview: {
    width: '100%', height: 230, borderRadius: 16,
    overflow: 'hidden', backgroundColor: colors.paperSunk,
    borderWidth: 1, borderColor: colors.line, position: 'relative',
  },
  photoImg: { width: '100%', height: '100%' },
  photoBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(10,10,10,0.72)',
    paddingHorizontal: 9, paddingVertical: 5,
    borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  photoBadgeText: {
    fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1,
    color: '#7DD68F',
  },
  photoActions: {
    position: 'absolute', bottom: 10, right: 10,
    flexDirection: 'row', gap: 8,
  },
  photoActionBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  photoActionIcon: { fontSize: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.bg, borderWidth: 1,
    borderColor: colors.lineStrong, borderRadius: 999,
    paddingHorizontal: 15, paddingVertical: 8,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.sans600, fontSize: 13, color: colors.inkSoft },
  chipTextActive: { color: colors.white },
  input: {
    height: 50, borderWidth: 1, borderColor: colors.lineStrong,
    borderRadius: 14, backgroundColor: colors.paperInput,
    paddingHorizontal: 16, fontFamily: fonts.sans, fontSize: 15,
    color: colors.ink,
  },
  footer: {
    padding: layout.px, paddingBottom: 34,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: '#F0EEEB',
  },
  saveBtn: {
    backgroundColor: colors.ink, borderRadius: 16,
    height: 54, alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { fontFamily: fonts.sans700, fontSize: 16, color: colors.white },
});
