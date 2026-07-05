import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, layout } from '../theme';

export default function AddScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Add</Text>
        <Text style={styles.subheading}>What would you like to add?</Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate('AddItem')}
          activeOpacity={0.85}
        >
          <Text style={styles.optionIcon}>👗</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Add clothing item</Text>
            <Text style={styles.optionDesc}>Add a top, trouser, skirt, shoes, or accessory to your wardrobe</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.optionCardDark]}
          onPress={() => navigation.navigate('CreateOutfit')}
          activeOpacity={0.85}
        >
          <Text style={styles.optionIcon}>✨</Text>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, styles.optionTitleLight]}>Create outfit</Text>
            <Text style={[styles.optionDesc, styles.optionDescLight]}>
              Combine items into a saved outfit combination
            </Text>
          </View>
          <Text style={[styles.arrow, styles.arrowLight]}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: layout.px, paddingTop: 64, paddingBottom: 32 },
  heading: { ...fonts.heading },
  subheading: { ...fonts.subtitle, marginTop: 4 },
  options: { paddingHorizontal: layout.px, gap: 16 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBg, borderRadius: layout.cardRadius,
    padding: 20, ...layout.cardShadow,
  },
  optionCardDark: { backgroundColor: colors.black },
  optionIcon: { fontSize: 32, marginRight: 16 },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  optionTitleLight: { color: colors.white },
  optionDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  optionDescLight: { color: 'rgba(255,255,255,0.65)' },
  arrow: { fontSize: 22, color: colors.textTertiary, marginLeft: 8 },
  arrowLight: { color: 'rgba(255,255,255,0.4)' },
});
