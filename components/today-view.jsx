import { ThemedText } from '@/components/themed-text';
import { Colors, getConditionColors } from '@/constants/theme';
import { useCity } from '@/contexts/city-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTodayData } from '@/services/weather';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

function formatTime(lastUpdated) {
  if (!lastUpdated) return '';
  const parts = lastUpdated.split(' ');
  if (parts.length < 2) return '';
  const [h, m] = parts[1].split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${suffix}`;
}

function formatDayShort(isoDate) {
  return new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric' }).format(
    new Date(`${isoDate}T12:00:00`)
  );
}

export function TodayView() {
  const { city } = useCity();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  function load(active = { current: true }) {
    setLoading(true);
    setError(null);
    getTodayData(city)
      .then((d) => active.current && setData(d))
      .catch((e) => active.current && setError(e.message))
      .finally(() => active.current && setLoading(false));
  }

  useEffect(() => {
    const active = { current: true };
    load(active);
    return () => { active.current = false; };
  }, [city]);

  async function onRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      const d = await getTodayData(city);
      setData(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={36} color={colors.icon} />
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        <Pressable
          style={[styles.retryButton, { backgroundColor: colors.tint }]}
          onPress={() => load()}>
          <ThemedText style={styles.retryText}>Reintentar</ThemedText>
        </Pressable>
      </View>
    );
  }

  if (!data) return null;

  const { current, location, forecast } = data;
  const cond = getConditionColors(current.condition.code, current.is_day);

  const stats = [
    { icon: 'thermometer-outline', label: 'Sensación', value: `${Math.round(current.feelslike_c)}°C` },
    { icon: 'water-outline', label: 'Humedad', value: `${current.humidity}%` },
    { icon: 'speedometer-outline', label: 'Viento', value: `${current.wind_kph} km/h` },
    { icon: 'sunny-outline', label: 'Índice UV', value: `${current.uv}` },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.wrapper}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.tint]}
          tintColor={colors.tint}
        />
      }
    >
      <View style={[styles.heroCard, { backgroundColor: cond.bg }]}>
        {current.condition.icon ? (
          <Image source={current.condition.icon} style={styles.heroIcon} contentFit="contain" />
        ) : null}
        <ThemedText style={[styles.heroCity, { color: cond.text }]}>
          {location.name}
        </ThemedText>
        {location.region ? (
          <ThemedText style={[styles.heroRegion, { color: cond.text }]}>
            {location.region}
          </ThemedText>
        ) : null}
        <ThemedText style={[styles.heroTemp, { color: cond.tint }]}>
          {Math.round(current.temp_c)}°C
        </ThemedText>
        <ThemedText style={[styles.heroCondition, { color: cond.text }]}>
          {current.condition.text}
        </ThemedText>
        {current.last_updated ? (
          <ThemedText style={[styles.heroUpdated, { color: cond.text }]}>
            Actualizado: {formatTime(current.last_updated)}
          </ThemedText>
        ) : null}
      </View>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Detalles
      </ThemedText>
      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.statTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name={s.icon} size={24} color={colors.tint} />
            <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>{s.value}</ThemedText>
          </View>
        ))}
      </View>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Próximos días
      </ThemedText>
      <View style={styles.forecastStrip}>
        {forecast.map((day) => (
          <Pressable
            key={day.id}
            style={[styles.forecastCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() =>
              router.push({
                pathname: '/modal',
                params: {
                  title: day.title,
                  subtitle: day.condition.text,
                  icon: day.condition.icon,
                  temp: `${Math.round(day.maxtemp_c)}° / ${Math.round(day.mintemp_c)}°`,
                  details: JSON.stringify(day.details),
                },
              })
            }>
            <ThemedText style={styles.forecastDay}>{formatDayShort(day.id)}</ThemedText>
            {day.condition.icon ? (
              <Image source={day.condition.icon} style={styles.forecastIcon} contentFit="contain" />
            ) : (
              <Ionicons name="partly-sunny-outline" size={28} color={colors.tint} />
            )}
            <ThemedText type="defaultSemiBold" style={{ color: colors.accent, fontSize: 13 }}>
              {Math.round(day.maxtemp_c)}°
            </ThemedText>
            <ThemedText style={[styles.forecastMin, { color: colors.icon }]}>
              {Math.round(day.mintemp_c)}°
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 12, paddingBottom: 24, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 40 },
  errorText: { textAlign: 'center', opacity: 0.7 },
  retryButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '600' },

  heroCard: {
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  heroIcon: { width: 100, height: 100, marginBottom: 4 },
  heroCity: { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  heroRegion: { fontSize: 14, opacity: 0.7, textAlign: 'center' },
  heroTemp: { fontSize: 52, fontWeight: '800', marginTop: 8, lineHeight: 60 },
  heroCondition: { fontSize: 18, fontWeight: '500', opacity: 0.85 },
  heroUpdated: { fontSize: 12, opacity: 0.5, marginTop: 6 },

  sectionTitle: { marginTop: 4, marginLeft: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statTile: {
    flex: 1,
    minWidth: '44%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statLabel: { fontSize: 12, opacity: 0.65, textAlign: 'center' },
  statValue: { fontSize: 18, textAlign: 'center' },

  forecastStrip: { flexDirection: 'row', gap: 10 },
  forecastCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  forecastDay: { fontSize: 12, textAlign: 'center', opacity: 0.7 },
  forecastIcon: { width: 36, height: 36 },
  forecastMin: { fontSize: 13 },
});
