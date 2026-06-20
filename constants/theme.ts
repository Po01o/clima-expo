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

export function getConditionColors(code: number, isDay: number) {
  if (code === 1000 && isDay === 0) {
    return { bg: '#1E293B', tint: '#818CF8', text: '#E2E8F0' };
  }
  if (code === 1000) {
    return { bg: '#FEF9C3', tint: '#D97706', text: '#78350F' };
  }
  if (code === 1003 || code === 1006) {
    return { bg: '#E0F2FE', tint: '#0284C7', text: '#0C4A6E' };
  }
  if (code === 1009) {
    return { bg: '#E2E8F0', tint: '#64748B', text: '#1E293B' };
  }
  if (code === 1030 || code === 1135 || code === 1147) {
    return { bg: '#F1F5F9', tint: '#94A3B8', text: '#334155' };
  }
  if (code === 1087 || (code >= 1273 && code <= 1282)) {
    return { bg: '#EDE9FE', tint: '#6D28D9', text: '#2E1065' };
  }
  if (code === 1066 || (code >= 1204 && code <= 1264)) {
    return { bg: '#F0F9FF', tint: '#0EA5E9', text: '#0C4A6E' };
  }
  if (code >= 1150 && code <= 1201) {
    return { bg: '#DBEAFE', tint: '#1D4ED8', text: '#1E3A8A' };
  }
  if (isDay === 0) {
    return { bg: '#1E293B', tint: '#38BDF8', text: '#E2E8F0' };
  }
  return { bg: '#E0F2FE', tint: '#0284C7', text: '#0C4A6E' };
}

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
