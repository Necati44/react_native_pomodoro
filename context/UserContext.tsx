import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes, User } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

GoogleSignin.configure(
    {
        offlineAccess: true,
        webClientId: '535627715101-palls9jakspdvrq6o5mlm0ur6ap473bn.apps.googleusercontent.com',
        iosClientId: '535627715101-gk10vbck6ahmukkgmiecqpbphjvd2kki.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
    }
);

interface UserContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signInSilently: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUser(response.data);
        const credential = GoogleAuthProvider.credential(response.data.idToken);
        await signInWithCredential(auth, credential);
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // opération déjà en cours
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            alert("Google services are not available");
            break;
          default:
            console.error(error.message);
        }
      } else {
        alert("An unexpected error happened, please contact the support");
      }
    }
  };

  const signInSilently = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signInSilently();
  
      if (response) {
        setUser(response.data); // Met à jour l'état global avec les données de l'utilisateur
      } else {
        console.log('Aucun identifiant de connexion sauvegardé trouvé.');
      }
    } catch (error) {
      if (error === statusCodes.SIGN_IN_REQUIRED) {
        // Aucun identifiant de connexion n'est sauvegardé, donc l'utilisateur n'est pas connecté
        setUser(null);
      } else {
        console.error("Erreur lors de la connexion silencieuse :", error);
      }
    }
  };
  

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    signInSilently(); // Déclenche la connexion silencieuse au démarrage
  }, []);

  return (
    <UserContext.Provider value={{ user, signIn, signInSilently, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
