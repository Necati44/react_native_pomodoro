import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, ViewProps, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import _BackgroundTimer from "react-native-background-timer";
import * as Notifications from 'expo-notifications';
import { useUser } from "@/context/UserContext";
import { addSession } from "@/types/Session";
import { auth } from "@/firebase/firebaseConfig";

export type PomodoroTimerProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  workTime?: number;
  breakTime?: number;
  isPause: boolean;
  isStop: boolean;
  setIsWorkingParent: React.Dispatch<React.SetStateAction<boolean>>;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function PomodoroTimer({
  workTime = 1500,
  breakTime = 300,
  isPause,
  isStop,
  setIsWorkingParent,
  ...otherProps
}: PomodoroTimerProps) {
  const [time, setTime] = useState(workTime);
  const [isWorking, setIsWorking] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null); // Start date of the session
  const [isSessionActive, setIsSessionActive] = useState(false);
  const { user } = useUser();
  const [sessionSaved, setSessionSaved] = useState(false);

  // Utiliser des références pour éviter le reset de ces valeurs
  const workDurationRef = useRef(0);
  const sessionCountRef = useRef(0);

  const workColor = useThemeColor({}, "workColor");
  const breakColor = useThemeColor({}, "breakColor");

  const scheduleNotification = async (message: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title: "Pomodoro Timer", body: message },
      identifier: "pomodoro-timer",
      trigger: null,
    });
  };

  useEffect(() => {
    if (!isSessionActive && !isStop) {
      setStartDate(new Date());
      setIsSessionActive(true);
    }

    const interval = _BackgroundTimer.setInterval(async () => {
      if (!isPause && time > 0) {
        setTime(prevTime => prevTime - 1);
        if (isWorking) workDurationRef.current += 1; // Incrémentation de la référence
      } else if (time === 0) {
        setTime(isWorking ? breakTime : workTime);
        setIsWorking(!isWorking);
        setIsWorkingParent(!isWorking);
        if (isWorking) sessionCountRef.current += 1; // Incrémentation de la référence
        await Notifications.dismissNotificationAsync("pomodoro-timer");
        await scheduleNotification(isWorking ? "Work session over! Time for a break." : "Break over! Time to get back to work.");
      }
    }, 1000);

    if (isStop && !sessionSaved) {
      _BackgroundTimer.clearInterval(interval);
      saveSession();
      resetTimer();
      setSessionSaved(true);
      setIsSessionActive(false); // End of session
    } else if (!isStop) {
      setSessionSaved(false);
    }

    return () => {
      _BackgroundTimer.clearInterval(interval);
    };
  }, [isPause, isStop, time, isWorking]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (isSessionActive && workDurationRef.current > 0) {
          saveSession();
        }
      };
    }, [isSessionActive])
  );

  const saveSession = async () => {
    if (user && startDate) {
      const session = {
        date: startDate,
        sessionCount: sessionCountRef.current,
        workDuration: workDurationRef.current,
        userUUID: auth.currentUser?.uid,
      };
      await addSession(session);
      setSessionSaved(true);
    }
  };

  const resetTimer = () => {
    setTime(workTime);
    setIsWorking(true);
    setIsWorkingParent(true);
    workDurationRef.current = 0;
    sessionCountRef.current = 0;
    setStartDate(new Date());
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  circle: {
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: "#fdf3e9", justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
    shadowRadius: 5, elevation: 10
  },
  timerText: { fontSize: 48, fontWeight: "bold", color: "#333" },
  phaseText: { fontSize: 24, marginTop: 10, color: "#666" },
});
