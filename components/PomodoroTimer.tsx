import React, { useState, useEffect } from "react";
import { View, ViewProps, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

import _BackgroundTimer from "react-native-background-timer"

import * as Notifications from 'expo-notifications';

export type PomodoroTimerProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  workTime?: number;
  breakTime?: number;
  isPause: boolean;
  isStop: boolean;
  setIsWorkingParent: React.Dispatch<React.SetStateAction<boolean>>;
};

// First, set the handler that will cause the notification
// to show the alert

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function PomodoroTimer({
  style,
  lightColor,
  darkColor,
  workTime = 1500, // Par défaut, 25 minutes
  breakTime = 300, // Par défaut, 5 minutes
  isPause,
  isStop,
  setIsWorkingParent,
  ...otherProps
}: PomodoroTimerProps) {
  const [time, setTime] = useState(workTime);
  const [isWorking, setIsWorking] = useState(true); // Pour suivre si on est en phase de travail ou de pause
  const [notificationDisplayed, setNotificationDisplayed] = useState(false); // Ajout d'un état pour l'alerte

  const workColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "workColor"
  );

  const breakColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "breakColor"
  );

  // Planification d'une notification lorsque le temps est écoulé
  const scheduleNotification = async (message: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pomodoro Timer",
        body: message,
      },
      identifier: "pomodoro-timer", // Utilise le même identifiant pour remplacer la notification précédente
      trigger: null, // Immediate notification
    });
  };

  useEffect(() => {
    const interval = _BackgroundTimer.setInterval(async () => {
      if (!isPause && time > 0) {
        setTime((prevTime) => prevTime - 1);
      } else if (time === 0) {
        // Quand le temps atteint zéro, on bascule entre travail et pause
        if (isWorking) {
          setTime(breakTime); // Passe à la pause
          await Notifications.dismissNotificationAsync("pomodoro-timer");
          await scheduleNotification("Work session over! Time for a break.");
        } else {
          setTime(workTime); // Passe au travail
          await Notifications.dismissNotificationAsync("pomodoro-timer");
          await scheduleNotification("Break over! Time to get back to work.");
        }
        setIsWorking(!isWorking); // Change l'état (travail/pause)
        setIsWorkingParent(!isWorking);
      }
    }, 1000);

    // Réinitialisation lors de l'arrêt
    if (isStop) {
      _BackgroundTimer.clearInterval(interval);
      setTime(workTime); // Reset au temps de travail initial
      setIsWorking(true); // Recommence avec le temps de travail
      setIsWorkingParent(true);
    }

    return () => {
      _BackgroundTimer.clearInterval(interval);
    }
  }, [isPause, isStop, time, isWorking, workTime, breakTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: isWorking ? workColor : breakColor }]}>
      <View style={styles.circle}>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
        <Text style={styles.phaseText}>
          {isWorking ? "Work Time" : "Break Time"}
        </Text>
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
  phaseText: {
    fontSize: 24,
    marginTop: 10,
    color: "#666", // Lighter text color for the phase
  },
});
