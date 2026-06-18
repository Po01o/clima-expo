import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
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
      {icon ? <Image source={icon} style={styles.icon} contentFit="contain" /> : null}
      <ThemedText type="title">{title}</ThemedText>
      {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
      {temp ? <ThemedText type="title" style={styles.temp}>{temp}</ThemedText> : null}

      <ThemedView style={styles.detailsBox}>
        {parsedDetails.map((d) => (
          <ThemedView key={d.label} style={styles.detailRow}>
            <ThemedText style={styles.label}>{d.label}</ThemedText>
            <ThemedText type="defaultSemiBold">{d.value}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10, alignItems: 'center' },
  icon: { width: 96, height: 96, marginTop: 10 },
  subtitle: { fontSize: 16, opacity: 0.8 },
  temp: { fontSize: 40, marginVertical: 6 },
  detailsBox: { width: '100%', marginTop: 20, gap: 14 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#888',
  },
  label: { opacity: 0.7 },
});
