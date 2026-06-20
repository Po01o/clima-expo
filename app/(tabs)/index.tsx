import { CitySearchBar } from '@/components/city-search-bar';
import { TodayView } from '@/components/today-view';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function TodayScreen() {
  return (
    <ThemedView style={styles.container}>
      <CitySearchBar />
      <TodayView />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
