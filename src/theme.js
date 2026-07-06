// Design tokens — warm editorial aesthetic from Divya's Closet design

export const colors = {
  // Surfaces
  bg:           '#FFFFFF',
  bgScreen:     '#FFFFFF',
  paper:        '#F6F5F3',     // stat card bg
  paperBorder:  '#EDEBE8',     // stat card border
  paperSunk:    '#F3F1EE',     // back button, input bg
  paperRaised:  '#FBFAF9',     // raised card bg
  paperInput:   '#FBFAF9',     // text input bg

  // Ink
  ink:          '#0A0A0A',     // primary text / headings
  inkSoft:      '#6E6A64',     // secondary text
  inkFaint:     '#8A867F',     // tertiary / meta
  inkGhost:     '#A29E96',     // Space Mono labels / placeholders

  // Lines
  line:         '#E9E7E3',     // card borders
  lineStrong:   '#E4E2DE',     // chip inactive borders

  // Garment placeholder
  garmentBg:    '#EEEDEA',     // thumbnail background

  // Accents
  accent:       '#C25E78',     // progress / step indicator
  accentSoft:   '#FCEEF0',     // pink card bg (add item)
  accentBorder: '#F2D3DA',     // pink card border
  oxblood:      '#6E2433',     // create outfit card bg

  // Semantic
  danger:       '#A8392B',
  white:        '#FFFFFF',
  black:        '#0A0A0A',
};

export const fonts = {
  // font family names as registered by expo-google-fonts
  serif:  'InstrumentSerif_400Regular',
  sans:   'HankenGrotesk_400Regular',
  sans600: 'HankenGrotesk_600SemiBold',
  sans700: 'HankenGrotesk_700Bold',
  sans800: 'HankenGrotesk_800ExtraBold',
  mono:   'SpaceMono_400Regular',
  mono700: 'SpaceMono_700Bold',
};

export const layout = {
  px: 22,          // horizontal page padding
  cardRadius: 18,
  chipRadius: 999,
  cardPad: 16,
  statRadius: 14,
  inputRadius: 14,
  cardShadow: {
    shadowColor: '#0A0A0A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardShadowSm: {
    shadowColor: '#0A0A0A',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
};
