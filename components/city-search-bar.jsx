import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCity } from '@/contexts/city-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { searchCities } from '@/services/weather';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

export function CitySearchBar() {
  const { cityName, setCity, setCityName } = useCity();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const places = await searchCities(query);
        setResults(places);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function selectPlace(place) {
    setCity(place.query);
    setCityName([place.name, place.region].filter(Boolean).join(', '));
    setQuery('');
    setResults([]);
  }

  return (
    <ThemedView style={styles.wrapper}>
      <ThemedView style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.icon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={`Ciudad actual: ${cityName}`}
          placeholderTextColor={colors.icon}
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
          returnKeyType="search"
        />
        {loading ? <ActivityIndicator size="small" /> : null}
      </ThemedView>

      {results.length > 0 ? (
        <ThemedView style={[styles.results, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {results.map((place) => (
            <Pressable key={place.id} style={styles.resultItem} onPress={() => selectPlace(place)}>
              <Ionicons name="location-outline" size={16} color={colors.tint} />
              <ThemedText style={styles.resultText}>{place.label}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 12, paddingTop: 12, gap: 6, zIndex: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 15 },
  results: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resultText: { fontSize: 14 },
});
