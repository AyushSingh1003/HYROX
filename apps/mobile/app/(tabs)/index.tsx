import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { daysUntilRace, getTodaysWorkout, phaseProgress } from "@hyrox/shared";
import { WorkoutCard } from "../../components/WorkoutCard";
import { colors, radii } from "../../lib/theme";

const completionKey = "hyrox.mobile.completed";

export default function HomeTab() {
  const workout = getTodaysWorkout();
  const [completed, setCompleted] = useState(false);
  const [seconds, setSeconds] = useState(600);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(completionKey).then((raw) => {
      const ids: string[] = raw ? JSON.parse(raw) : [];
      setCompleted(ids.includes(workout.id));
    });
  }, [workout.id]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  async function toggleComplete() {
    const raw = await AsyncStorage.getItem(completionKey);
    const ids = new Set<string>(raw ? JSON.parse(raw) : []);
    if (ids.has(workout.id)) ids.delete(workout.id);
    else ids.add(workout.id);
    await AsyncStorage.setItem(completionKey, JSON.stringify([...ids]));
    setCompleted(ids.has(workout.id));
  }

  const time = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Race countdown</Text>
        <Text style={styles.title}>{daysUntilRace()} days</Text>

        <View style={styles.metrics}>
          <View style={styles.metric}><Text style={styles.metricValue}>{phaseProgress()}%</Text><Text style={styles.muted}>Progress</Text></View>
          <View style={styles.metric}><Text style={styles.metricValue}>82</Text><Text style={styles.muted}>Readiness</Text></View>
        </View>

        <WorkoutCard workout={workout} completed={completed} onToggle={toggleComplete} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Timer</Text>
          <Text style={styles.timer}>{time}</Text>
          <View style={styles.row}>
            <Pressable style={styles.primary} onPress={() => setRunning((value) => !value)}>
              <Text style={styles.primaryText}>{running ? "Pause" : "Start"}</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={() => setSeconds(600)}>
              <Text style={styles.secondaryText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  screen: { padding: 18, gap: 16, paddingBottom: 110 },
  eyebrow: { color: colors.lime, fontWeight: "900", textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 52, fontWeight: "900" },
  muted: { color: colors.muted },
  metrics: { flexDirection: "row", gap: 12 },
  metric: { flex: 1, backgroundColor: colors.panel, borderRadius: radii.card, borderWidth: 1, borderColor: colors.line, padding: 16 },
  metricValue: { color: colors.text, fontSize: 34, fontWeight: "900" },
  card: { backgroundColor: colors.panel, borderRadius: radii.card, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 14 },
  cardTitle: { color: colors.text, fontSize: 24, fontWeight: "900" },
  timer: { color: colors.text, fontSize: 68, fontWeight: "900", textAlign: "center" },
  row: { flexDirection: "row", gap: 10 },
  primary: { flex: 1, minHeight: 48, borderRadius: radii.card, backgroundColor: colors.lime, alignItems: "center", justifyContent: "center" },
  primaryText: { color: colors.bg, fontWeight: "900" },
  secondary: { flex: 1, minHeight: 48, borderRadius: radii.card, borderColor: colors.line, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: colors.text, fontWeight: "900" }
});

