import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { allWorkouts } from "@hyrox/shared";
import { WorkoutCard } from "../../components/WorkoutCard";
import { colors } from "../../lib/theme";

const completionKey = "hyrox.mobile.completed";

export default function WorkoutsTab() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(completionKey).then((raw) => setCompleted(new Set(raw ? JSON.parse(raw) : [])));
  }, []);

  async function toggle(id: string) {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompleted(next);
    await AsyncStorage.setItem(completionKey, JSON.stringify([...next]));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Program</Text>
        <Text style={styles.title}>All workouts</Text>
        <View style={styles.list}>
          {allWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} completed={completed.has(workout.id)} onToggle={() => toggle(workout.id)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  screen: { padding: 18, gap: 14, paddingBottom: 110 },
  eyebrow: { color: colors.lime, fontWeight: "900", textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 44, fontWeight: "900" },
  list: { gap: 12 }
});

