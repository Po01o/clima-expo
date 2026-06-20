import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

function detailIcon(label: string): keyof typeof Ionicons.glyphMap {
  const l = label.toLowerCase();
  if (l.includes('temp') || l.includes('°') || l.includes('sensac')) return 'thermometer-outline';
  if (l.includes('humedad') || l.includes('lluvia') || l.includes('precipit')) return 'water-outline';
  if (l.includes('viento') || l.includes('ráfaga')) return 'speedometer-outline';
  if (l.includes('uv') || l.includes('índice uv')) return 'sunny-outline';
  if (l.includes('salida') || l.includes('amanecer')) return 'partly-sunny-outline';
  if (l.includes('puesta') || l.includes('ocaso')) return 'cloudy-night-outline';
  if (l.includes('luna') || l.includes('moon')) return 'moon-outline';
  if (l.includes('nieve') || l.includes('granizo')) return 'snow-outline';
  return 'information-circle-outline';
}

export default function ModalScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { title, subtitle, icon, temp, details } = useLocalSearchParams<{
    title: string;
    subtitle: string;
    icon: string;
    temp: string;
    details: string;
  }>();

  const parsedDetails: { label: string; value: string }[] = details
    ? JSON.parse(details)
    : [];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: title || 'Detalle' }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={[styles.hero, { backgroundColor: colors.tint + '18' }]}>
          {icon ? (
            <Image source={icon} style={styles.heroIcon} contentFit="contain" />
          ) : (
            <Ionicons name="partly-sunny-outline" size={100} color={colors.tint} />
          )}
          {temp ? (
            <ThemedText style={[styles.heroTemp, { color: colors.accent }]}>
              {temp}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.titleSection}>
          <ThemedText type="title" style={styles.titleText}>{title}</ThemedText>
          {subtitle ? (
            <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
              {subtitle}
            </ThemedText>
          ) : null}
        </View>

        {parsedDetails.length > 0 && (
          <View
            style={[
              styles.detailsCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            {parsedDetails.map((d, index) => (
              <View
                key={d.label}
                style={[
                  styles.detailRow,
                  { borderBottomColor: colors.border },
                  index % 2 === 0 ? { backgroundColor: colors.background + 'CC' } : null,
                  index === parsedDetails.length - 1
                    ? { borderBottomWidth: 0 }
                    : null,
                ]}>
                <View style={styles.detailLeft}>
                  <Ionicons
                    name={detailIcon(d.label)}
                    size={18}
                    color={colors.tint}
                  />
                  <ThemedText style={[styles.detailLabel, { color: colors.icon }]}>
                    {d.label}
                  </ThemedText>
                </View>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {d.value}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 32 },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 8,
  },
  heroIcon: { width: 120, height: 120 },
  heroTemp: { fontSize: 48, fontWeight: '800', lineHeight: 56 },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 6,
    alignItems: 'center',
  },
  titleText: { textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center' },
  detailsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 15 },
});
