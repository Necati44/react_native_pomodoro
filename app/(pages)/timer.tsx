import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function TimerScreen() {
  const params = useLocalSearchParams();
  const { workTime, breakTime } = params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PomodoroTimer workTime={Number(workTime)} breakTime={Number(breakTime)}></PomodoroTimer>
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
    paddingStart: 4,
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
