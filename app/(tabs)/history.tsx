import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Button, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useUser } from '@/context/UserContext';
import { getSessions, Session } from '@/types/Session';
import { auth } from '@/firebase/firebaseConfig';
import { useFocusEffect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

export default function HistoryScreen() {
  const { user, signIn, signOut } = useUser();
  const color = useThemeColor({}, "tint");
  
  const [sessions, setSessions] = useState<Session[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSessions = async () => {
    setLoading(true);
    if (auth.currentUser) {
      const sessionData = await getSessions(auth.currentUser?.uid!);
      sessionData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSessions(sessionData);
    } else {
      setSessions([]);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [user])
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchSessions(); // Trigger fetch when the user is logged in
      } else {
        setSessions([]); // Reset sessions if the user is not logged in
      }
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.titleContainer}>
        {user?.user ? (
          <>
            <ThemedText type="title2" style={styles.welcomeText}>
              <TabBarIcon name="user-alt" size={20} color={color} style={[]} /> {user.user.name}
            </ThemedText>
            <Button onPress={signOut} title="Log out" />
          </>
        ) : (
          <GoogleSigninButton onPress={signIn} />
        )}
      </ThemedView>

      <ThemedView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={color} />
        ) : user?.user ? (
          <ScrollView>
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <ThemedView key={index} style={styles.sessionContainer}>
                  <ThemedText style={styles.sessionText}>
                    {`Date: ${formatDate(session.date)}\nSessions: ${session.sessionCount}\nWorked time: ${formatTime(session.workDuration)}`}
                  </ThemedText>
                  <ThemedView style={[styles.separator, { backgroundColor: color }]} />
                </ThemedView>
              ))
            ) : (
              <ThemedText>No sessions recorded yet.</ThemedText>
            )}
          </ScrollView>
        ) : (
          <ThemedText>Sessions are only available for logged-in users.</ThemedText>
        )}
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
    paddingTop: 44.5,
    paddingStart: 8,
    paddingEnd: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  welcomeText: {
    flexShrink: 1,
    marginRight: 8,
  },
  sessionContainer: {
    marginBottom: 8, // Espace entre les sessions
  },
  sessionText: {
    marginBottom: 8, // Ajoute un espace entre les sessions
  },
  separator: {
    height: 1,
    marginVertical: 8, // Espace vertical autour de la ligne
  },
});
