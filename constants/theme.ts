/**
 * Paleta de la app de clima. Tonos cielo/sol para modo claro y
 * tonos noche/estrellas para modo oscuro.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0284C7'; // azul cielo
const tintColorDark = '#38BDF8'; // azul cielo claro

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#EAF4FF',
    card: '#FFFFFF',
    border: '#D7E6F5',
    tint: tintColorLight,
    accent: '#F59E0B', // ámbar sol
    icon: '#475569',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E6EDF3',
    background: '#0B1220',
    card: '#16223A',
    border: '#22304A',
    tint: tintColorDark,
    accent: '#FBBF24',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
