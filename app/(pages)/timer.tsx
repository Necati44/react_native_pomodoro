import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { IconButton } from "@/components/IconButton";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TimerScreen() {
  const params = useLocalSearchParams();
  const { workTime, breakTime } = params;

  const [pauseIcon, setPauseIcon] = useState(true);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [isWorking, setIsWorking] = useState(true); // État pour suivre la phase (travail/pause)

  const color = useThemeColor({}, "color");

  const workColor = useThemeColor({}, "workColor");

  const breakColor = useThemeColor({}, "breakColor");

  return (
    <>
      <PomodoroTimer
        workTime={Number(workTime)}
        breakTime={Number(breakTime)}
        isPause={pauseTimer}
        isStop={stopTimer}
        setIsWorkingParent={setIsWorking} // Passer la fonction pour changer l'état
      ></PomodoroTimer>
      <SafeAreaView style={[{ flex: 1, backgroundColor: isWorking ? workColor : breakColor }]}>
        <ThemedView
          style={{ flexDirection: "row", justifyContent: "center", gap: 10, backgroundColor: isWorking ? workColor : breakColor }}
        >
          <IconButton
            onPress={() => {
              setPauseIcon(!pauseIcon);
              setPauseTimer(!pauseTimer);
              setStopTimer(false);
            }}
            icon={
              <Ionicons
                name={pauseIcon ? "pause-circle" : "play-circle"}
                size={64}
                style={[{ color }]}
              />
            }
          />
          <IconButton
            onPress={() => {
              setPauseIcon(false);
              setPauseTimer(true);
              setStopTimer(true);
            }}
            icon={<Ionicons name="stop-circle" size={64} style={[{ color }]} />}
          />
        </ThemedView>
      </SafeAreaView>
    </>
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
