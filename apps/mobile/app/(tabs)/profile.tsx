import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radii } from "../../lib/theme";

export default function ProfileTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Profile</Text>
        <Text style={styles.title}>Athlete setup</Text>
        <View style={styles.card}>
          <TextInput placeholder="Name" defaultValue="HYROX Athlete" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput placeholder="Age" defaultValue="23" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput placeholder="Weight" defaultValue="74" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput placeholder="HYROX category" defaultValue="Doubles Open" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput placeholder="Running pace" defaultValue="4:45/km" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput placeholder="Goal time" defaultValue="1:24" placeholderTextColor={colors.muted} style={styles.input} />
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
  card: { backgroundColor: colors.panel, borderRadius: radii.card, borderColor: colors.line, borderWidth: 1, padding: 14, gap: 12 },
  input: { minHeight: 48, borderColor: colors.line, borderWidth: 1, borderRadius: radii.card, color: colors.text, paddingHorizontal: 12 }
});

