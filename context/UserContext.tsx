import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes, User } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

// Configure Google Sign-In with necessary client IDs and scopes
GoogleSignin.configure({
    offlineAccess: true, // Allows offline access to the user's data
    webClientId: '535627715101-palls9jakspdvrq6o5mlm0ur6ap473bn.apps.googleusercontent.com', // Web client ID
    iosClientId: '535627715101-gk10vbck6ahmukkgmiecqpbphjvd2kki.apps.googleusercontent.com', // iOS client ID
    scopes: ['profile', 'email'], // Permissions requested from Google
});

// Define the structure of the UserContext, specifying the user state and available authentication functions
interface UserContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signInSilently: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create a Context for the user with an undefined initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component to manage the user state and provide authentication functions to the app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Manage user state

  // Function to sign in with Google
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // Check for Google Play Services
      const response = await GoogleSignin.signIn(); // Prompt the user to sign in

      if (isSuccessResponse(response)) { // Check if the sign-in was successful
        setUser(response.data); // Update the user state with Google response data
        const credential = GoogleAuthProvider.credential(response.data.idToken); // Generate Firebase credential from ID token
        await signInWithCredential(auth, credential); // Sign in to Firebase with Google credentials
      }
    } catch (error) {
      // Handle errors based on specific error codes
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // A sign-in operation is already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            alert("Google services are not available");
            break;
          default:
            console.error(error.message); // Log any other errors
        }
      } else {
        alert("An unexpected error happened, please contact the support");
      }
    }
  };

  // Function to sign in silently if user credentials are saved
  const signInSilently = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // Check for Google Play Services
      const response = await GoogleSignin.signInSilently(); // Attempt silent sign-in
      
      if (response) {
        setUser(response.data); // Update global state with user data if successful
      } else {
        console.log('No saved login credentials found.');
      }
    } catch (error) {
      if (error === statusCodes.SIGN_IN_REQUIRED) {
        // Sign-in required, so user is not signed in
        setUser(null);
      } else {
        console.error("Error during silent sign-in:", error); // Log other errors
      }
    }
  };

  // Function to sign out the user from Google and Firebase
  const signOut = async () => {
    try {
      await GoogleSignin.signOut(); // Sign out from Google
      await firebaseSignOut(auth); // Sign out from Firebase
      setUser(null); // Clear user state
    } catch (error) {
      console.error(error); // Log any errors
    }
  };

  // Trigger silent sign-in when the component mounts
  useEffect(() => {
    signInSilently();
  }, []);

  // Provide the user state and authentication functions to all components wrapped in UserProvider
  return (
    <UserContext.Provider value={{ user, signIn, signInSilently, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to consume the UserContext in components
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
