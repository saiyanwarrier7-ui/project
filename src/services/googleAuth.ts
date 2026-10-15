import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { storageService } from './storageService';
import { User } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Provider
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.setCustomParameters({
  prompt: 'select_account',
});

// Cache in-memory access token as required by guidelines
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

/**
 * Signs in or registers the student using Google OAuth popup.
 * If the user does not exist in local repository yet, registers them automatically with their Google profile.
 */
export const signInWithGoogle = async (): Promise<{
  appUser: User;
  firebaseUser: FirebaseUser;
  accessToken: string;
  isNewUser: boolean;
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || '';
    cachedAccessToken = accessToken;

    const fbUser = result.user;
    const email = fbUser.email || '';
    const name = fbUser.displayName || email.split('@')[0] || 'Google Student';
    const photoURL =
      fbUser.photoURL ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

    // Check if user already exists in repository storage
    const allUsers = storageService.getUsers();
    let existingUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    let isNewUser = false;
    let appUser: User;

    if (existingUser) {
      // Update avatar if needed and set as active user
      if (fbUser.photoURL && existingUser.avatar !== fbUser.photoURL) {
        existingUser = storageService.updateUserProfile({
          avatar: fbUser.photoURL,
        }) || existingUser;
      }
      storageService.switchUser(existingUser.id);
      appUser = existingUser;
    } else {
      // Register new student from Google Account
      isNewUser = true;
      const rollNumberPrefix = email.split('@')[0].toUpperCase().slice(0, 8);
      const regResult = storageService.register({
        name,
        email,
        role: 'student',
        department: 'Computer Science & Engineering',
        course: 'B.Tech in Computer Science',
        year: 'Year 4 (Senior)',
        rollNumber: `STU-G-${rollNumberPrefix}`,
        avatar: photoURL,
        bio: 'Student researcher registered via University Google Account.',
        githubProfile: `https://github.com/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      });

      if (!regResult.user) {
        throw new Error(regResult.error || 'Failed to create student account from Google');
      }
      appUser = regResult.user;
    }

    return {
      appUser,
      firebaseUser: fbUser,
      accessToken,
      isNewUser,
    };
  } catch (error: any) {
    console.error('Google Sign-In / Register error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Returns cached in-memory access token.
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Signs out from Firebase Auth.
 */
export const googleLogout = async (): Promise<void> => {
  try {
    await signOut(auth);
    cachedAccessToken = null;
  } catch (err) {
    console.warn('Firebase signOut error:', err);
  }
};
