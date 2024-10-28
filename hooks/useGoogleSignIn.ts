import {
    GoogleSignin,
    isErrorWithCode,
    isNoSavedCredentialFoundResponse,
    isSuccessResponse,
    statusCodes,
    User
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure(
    {
        offlineAccess: true,
        webClientId: '535627715101-palls9jakspdvrq6o5mlm0ur6ap473bn.apps.googleusercontent.com',
        scopes: ['profile', 'email']
    }
);

export async function signIn(setUser: React.Dispatch<React.SetStateAction<{userInfo: User | null } | null>>) {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
          setUser({ userInfo: response.data });
        } else {
          // sign in was cancelled by user
        }
      } catch (error) {
        if (isErrorWithCode(error)) {
          switch (error.code) {
            case statusCodes.IN_PROGRESS:
              // operation (eg. sign in) already in progress
              break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
              // Android only, play services not available or outdated
              alert("Google services are not available")
              break;
            default:
            console.error(error.message);
          }
        } else {
          // an error that's not related to google sign in occurred
          alert("An unexpected error happened, please contact the support")
        }
      }
};

export async function signOut (setUser: React.Dispatch<React.SetStateAction<{userInfo: User | null } | null>>) {
  try {
    await GoogleSignin.signOut();
    setUser({ userInfo: null }); // Remember to remove the user from your app's state as well
  } catch (error) {
    console.error(error);
  }
};