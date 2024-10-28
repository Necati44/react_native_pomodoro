import { StyleSheet, SafeAreaView, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { GoogleSignin, GoogleSigninButton, isErrorWithCode, isSuccessResponse, statusCodes, User } from '@react-native-google-signin/google-signin';
import { signIn, signOut } from '@/hooks/useGoogleSignIn';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabTwoScreen() {
  const [user, setUser] = useState<{ userInfo: User | null } | null>(null); // Initialiser comme null

  const signInWithGoogle = async () => {
    signIn(setUser);
  }

  const signOutWithGoogle = async () => {
    signOut(setUser);
  }

  const color = useThemeColor({}, "tint");



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.titleContainer}>
        { user?.userInfo != null ?
          <>
            <ThemedText type="title2" style={styles.welcomeText}>
            <TabBarIcon name="user-alt" size={20} color={color} style={[]} /> {user.userInfo?.user.name}</ThemedText>
            <Button onPress={() => { signOutWithGoogle() }} title='Log out'></Button>
          </>
          :
          <GoogleSigninButton onPress={() => { signInWithGoogle() }}></GoogleSigninButton>
        }
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
    justifyContent: "space-between"
  },
  welcomeText: {
    flexShrink: 1, // Allow the text to shrink if too long
    marginRight: 8, // Small margin between text and button
  },
});
