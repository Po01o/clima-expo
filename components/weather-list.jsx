import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getWeather } from '@/services/weather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';

export function WeatherList({ view }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getWeather(view)
      .then((data) => active && setItems(data))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [view]);

  async function onRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getWeather(view);
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  if (items.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No hay datos para mostrar.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={items}
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
          <ThemedView style={styles.card}>
            <ThemedView style={styles.row}>
              {item.icon ? (
                <Image source={item.icon} style={styles.icon} contentFit="contain" />
              ) : null}
              <ThemedView style={styles.texts}>
                <ThemedText type="subtitle" style={styles.title}>
                  {item.title}
                </ThemedText>
                {item.subtitle ? <ThemedText>{item.subtitle}</ThemedText> : null}
              </ThemedView>
              {item.temp ? <ThemedText type="title">{item.temp}</ThemedText> : null}
            </ThemedView>
          </ThemedView>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 16 },
  card: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 48, height: 48 },
  texts: { flex: 1, gap: 2 },
  title: { marginTop: 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
