export const colors = {
  bg: '#F8F8F8',
  white: '#FFFFFF',
  black: '#000000',
  textPrimary: '#000000',
  textSecondary: '#888888',
  textTertiary: '#BBBBBB',
  cardBg: '#FFFFFF',
  chipBg: '#000000',
  chipText: '#FFFFFF',
  chipOutlineBg: '#F0F0F0',
  chipOutlineText: '#333333',
  border: '#EEEEEE',
  highlight: '#F0F0F0',
  today: '#000000',
  danger: '#FF3B30',
};

export const fonts = {
  heading: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  body: { fontSize: 15, color: colors.textPrimary },
  bodySmall: { fontSize: 13, color: colors.textSecondary },
  stat: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
};

export const layout = {
  px: 20,
  cardRadius: 16,
  chipRadius: 24,
  cardPad: 16,
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};
