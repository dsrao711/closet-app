import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useStore, updateOutfit, deleteOutfit } from '../data/store';
import GarmentThumbnail from '../components/GarmentThumbnail';
import { colors, fonts, layout } from '../theme';
import { itemDisplayName, outfitDisplayName, CATEGORY_LABELS, CATEGORY_OPTIONS, OCCASION_OPTIONS } from '../utils/labels';

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

export default function EditOutfitScreen({ navigation, route }) {
  const { outfit } = route.params;
  const { items } = useStore();
  const [name, setName] = useState(outfit.name || '');
  const [vibe, setVibe] = useState(outfit.vibe || 'casual');
  const [pieceIds, setPieceIds] = useState(outfit.itemIds || []);
  const [saving, setSaving] = useState(false);

  // Picker sub-view: null (main form), 'category' (choosing what to add), or a category key (item grid)
  const [pickerCategory, setPickerCategory] = useState(null);
  const [replacingId, setReplacingId] = useState(null); // itemId being swapped, or null when adding new

  const pieces = pieceIds.map(id => items.find(i => i.id === id)).filter(Boolean);

  function openChangePicker(item) {
    setReplacingId(item.id);
    setPickerCategory(item.category);
  }

  function openAddPicker() {
    setReplacingId(null);
    setPickerCategory('__choose__');
  }

  function selectPickerItem(item) {
    setPieceIds(prev => {
      if (replacingId) return prev.map(id => id === replacingId ? item.id : id);
      return prev.includes(item.id) ? prev : [...prev, item.id];
    });
    setPickerCategory(null);
    setReplacingId(null);
  }

  function removePiece(id) {
    setPieceIds(prev => prev.filter(x => x !== id));
  }

  async function handleSave() {
    if (pieceIds.length === 0) {
      Alert.alert('No pieces', 'Add at least one piece.');
      return;
    }
    setSaving(true);
    try {
      await updateOutfit(outfit.id, { name: name.trim(), vibe, itemIds: pieceIds });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Save failed', 'Could not save changes. Check your connection and try again.');
      setSaving(false);
    }
  }

  function handleDelete() {
    Alert.alert('Delete outfit', `Delete "${outfitDisplayName(outfit)}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteOutfit(outfit.id);
          navigation.goBack();
        },
      },
    ]);
  }

  // ── Category chooser (for "Add a piece") ──
  if (pickerCategory === '__choose__') {
    return (
      <View style={s.container}>
        <View style={s.navbar}>
          <TouchableOpacity style={s.backCircle} onPress={() => setPickerCategory(null)}>
            <Text style={s.backChevron}>‹</Text>
          </TouchableOpacity>
          <Text style={s.navTitle}>Add a piece</Text>
        </View>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          <MonoLabel>CATEGORY</MonoLabel>
          <View style={s.chipRow}>
            {CATEGORY_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.key} style={s.chip} onPress={() => setPickerCategory(opt.key)}>
                <Text style={s.chipText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Item grid (for a specific category, either replacing or adding) ──
  if (pickerCategory) {
    const options = items.filter(i => i.category === pickerCategory);
    return (
      <View style={s.container}>
        <View style={s.navbar}>
          <TouchableOpacity style={s.backCircle} onPress={() => { setPickerCategory(null); setReplacingId(null); }}>
            <Text style={s.backChevron}>‹</Text>
          </TouchableOpacity>
          <Text style={s.navTitle}>{CATEGORY_LABELS[pickerCategory] || 'Pick item'}</Text>
        </View>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          {options.length === 0 ? (
            <View style={s.noItems}>
              <Text style={s.noItemsText}>No items in this category yet.</Text>
            </View>
          ) : (
            <View style={s.grid}>
              {options.map(item => (
                <TouchableOpacity key={item.id} style={s.gridItem} onPress={() => selectPickerItem(item)} activeOpacity={0.85}>
                  <View style={s.gridThumb}>
                    <GarmentThumbnail item={item} size={160} round={false} />
                  </View>
                  <Text style={s.gridLabel} numberOfLines={2}>{itemDisplayName(item)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ── Main edit form ──
  return (
    <View style={s.container}>
      <View style={s.navbar}>
        <TouchableOpacity style={s.backCircle} onPress={() => navigation.goBack()}>
          <Text style={s.backChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>Edit outfit</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <MonoLabel>OUTFIT NAME (OPTIONAL)</MonoLabel>
        <TextInput
          style={s.input}
          placeholder="e.g. Dinner Reservations"
          placeholderTextColor={colors.inkGhost}
          value={name}
          onChangeText={setName}
          returnKeyType="done"
        />

        <MonoLabel>OCCASION</MonoLabel>
        <ChipRow options={OCCASION_OPTIONS} value={vibe} onChange={setVibe} />

        <MonoLabel>PIECES</MonoLabel>
        <View style={{ gap: 10 }}>
          {pieces.map(item => (
            <View key={item.id} style={s.pieceRow}>
              <View style={s.pieceThumb}>
                <GarmentThumbnail item={item} size={44} round={false} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.pieceName} numberOfLines={1}>{itemDisplayName(item)}</Text>
                <Text style={s.pieceCat}>{(CATEGORY_LABELS[item.category] || item.category).toUpperCase()}</Text>
              </View>
              <TouchableOpacity style={s.changeBtn} onPress={() => openChangePicker(item)}>
                <Text style={s.changeBtnText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.removeBtn} onPress={() => removePiece(item.id)}>
                <Text style={s.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={s.addPieceRow} onPress={openAddPicker}>
            <Text style={s.addPieceText}>＋ Add a piece</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.deleteRow} onPress={handleDelete}>
          <Text style={s.deleteText}>Delete outfit</Text>
        </TouchableOpacity>
      </ScrollView>

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
  input: {
    height: 50, borderWidth: 1, borderColor: colors.lineStrong,
    borderRadius: 14, backgroundColor: colors.paperInput,
    paddingHorizontal: 16, fontFamily: fonts.sans, fontSize: 15,
    color: colors.ink,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.bg, borderWidth: 1,
    borderColor: colors.lineStrong, borderRadius: 999,
    paddingHorizontal: 15, paddingVertical: 8,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.sans600, fontSize: 13, color: colors.inkSoft },
  chipTextActive: { color: colors.white },
  pieceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 13,
    borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 10,
  },
  pieceThumb: {
    width: 44, height: 44, borderRadius: 10, overflow: 'hidden',
    backgroundColor: colors.garmentBg,
  },
  pieceName: { fontFamily: fonts.sans600, fontSize: 14, color: colors.ink },
  pieceCat: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.6, color: colors.inkGhost, marginTop: 2 },
  changeBtn: {
    borderWidth: 1.5, borderColor: colors.ink, borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  changeBtnText: { fontFamily: fonts.sans700, fontSize: 12.5, color: colors.ink },
  removeBtn: { width: 22, alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { fontSize: 13, color: colors.inkGhost },
  addPieceRow: {
    borderWidth: 1.5, borderColor: colors.lineStrong, borderStyle: 'dashed',
    borderRadius: 14, padding: 14, alignItems: 'center',
  },
  addPieceText: { fontFamily: fonts.sans600, fontSize: 13.5, color: colors.inkFaint },
  deleteRow: { alignItems: 'center', marginTop: 26 },
  deleteText: { fontFamily: fonts.sans700, fontSize: 14, color: colors.danger },
  footer: {
    padding: layout.px, paddingBottom: 34,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: '#F0EEEB',
  },
  saveBtn: {
    backgroundColor: colors.accent, borderRadius: 16,
    height: 54, alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { fontFamily: fonts.sans700, fontSize: 16, color: colors.white },
  // Item picker grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 4 },
  gridItem: { width: '47%' },
  gridThumb: {
    width: '100%', aspectRatio: 1, borderRadius: 10,
    overflow: 'hidden', backgroundColor: colors.garmentBg,
  },
  gridLabel: { fontFamily: fonts.sans600, fontSize: 14, color: colors.ink, marginTop: 9 },
  noItems: { paddingVertical: 40, alignItems: 'center' },
  noItemsText: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkFaint },
});
