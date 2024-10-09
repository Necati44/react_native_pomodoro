import React, { useState, useEffect } from "react";
import { View, ViewProps, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type PomodoroTimerProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  workTime?: number;
  breakTime?: number;
  isPause: boolean;
  isStop: boolean;
};

export function PomodoroTimer({
  style,
  lightColor,
  darkColor,
  workTime,
  breakTime,
  isPause,
  isStop,
  ...otherProps
}: PomodoroTimerProps) {
  const [time, setTime] = useState(workTime!);
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPause) {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }
    }, 1000);

    if (isStop) {
      clearInterval(interval);
      setTime(workTime!);
    }

    return () => clearInterval(interval);
  }, [isPause, isStop]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={[{ backgroundColor }, styles.container]}>
      <View style={styles.circle}>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 300, // Width and height are equal to form a circle
    height: 300,
    borderRadius: 150, // Half of the width/height to make it a circle
    backgroundColor: "#fdf3e9", // Light beige color
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Optional shadow for a 3D effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10, // Shadow for Android
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333", // Dark text color for contrast
  },
});
