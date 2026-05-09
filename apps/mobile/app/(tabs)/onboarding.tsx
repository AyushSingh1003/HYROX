import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { generateTrainingPlan, type TrainingLevel } from "@hyrox/shared";
import { colors, radii } from "../../lib/theme";

const levels: Array<{ value: TrainingLevel; label: string }> = [
  { value: "absolute-beginner", label: "Absolute Beginner" },
  { value: "beginner", label: "Beginner" },
  { value: "moderate", label: "Moderate" },
  { value: "expert", label: "Expert" }
];

export default function OnboardingTab() {
  const [level, setLevel] = useState<TrainingLevel>("moderate");
  const plan = useMemo(() => generateTrainingPlan({
    name: "HYROX Athlete",
    age: 23,
    weight: 74,
    current5kPace: "4:45/km",
    weeklyRunningVolume: 25,
    strengthExperience: "Regular gym training",
    hyroxExperience: "Completed HYROX before",
    raceCategory: "doubles-open",
    goalRaceDate: "2026-07-25",
    targetGoalTime: "1:12-1:15",
    availableTrainingDays: 5,
    equipmentAccess: ["Gym", "SkiErg", "RowErg", "Sled"],
    weakestStations: ["Running", "Sled Push"],
    trainingLevel: level
  }), [level]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Plan Generator</Text>
        <Text style={styles.title}>HYROX level</Text>
        <View style={styles.levels}>
          {levels.map((item) => (
            <Pressable key={item.value} style={[styles.level, level === item.value && styles.active]} onPress={() => setLevel(item.value)}>
              <Text style={[styles.levelText, level === item.value && styles.activeText]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{plan.title}</Text>
          <Text style={styles.muted}>{plan.summary}</Text>
          {plan.priorities.map((priority) => <Text style={styles.item} key={priority}>- {priority}</Text>)}
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
  levels: { gap: 10 },
  level: { borderColor: colors.line, borderWidth: 1, borderRadius: radii.card, padding: 14, backgroundColor: colors.panel },
  active: { borderColor: colors.lime, backgroundColor: colors.panelSoft },
  levelText: { color: colors.text, fontWeight: "900" },
  activeText: { color: colors.lime },
  card: { backgroundColor: colors.panel, borderRadius: radii.card, borderColor: colors.line, borderWidth: 1, padding: 14, gap: 10 },
  cardTitle: { color: colors.text, fontSize: 22, fontWeight: "900" },
  muted: { color: colors.muted, lineHeight: 21 },
  item: { color: colors.muted, lineHeight: 22 }
});
