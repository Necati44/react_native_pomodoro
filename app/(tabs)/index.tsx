import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { ListPomodoroTimers } from "@/components/ListPomodoroTimers";
import { SafeAreaView } from "react-native-safe-area-context";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { usePermissions } from "@/hooks/usePermissions";

export default function HomeScreen() {
  usePermissions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Pomodoro timers</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ListPomodoroTimers />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    paddingStart: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
