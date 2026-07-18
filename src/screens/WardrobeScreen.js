import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useStore, deleteItem } from '../data/store';
import GarmentThumbnail from '../components/GarmentThumbnail';
import Icon from '../components/Icon';
import { colors, fonts, layout } from '../theme';
import { itemDisplayName, CATEGORY_LABELS, occasionDisplay } from '../utils/labels';

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'top', label: 'Tops' },
  { key: 'bottom', label: 'Trousers' },
  { key: 'skirt', label: 'Skirts' },
  { key: 'dress', label: 'Dresses' },
  { key: 'shoes', label: 'Footwear' },
  { key: 'bag', label: 'Bags' },
  { key: 'accessory', label: 'Accessories' },
  { key: 'outerwear', label: 'Outerwear' },
];

function ItemCard({ item, onPress, onDelete }) {
  return (
    <TouchableOpacity
      style={s.itemCard}
      onPress={() => onPress(item)}
      onLongPress={() =>
        Alert.alert('Remove item', `Delete "${itemDisplayName(item)}"?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
        ])
      }
      activeOpacity={0.88}
    >
      <View style={s.thumbWrap}>
        <GarmentThumbnail item={item} size={160} round={false} />
      </View>
      <View style={s.itemInfo}>
        <Text style={s.itemLabel} numberOfLines={2}>{itemDisplayName(item)}</Text>
        <Text style={s.itemOccasion} numberOfLines={1}>{occasionDisplay(item.occasion).toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ItemPreviewModal({ item, onClose, onEdit, onDelete }) {
  return (
    <Modal visible={!!item} animationType="fade" transparent onRequestClose={onClose}>
      <View style={s.modalBackdrop}>
        <TouchableOpacity style={s.modalBackdropTouch} activeOpacity={1} onPress={onClose} />
        {item && (
          <View style={s.modalCard}>
            <TouchableOpacity style={s.modalClose} onPress={onClose}>
              <Text style={s.modalCloseTxt}>✕</Text>
            </TouchableOpacity>
            <View style={s.modalThumbWrap}>
              <GarmentThumbnail item={item} size={220} round={false} />
            </View>
            <Text style={s.modalName}>{itemDisplayName(item)}</Text>
            <View style={s.modalDetailRow}>
              <Text style={s.modalDetailLabel}>CATEGORY</Text>
              <Text style={s.modalDetailValue}>{CATEGORY_LABELS[item.category] || item.category}</Text>
            </View>
            <View style={s.modalDetailRow}>
              <Text style={s.modalDetailLabel}>OCCASION</Text>
              <Text style={s.modalDetailValue}>{occasionDisplay(item.occasion)}</Text>
            </View>
            <View style={s.modalActions}>
              <TouchableOpacity style={s.modalEditBtn} onPress={() => onEdit(item)}>
                <Text style={s.modalEditBtnText}>Edit item</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.modalDeleteBtn}
                onPress={() =>
                  Alert.alert('Remove item', `Delete "${itemDisplayName(item)}"?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
                  ])
                }
              >
                <Text style={s.modalDeleteBtnText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

export default function WardrobeScreen({ navigation }) {
  const { items } = useStore();
  const [selectedCat, setSelectedCat] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);

  const filtered = selectedCat === 'all'
    ? items
    : items.filter(i => i.category === selectedCat);

  const visibleCats = CATS.filter(c =>
    c.key === 'all' || items.some(i => i.category === c.key)
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.heading}>Wardrobe</Text>
          <Text style={s.subMono}>{items.length} PIECES</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => navigation.navigate('Add')}>
          <Icon name="plus" size={15} color={colors.white} strokeWidth={2.2} />
          <Text style={s.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={s.filterBar} contentContainerStyle={s.filterContent}
      >
        {visibleCats.map(cat => {
          const active = selectedCat === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[s.chip, active && s.chipActive]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Text style={[s.chipText, active && s.chipTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grid */}
      <ScrollView style={s.grid} contentContainerStyle={s.gridContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyTitle}>Nothing here yet</Text>
            <Text style={s.emptyHint}>Long-press any item to remove it.</Text>
          </View>
        ) : (
          <View style={s.gridRow}>
            {filtered.map(item => (
              <ItemCard key={item.id} item={item} onPress={setPreviewItem} onDelete={deleteItem} />
            ))}
          </View>
        )}
      </ScrollView>

      <ItemPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onEdit={(item) => { setPreviewItem(null); navigation.navigate('EditItem', { item }); }}
        onDelete={(id) => { setPreviewItem(null); deleteItem(id); }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 16,
  },
  heading: {
    fontFamily: fonts.sans800, fontSize: 33,
    letterSpacing: -1, color: colors.ink, lineHeight: 34,
  },
  subMono: {
    fontFamily: fonts.mono, fontSize: 11,
    letterSpacing: 0.9, color: colors.inkFaint, marginTop: 8,
  },
  addBtn: {
    backgroundColor: colors.ink, borderRadius: 999,
    paddingHorizontal: 18, paddingVertical: 10, marginTop: 4,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  addBtnText: { fontFamily: fonts.sans700, fontSize: 13.5, color: colors.white },
  filterBar: { maxHeight: 52 },
  filterContent: { paddingHorizontal: layout.px, gap: 8, alignItems: 'center' },
  chip: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.lineStrong,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.sans600, fontSize: 13, color: colors.inkSoft },
  chipTextActive: { color: colors.white },
  grid: { flex: 1 },
  gridContent: { padding: layout.px, paddingTop: 16, paddingBottom: 110 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  itemCard: { width: '47%' },
  thumbWrap: {
    width: '100%', aspectRatio: 1,
    borderRadius: 14, overflow: 'hidden',
    backgroundColor: colors.garmentBg,
  },
  itemInfo: { marginTop: 9 },
  itemLabel: {
    fontFamily: fonts.sans600, fontSize: 14,
    letterSpacing: -0.1, color: colors.ink,
  },
  itemOccasion: {
    fontFamily: fonts.mono, fontSize: 9.5,
    letterSpacing: 0.6, color: colors.inkGhost, marginTop: 3,
  },
  empty: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontFamily: fonts.sans700, fontSize: 17, color: colors.inkFaint },
  emptyHint: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkGhost, marginTop: 6 },
  // Preview modal
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(10,10,10,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: layout.px,
  },
  modalBackdropTouch: { ...StyleSheet.absoluteFillObject },
  modalCard: {
    width: '100%', maxWidth: 360, backgroundColor: colors.bg,
    borderRadius: 22, padding: 20, alignItems: 'center',
    ...layout.cardShadow,
  },
  modalClose: {
    position: 'absolute', top: 14, right: 14, zIndex: 1,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.paperSunk, alignItems: 'center', justifyContent: 'center',
  },
  modalCloseTxt: { fontSize: 13, color: colors.ink },
  modalThumbWrap: {
    width: 220, height: 220, borderRadius: 16,
    overflow: 'hidden', backgroundColor: colors.garmentBg, marginTop: 8,
  },
  modalName: {
    fontFamily: fonts.sans800, fontSize: 20, letterSpacing: -0.4,
    color: colors.ink, marginTop: 18, textAlign: 'center',
  },
  modalDetailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    width: '100%', paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: colors.line, marginTop: 10,
  },
  modalDetailLabel: {
    fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1,
    color: colors.inkGhost,
  },
  modalDetailValue: {
    fontFamily: fonts.sans600, fontSize: 13.5, color: colors.ink,
  },
  modalActions: {
    flexDirection: 'row', gap: 10, width: '100%', marginTop: 18,
  },
  modalEditBtn: {
    flex: 1, backgroundColor: colors.ink, borderRadius: 16,
    height: 50, alignItems: 'center', justifyContent: 'center',
  },
  modalEditBtnText: { fontFamily: fonts.sans700, fontSize: 15, color: colors.white },
  modalDeleteBtn: {
    width: 50, height: 50, borderRadius: 16,
    borderWidth: 1.5, borderColor: colors.lineStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  modalDeleteBtnText: { fontSize: 17 },
});
