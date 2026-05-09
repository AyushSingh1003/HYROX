import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { trainingWeeks } from "@hyrox/shared";
import { colors, radii } from "../../lib/theme";

export default function CalendarTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Calendar</Text>
        <Text style={styles.title}>Race build</Text>
        {trainingWeeks.map((week) => (
          <View style={styles.card} key={week.week}>
            <Text style={styles.week}>Week {week.week}</Text>
            <Text style={styles.phase}>{week.phaseTitle}</Text>
            {week.workouts.map((workout) => (
              <View style={styles.row} key={workout.id}>
                <Text style={styles.day}>{workout.day.slice(0, 3)}</Text>
                <Text style={styles.workout}>{workout.title}</Text>
                <Text style={styles.minutes}>{workout.durationMinutes}m</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  screen: { padding: 18, gap: 14, paddingBottom: 110 },
  eyebrow: { color: colors.lime, fontWeight: "900", textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 44, fontWeight: "900" },
  card: { backgroundColor: colors.panel, borderRadius: radii.card, borderColor: colors.line, borderWidth: 1, padding: 14, gap: 10 },
  week: { color: colors.text, fontSize: 22, fontWeight: "900" },
  phase: { color: colors.muted },
  row: { flexDirection: "row", gap: 10, alignItems: "center", borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 10 },
  day: { color: colors.lime, width: 38, fontWeight: "900" },
  workout: { color: colors.text, flex: 1, fontWeight: "700" },
  minutes: { color: colors.muted }
});

