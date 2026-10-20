import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super("Firebase isn't connected yet. Add your keys to .env.local (see .env.example).");
    this.name = "FirebaseNotConfiguredError";
  }
}

let app: FirebaseApp | undefined;

/** Lazily initialise Firebase so pages still render before keys are added. */
export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) throw new FirebaseNotConfiguredError();
  app ??= getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export const firebaseAuth = (): Auth => getAuth(getFirebaseApp());
export const firestore = (): Firestore => getFirestore(getFirebaseApp());
export const firebaseStorage = (): FirebaseStorage => getStorage(getFirebaseApp());

export function googleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}
