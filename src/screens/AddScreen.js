import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, layout } from '../theme';

export default function AddScreen({ navigation }) {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.heading}>Add</Text>
        <Text style={s.subMono}>WHAT ARE YOU ADDING?</Text>
      </View>

      {/* Add clothing item — blush card */}
      <TouchableOpacity
        style={s.pinkCard}
        onPress={() => navigation.navigate('AddItem')}
        activeOpacity={0.88}
      >
        <View style={s.pinkIcon}>
          <Text style={{ fontSize: 24 }}>📷</Text>
        </View>
        <Text style={s.pinkTitle}>Add clothing item</Text>
        <Text style={s.pinkDesc}>Photo your piece and save it to your wardrobe</Text>
        <View style={s.startRow}>
          <Text style={s.startText}>Start</Text>
          <Text style={s.startArrow}>→</Text>
        </View>
      </TouchableOpacity>

      {/* Create outfit — oxblood card */}
      <TouchableOpacity
        style={s.darkCard}
        onPress={() => navigation.navigate('CreateOutfit')}
        activeOpacity={0.88}
      >
        <View style={s.darkIcon}>
          <Text style={{ fontSize: 24 }}>✨</Text>
        </View>
        <Text style={s.darkTitle}>Create outfit</Text>
        <Text style={s.darkDesc}>Combine saved items into an outfit</Text>
        <View style={s.startRow}>
          <Text style={s.startTextGold}>Start</Text>
          <Text style={s.startArrowGold}>→</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: layout.px },
  header: { paddingTop: 64, paddingBottom: 20 },
  heading: {
    fontFamily: fonts.sans800, fontSize: 33,
    letterSpacing: -1, color: colors.ink,
  },
  subMono: {
    fontFamily: fonts.mono, fontSize: 11,
    letterSpacing: 1, color: colors.inkFaint, marginTop: 8,
  },
  pinkCard: {
    backgroundColor: '#FCEEF0',
    borderWidth: 1, borderColor: '#F2D3DA',
    borderRadius: 22, padding: 24, marginBottom: 16,
    shadowColor: '#C25E78', shadowOpacity: 0.18,
    shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 3,
  },
  pinkIcon: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: '#C25E78', alignItems: 'center', justifyContent: 'center',
    marginBottom: 18,
  },
  pinkTitle: {
    fontFamily: fonts.sans800, fontSize: 21, letterSpacing: -0.4,
    color: '#3A222A', marginBottom: 6,
  },
  pinkDesc: {
    fontFamily: fonts.sans, fontSize: 14, color: '#A5748A', lineHeight: 20,
  },
  darkCard: {
    backgroundColor: colors.oxblood,
    borderRadius: 22, padding: 24,
    shadowColor: colors.oxblood, shadowOpacity: 0.45,
    shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 6,
  },
  darkIcon: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  darkTitle: {
    fontFamily: fonts.sans800, fontSize: 21, letterSpacing: -0.4,
    color: colors.white, marginBottom: 6,
  },
  darkDesc: {
    fontFamily: fonts.sans, fontSize: 14,
    color: 'rgba(245,239,227,0.66)', lineHeight: 20,
  },
  startRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  startText: { fontFamily: fonts.sans700, fontSize: 13, color: '#C25E78' },
  startArrow: { fontSize: 13, color: '#C25E78' },
  startTextGold: { fontFamily: fonts.sans700, fontSize: 13, color: '#F0C56B' },
  startArrowGold: { fontSize: 13, color: '#F0C56B' },
});
