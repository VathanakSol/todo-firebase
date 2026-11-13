"use client";

import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, type User } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { translations } from "@/lib/i18n";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
    setAuthLoading(false);
  }), []);

  // Each sign-in action resolves to true on success so the caller can navigate.
  async function handleSignIn() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success(translations().auth.signedIn);
      return true;
    } catch {
      toast.error(translations().auth.signInFailed);
      return false;
    }
  }

  async function handleEmailSignIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success(translations().auth.signedIn);
      return true;
    } catch (error) {
      toast.error(authErrorMessage(error, translations().auth.signInFailed));
      return false;
    }
  }

  async function handleRegister(name: string, email: string, password: string) {
    try {
      const { user: created } = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) await updateProfile(created, { displayName: name.trim() });
      toast.success(translations().auth.accountCreated);
      return true;
    } catch (error) {
      toast.error(authErrorMessage(error, translations().auth.registerFailed));
      return false;
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      toast.success(translations().auth.signedOut);
    } catch {
      toast.error(translations().auth.signOutFailed);
    }
  }

  return { user, authLoading, handleSignIn, handleEmailSignIn, handleRegister, handleSignOut };
}

function authErrorMessage(error: unknown, fallback: string) {
  const t = translations().auth;
  switch (error instanceof FirebaseError ? error.code : "") {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password": return t.wrongCredentials;
    case "auth/email-already-in-use": return t.emailInUse;
    case "auth/weak-password":
    case "auth/password-does-not-meet-requirements": return t.weakPassword;
    case "auth/invalid-email": return t.invalidEmail;
    case "auth/too-many-requests": return t.tooManyAttempts;
    case "auth/operation-not-allowed": return t.emailSignInDisabled;
    default: return fallback;
  }
}
