import { CitySearchBar } from '@/components/city-search-bar';
import { ThemedView } from '@/components/themed-view';
import { WeatherList } from '@/components/weather-list';
import { StyleSheet } from 'react-native';

export default function TodayScreen() {
  return (
    <ThemedView style={styles.container}>
      <CitySearchBar />
      <WeatherList view="hoy" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
