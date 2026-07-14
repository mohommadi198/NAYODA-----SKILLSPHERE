import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";

import { auth } from "../configs/firebaseConfig";
import { getProfile, syncUser as syncUserService } from "../services/userServices";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(undefined); // undefined = not yet fetched, null = no profile
  const [profileLoading, setProfileLoading] = useState(false);

  // Refs to prevent duplicate / stale profile fetches
  const profileFetchInProgress = useRef(false);
  const lastFetchedUid = useRef(null);

  /**
   * Core profile fetcher.
   * @param {boolean} force — when true, ignores the cache and re-fetches.
   */
  const fetchProfile = useCallback(async (force = false) => {
    // Prevent concurrent fetches (unless forced)
    if (!force && profileFetchInProgress.current) return;
    if (!user) {
      setDbUser(null);
      return;
    }
    // Skip if already fetched for this user (unless forced)
    if (!force && lastFetchedUid.current === user.uid && dbUser !== undefined) return;

    profileFetchInProgress.current = true;
    setProfileLoading(true);
    lastFetchedUid.current = user.uid;

    try {
      const profile = await getProfile();
      setDbUser(profile?.data ?? profile ?? null);
    } catch (err) {
      console.error("Profile Error:", err);
      setDbUser(null);
    } finally {
      profileFetchInProgress.current = false;
      setProfileLoading(false);
    }
  }, [user, dbUser]);

  // Auto-fetch profile when auth state settles
  useEffect(() => {
    if (loading) return;
    fetchProfile();
  }, [loading, fetchProfile]);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Auth helpers ─────────────────────────────────────────────────────────

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return result.user;
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  /**
   * Sync a Firebase user with the backend, then force-refresh the local
   * profile so the UI updates immediately without a page reload.
   */
  const syncAndRefreshProfile = useCallback(async (firebaseUser) => {
    await syncUserService(firebaseUser);
    await fetchProfile(true); // force re-fetch
  }, [fetchProfile]);

  /** Force re-fetch profile from the backend (clears cache). */
  const refreshProfile = useCallback(() => fetchProfile(true), [fetchProfile]);

  const logout = () => {
    lastFetchedUid.current = null;
    setDbUser(undefined);
    return signOut(auth);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updatePassword = (newPassword) =>
    firebaseUpdatePassword(auth.currentUser, newPassword);

  const value = {
    user,
    dbUser,
    loading,
    profileLoading,
    login,
    signup,
    googleSignIn,
    logout,
    resetPassword,
    updatePassword,
    syncAndRefreshProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};