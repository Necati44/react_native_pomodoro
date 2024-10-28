import { auth, provider } from '@/firebase/firebaseConfig'

import { signInWithPopup, signOut, GoogleAuthProvider, User } from "firebase/auth";

export async function signIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    
    // The signed-in user info.
    const user = result.user;

    return user; // Explicitly return the user object
    
  } catch (error) {
    console.error('Sign-in failed:', error);
    return null; // Return null in case of error
  }
}

// signOut(auth).then(() => {
//   // Sign-out successful.
// }).catch((error) => {
//   // An error happened.
// });

  