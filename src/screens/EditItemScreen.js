import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { updateItem, deleteItem } from '../data/store';
import { colors, fonts, layout } from '../theme';
import { CATEGORY_OPTIONS, OCCASION_OPTIONS, itemDisplayName } from '../utils/labels';
import { resizeForUpload } from '../utils/image';

function MonoLabel({ children }) {
  return <Text style={s.monoLabel}>{children}</Text>;
}

function ChipRow({ options, value, onChange, multi = false }) {
  return (
    <View style={s.chipRow}>
      {options.map(opt => {
        const active = multi ? value.includes(opt.key) : value === opt.key;
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

export default function EditItemScreen({ navigation, route }) {
  const { item } = route.params;
  const [imageUri, setImageUri] = useState(item.imageUri || null);
  const [category, setCategory] = useState(item.category);
  const [occasions, setOccasions] = useState(item.occasion || []);
  const [label, setLabel] = useState(item.label || '');
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
    if (!result.canceled) setImageUri(await resizeForUpload(result.assets[0].uri));
  }

  async function uploadPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) setImageUri(await resizeForUpload(result.assets[0].uri));
  }

  function toggleOccasion(key) {
    setOccasions(prev => prev.includes(key) ? prev.filter(o => o !== key) : [...prev, key]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateItem(item.id, { label: label.trim(), category, occasion: occasions, imageUri });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Save failed', 'Could not save changes. Check your connection and try again.');
      setSaving(false);
    }
  }

  function handleDelete() {
    Alert.alert('Delete item', `Delete "${itemDisplayName(item)}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteItem(item.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <View style={s.container}>
      {/* Nav bar */}
      <View style={s.navbar}>
        <TouchableOpacity style={s.backCircle} onPress={() => navigation.goBack()}>
          <Text style={s.backChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>Edit item</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photo section */}
        {imageUri ? (
          <View style={s.photoPreview}>
            <Image source={{ uri: imageUri }} style={s.photoImg} />
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
        <ChipRow options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />

        {/* Occasion */}
        <MonoLabel>OCCASION (SELECT ANY)</MonoLabel>
        <ChipRow options={OCCASION_OPTIONS} value={occasions} onChange={toggleOccasion} multi />

        {/* Name */}
        <MonoLabel>ITEM NAME (OPTIONAL)</MonoLabel>
        <TextInput
          style={s.input}
          placeholder="e.g. Ivory silk blouse"
          placeholderTextColor={colors.inkGhost}
          value={label}
          onChangeText={setLabel}
          returnKeyType="done"
        />

        <TouchableOpacity style={s.deleteRow} onPress={handleDelete}>
          <Text style={s.deleteText}>Delete item</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky save button */}
      <View style={s.footer}>
        <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color={colors.white} />
            : <Text style={s.saveBtnText}>Save changes</Text>
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
  deleteRow: { alignItems: 'center', marginTop: 26 },
  deleteText: { fontFamily: fonts.sans700, fontSize: 14, color: colors.danger },
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
