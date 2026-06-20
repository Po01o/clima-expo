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
  View,
} from 'react-native';

const VIEW_META = {
  pronostico: {
    icon: 'calendar-outline',
    title: 'Pronóstico de 5 días',
    subtitle: 'Consulta el clima de los próximos días',
  },
  horas: {
    icon: 'time-outline',
    title: 'Por hora',
    subtitle: 'Clima hora por hora del día de hoy',
  },
  astronomia: {
    icon: 'moon-outline',
    title: 'Astronomía',
    subtitle: 'Datos de sol y luna por día',
  },
};

export function WeatherList({ view }) {
  const { city } = useCity();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const meta = VIEW_META[view] ?? VIEW_META.pronostico;

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
        <ThemedText style={{ opacity: 0.6 }}>
          Cargando {meta.title.toLowerCase()}...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.icon} />
        <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>
          Sin conexión
        </ThemedText>
        <ThemedText style={[styles.errorText, { opacity: 0.6 }]}>{error}</ThemedText>
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
      <View
        style={[
          styles.viewHeader,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}>
        <View style={[styles.iconBadge, { backgroundColor: colors.tint + '20' }]}>
          <Ionicons name={meta.icon} size={26} color={colors.tint} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            {meta.title}
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            {meta.subtitle}
          </ThemedText>
        </View>
      </View>

      <ThemedView
        style={[
          styles.searchRow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}>
        <Ionicons name="search-outline" size={18} color={colors.icon} />
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
          <Ionicons
            name={meta.icon}
            size={48}
            color={colors.icon}
            style={{ opacity: 0.35 }}
          />
          <ThemedText style={{ opacity: 0.6, textAlign: 'center' }}>
            No hay datos disponibles.
          </ThemedText>
        </ThemedView>
      ) : filteredItems.length === 0 ? (
        <ThemedView style={styles.center}>
          <Ionicons
            name="search-outline"
            size={40}
            color={colors.icon}
            style={{ opacity: 0.35 }}
          />
          <ThemedText style={{ opacity: 0.6, textAlign: 'center' }}>
            Sin resultados para &quot;{search}&quot;
          </ThemedText>
          <Pressable onPress={() => setSearch('')} hitSlop={10}>
            <ThemedText style={{ color: colors.tint }}>Limpiar búsqueda</ThemedText>
          </Pressable>
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
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderLeftColor: colors.tint,
                  },
                ]}>
                <View style={styles.row}>
                  {item.icon ? (
                    <Image source={item.icon} style={styles.icon} contentFit="contain" />
                  ) : (
                    <View
                      style={[
                        styles.iconFallback,
                        { backgroundColor: colors.tint + '15' },
                      ]}>
                      <Ionicons name="moon-outline" size={24} color={colors.tint} />
                    </View>
                  )}
                  <View style={styles.texts}>
                    <ThemedText
                      type="defaultSemiBold"
                      numberOfLines={1}
                      style={styles.itemTitle}>
                      {item.title}
                    </ThemedText>
                    {item.subtitle ? (
                      <ThemedText
                        numberOfLines={1}
                        style={{ opacity: 0.6, fontSize: 13 }}>
                        {item.subtitle}
                      </ThemedText>
                    ) : null}
                  </View>
                  {item.temp ? (
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: colors.accent, fontSize: 18 }}>
                      {item.temp}
                    </ThemedText>
                  ) : null}
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.icon}
                    style={{ opacity: 0.5 }}
                  />
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 16 },
  headerSubtitle: { fontSize: 12, opacity: 0.7, marginTop: 1 },
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
  list: { padding: 12, gap: 10 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44 },
  iconFallback: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texts: { flex: 1, gap: 3 },
  itemTitle: { fontSize: 15 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  errorText: { textAlign: 'center', fontSize: 13 },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
