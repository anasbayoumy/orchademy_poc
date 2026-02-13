/**
 * Design Tokens Configuration
 * Centralized color and font definitions for the application
 */

export const DESIGN_TOKENS = {
  colors: {
    // Primary Colors (Blue tones)
    primary: {
      1: '#304a78',  // Main primary - Headers, buttons, key elements
      2: '#2c3259',  // Secondary primary - Variations
      3: '#0b1c3d',  // Darkest - Dark backgrounds, emphasis
    },
    // Secondary Colors
    secondary: {
      1: '#57bda2',  // Teal - Success, positive actions
      2: '#2493a2',  // Dark teal - Info, secondary actions
      3: '#d4af37',  // Gold - Highlights, warnings
    },
    // Danger (kept as red for clarity)
    danger: '#ef4444',
  },
  
  fonts: {
    primary: "'Libre Baskerville', Georgia, serif",
    secondary: "'Outfit', 'Inter', system-ui, sans-serif",
  }
};

// Color utilities for light/dark themes
export const getThemeColors = (isDark: boolean) => ({
  // Primary colors
  primary1: DESIGN_TOKENS.colors.primary[1],
  primary2: DESIGN_TOKENS.colors.primary[2],
  primary3: DESIGN_TOKENS.colors.primary[3],
  
  // Secondary colors
  secondary1: DESIGN_TOKENS.colors.secondary[1],
  secondary2: DESIGN_TOKENS.colors.secondary[2],
  secondary3: DESIGN_TOKENS.colors.secondary[3],
  
  // Accent (maps to primary 1)
  accent: DESIGN_TOKENS.colors.primary[1],
  accentBg: isDark 
    ? 'rgba(48, 74, 120, 0.15)' 
    : 'rgba(48, 74, 120, 0.1)',
  accentText: isDark 
    ? '#5a7eb3' 
    : DESIGN_TOKENS.colors.primary[1],
  
  // Backgrounds
  pageBg: isDark ? DESIGN_TOKENS.colors.primary[3] : '#f8fafc',
  cardBg: isDark ? '#1a2332' : '#ffffff',
  bgPrimary: isDark ? DESIGN_TOKENS.colors.primary[3] : '#f8fafc',
  surfaceBg: isDark ? '#1a2332' : '#f8fafc',
  tableHeader: isDark ? DESIGN_TOKENS.colors.primary[3] : '#f8fafc',
  tableHover: isDark ? '#2a3647' : '#f1f5f9',
  inputBg: isDark ? '#2a3647' : '#ffffff',
  hoverBg: isDark ? '#2a3647' : '#e2e8f0',
  itemBg: isDark ? DESIGN_TOKENS.colors.primary[3] : '#f8fafc',
  modalBg: isDark ? '#1a2332' : '#ffffff',
  
  // Borders
  border: isDark ? '#2a3647' : '#e2e8f0',
  
  // Text
  textPrimary: isDark ? '#f1f5f9' : '#0f172a',
  textSecondary: isDark ? '#94a3b8' : '#64748b',
  
  // Success (maps to secondary 1 - teal)
  success: DESIGN_TOKENS.colors.secondary[1],
  successBg: isDark 
    ? 'rgba(87, 189, 162, 0.15)' 
    : 'rgba(87, 189, 162, 0.1)',
  successText: isDark 
    ? '#6fd4b4' 
    : '#2e8b6f',
  successIcon: isDark 
    ? '#6fd4b4' 
    : DESIGN_TOKENS.colors.secondary[1],
  
  // Info (maps to secondary 2 - dark teal)
  info: DESIGN_TOKENS.colors.secondary[2],
  infoBg: isDark 
    ? 'rgba(36, 147, 162, 0.15)' 
    : 'rgba(36, 147, 162, 0.1)',
  infoText: isDark 
    ? '#36b8d0' 
    : '#1a7080',
  
  // Warning (maps to secondary 3 - gold)
  warning: DESIGN_TOKENS.colors.secondary[3],
  warningBg: isDark 
    ? 'rgba(212, 175, 55, 0.15)' 
    : 'rgba(212, 175, 55, 0.1)',
  warningText: isDark 
    ? '#e6c75e' 
    : '#a8881f',
  
  // Danger (red)
  danger: DESIGN_TOKENS.colors.danger,
  dangerBg: isDark 
    ? 'rgba(239, 68, 68, 0.15)' 
    : 'rgba(239, 68, 68, 0.1)',
  dangerText: isDark 
    ? '#f87171' 
    : '#dc2626',
  dangerIcon: isDark 
    ? '#f87171' 
    : DESIGN_TOKENS.colors.danger,
  
  // Helper
  isDark,
});
