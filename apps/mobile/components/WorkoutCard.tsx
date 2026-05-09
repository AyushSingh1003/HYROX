import { Pressable, StyleSheet, Text, View } from "react-native";
import { getExerciseGuidance, type DailyWorkout } from "@hyrox/shared";
import { colors, radii } from "../lib/theme";

export function WorkoutCard({
  workout,
  completed,
  onToggle
}: {
  workout: DailyWorkout;
  completed?: boolean;
  onToggle?: () => void;
}) {
  const guidance = getExerciseGuidance(workout.blocks[0]?.title ?? workout.title, workout.blocks[0]?.items ?? []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>Week {workout.week} / {workout.day}</Text>
          <Text style={styles.title}>{workout.title}</Text>
          <Text style={styles.muted}>{workout.focus}</Text>
        </View>
        <Pressable style={[styles.check, completed && styles.checkDone]} onPress={onToggle}>
          <Text style={[styles.checkText, completed && styles.checkDoneText]}>{completed ? "✓" : ""}</Text>
        </Pressable>
      </View>
      <View style={styles.chips}>
        <Text style={styles.chip}>{workout.intensity}</Text>
        <Text style={styles.chip}>{workout.durationMinutes} min</Text>
      </View>
      {workout.blocks.slice(0, 2).map((block) => (
        <View style={styles.block} key={block.title}>
          <Text style={styles.blockTitle}>{block.title}</Text>
          {block.items.slice(0, 4).map((item) => <Text style={styles.item} key={item}>- {item}</Text>)}
        </View>
      ))}
      <View style={styles.guidance}>
        <Text style={styles.blockTitle}>{guidance.exerciseName} coaching</Text>
        {guidance.instructions.slice(0, 3).map((item) => <Text style={styles.item} key={item}>- {item}</Text>)}
        <Text style={styles.video}>Watch Technique: {guidance.video.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radii.card,
    padding: 16,
    gap: 12
  },
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start"
  },
  eyebrow: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4
  },
  muted: {
    color: colors.muted,
    marginTop: 4
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    color: colors.text,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden"
  },
  block: {
    backgroundColor: colors.panelSoft,
    borderRadius: radii.card,
    padding: 12
  },
  blockTitle: {
    color: colors.text,
    fontWeight: "800",
    marginBottom: 6
  },
  item: {
    color: colors.muted,
    lineHeight: 21
  },
  guidance: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radii.card,
    padding: 12,
    gap: 4
  },
  video: {
    color: colors.lime,
    fontWeight: "900",
    marginTop: 6
  },
  check: {
    width: 42,
    height: 42,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center"
  },
  checkDone: {
    backgroundColor: colors.lime,
    borderColor: colors.lime
  },
  checkText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  checkDoneText: {
    color: colors.bg
  }
});
