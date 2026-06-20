import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useCity } from '@/contexts/city-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getWeather } from '@/services/weather';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';

export function WeatherList({ view }) {
  const { city } = useCity();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getWeather(view, city)
      .then((data) => active && setItems(data))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [view, city]);

  async function onRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getWeather(view, city);
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  }

  // Filtra los resultados ya consultados a la API por título o condición.
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => {
      const haystack = `${item.title} ${item.subtitle ?? ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [items, search]);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={32} color={colors.icon} />
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        <Pressable
          style={[styles.retryButton, { backgroundColor: colors.tint }]}
          onPress={onRefresh}>
          <ThemedText style={styles.retryText}>Reintentar</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="filter-outline" size={18} color={colors.icon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={
            view === 'horas'
              ? 'Filtrar por hora o condición...'
              : view === 'astronomia'
              ? 'Filtrar días...'
              : 'Filtrar días...'
          }
          placeholderTextColor={colors.icon}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {search.length > 0 ? (
          <Pressable onPress={() => setSearch('')} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={colors.icon} />
          </Pressable>
        ) : null}
        <Pressable onPress={onRefresh} hitSlop={10}>
          <Ionicons name="refresh-outline" size={20} color={colors.tint} />
        </Pressable>
      </ThemedView>

      {items.length === 0 ? (
        <ThemedView style={styles.center}>
          <ThemedText>No hay datos para mostrar.</ThemedText>
        </ThemedView>
      ) : filteredItems.length === 0 ? (
        <ThemedView style={styles.center}>
          <ThemedText>No hay resultados para &quot;{search}&quot;.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) => item.id ?? String(index)}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/modal',
                  params: {
                    title: item.title,
                    subtitle: item.subtitle ?? '',
                    icon: item.icon ?? '',
                    temp: item.temp ?? '',
                    details: JSON.stringify(item.details ?? []),
                  },
                })
              }>
              <ThemedView
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}>
                <ThemedView style={styles.row}>
                  {item.icon ? (
                    <Image source={item.icon} style={styles.icon} contentFit="contain" />
                  ) : (
                    <Ionicons name="moon-outline" size={32} color={colors.tint} />
                  )}
                  <ThemedView style={styles.texts}>
                    <ThemedText type="subtitle" numberOfLines={1} style={styles.title}>
                      {item.title}
                    </ThemedText>
                    {item.subtitle ? (
                      <ThemedText numberOfLines={1} style={{ opacity: 0.75 }}>
                        {item.subtitle}
                      </ThemedText>
                    ) : null}
                  </ThemedView>
                  {item.temp ? (
                    <ThemedText type="defaultSemiBold" style={{ color: colors.accent, fontSize: 18 }}>
                      {item.temp}
                    </ThemedText>
                  ) : null}
                  <Ionicons name="chevron-forward" size={18} color={colors.icon} />
                </ThemedView>
              </ThemedView>
            </Pressable>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  list: { padding: 12, gap: 12 },
  card: {
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 42, height: 42 },
  texts: { flex: 1, gap: 2 },
  title: { marginTop: 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, padding: 20 },
  errorText: { textAlign: 'center' },
  retryButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '600' },
});
