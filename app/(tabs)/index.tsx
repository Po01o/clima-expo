import { CitySearchBar } from '@/components/city-search-bar';
import { TodayView } from '@/components/today-view';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, StyleSheet } from 'react-native';

export default function TodayScreen() {
  return (
    <ThemedView style={styles.container}>
      <CitySearchBar />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TodayView />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 12 },
});
