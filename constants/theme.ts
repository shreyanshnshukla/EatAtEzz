// EatAtEzz Design System
// Aesthetic: Street food warmth meets clean digital UI
// Dark base with warm saffron/turmeric accents — rooted in Lucknow's food culture

export const Colors = {
  // Base
  bg: '#0D0D0D',           // deep black
  surface: '#1A1A1A',      // card background
  surfaceHigh: '#242424',  // elevated surface

  // Accent — turmeric saffron
  primary: '#F5A623',      // warm saffron
  primaryLight: '#FFB84D', // lighter saffron
  primaryDark: '#C4811A',  // deep turmeric

  // Secondary — chili red
  secondary: '#E03B2F',    // chili red for vendor
  secondaryLight: '#FF5A4D',

  // Foodie green
  foodie: '#2ECC71',       // fresh herb green
  foodieLight: '#52D98A',

  // Text
  textPrimary: '#F5F5F5',
  textSecondary: '#A0A0A0',
  textMuted: '#606060',

  // UI
  border: '#2A2A2A',
  overlay: 'rgba(0,0,0,0.6)',
  white: '#FFFFFF',
};

export const Typography = {
  // Display — bold, street-food energy
  displayXL: { fontSize: 42, fontWeight: '800' as const, letterSpacing: -1 },
  displayL: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
  displayM: { fontSize: 26, fontWeight: '700' as const },

  // Body
  bodyL: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  bodyM: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyS: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },

  // UI
  labelL: { fontSize: 16, fontWeight: '600' as const },
  labelM: { fontSize: 14, fontWeight: '600' as const },
  labelS: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5 },
  caption: { fontSize: 11, fontWeight: '400' as const, letterSpacing: 0.3 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};
