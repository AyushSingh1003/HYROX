import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { race } from "@hyrox/shared";
import { colors, radii } from "../lib/theme";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>HYROX Delhi 2026</Text>
          <Text style={styles.title}>Elite doubles prep.</Text>
          <Text style={styles.muted}>{race.goalWindow}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{mode === "login" ? "Log in" : "Sign up"}</Text>
          {mode === "signup" ? <TextInput placeholder="Name" placeholderTextColor={colors.muted} style={styles.input} /> : null}
          <TextInput placeholder="Email" placeholderTextColor={colors.muted} style={styles.input} autoCapitalize="none" />
          <TextInput placeholder="Password" placeholderTextColor={colors.muted} style={styles.input} secureTextEntry />
          <Link href="/(tabs)" asChild>
            <Pressable style={styles.primary}>
              <Text style={styles.primaryText}>{mode === "login" ? "Enter dashboard" : "Create profile"}</Text>
            </Pressable>
          </Link>
          <Pressable onPress={() => setMode(mode === "login" ? "signup" : "login")}>
            <Text style={styles.switch}>{mode === "login" ? "Create account" : "Already have an account"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  screen: { flex: 1, padding: 20, justifyContent: "space-between" },
  hero: { paddingTop: 36 },
  eyebrow: { color: colors.lime, fontWeight: "900", textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 56, fontWeight: "900", lineHeight: 58, marginTop: 12 },
  muted: { color: colors.muted, fontSize: 16, marginTop: 8 },
  card: { backgroundColor: colors.panel, borderColor: colors.line, borderWidth: 1, borderRadius: radii.card, padding: 16, gap: 12 },
  cardTitle: { color: colors.text, fontSize: 28, fontWeight: "900" },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, color: colors.text, paddingHorizontal: 12 },
  primary: { minHeight: 48, borderRadius: radii.card, backgroundColor: colors.lime, alignItems: "center", justifyContent: "center" },
  primaryText: { color: colors.bg, fontWeight: "900" },
  switch: { color: colors.lime, textAlign: "center", fontWeight: "800" }
});
