import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { benchmarks, stationTargets } from "@hyrox/shared";
import { colors, radii } from "../../lib/theme";

export default function AnalyticsTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Analytics</Text>
        <Text style={styles.title}>Performance</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Station targets</Text>
          {stationTargets.slice(0, 8).map((target) => (
            <View style={styles.row} key={target.station}>
              <Text style={styles.workout}>{target.station}</Text>
              <Text style={styles.target}>{target.target}</Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Benchmarks</Text>
          {benchmarks.map((benchmark) => (
            <View style={styles.benchmark} key={benchmark.title}>
              <Text style={styles.workout}>Week {benchmark.week}: {benchmark.title}</Text>
              {benchmark.targets.map((target) => <Text style={styles.muted} key={target}>- {target}</Text>)}
            </View>
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
  card: { backgroundColor: colors.panel, borderRadius: radii.card, borderColor: colors.line, borderWidth: 1, padding: 14, gap: 10 },
  cardTitle: { color: colors.text, fontSize: 24, fontWeight: "900" },
  row: { flexDirection: "row", justifyContent: "space-between", borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 10 },
  workout: { color: colors.text, fontWeight: "800", flex: 1 },
  target: { color: colors.lime, fontWeight: "900" },
  benchmark: { gap: 4, borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 10 },
  muted: { color: colors.muted }
});

