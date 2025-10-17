// hooks/useAuth.js

import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setIsNewUser(false);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      setIsNewUser(true);
    }
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  // LA FONCTION CORRIGÉE
  const sendPasswordResetEmail = (email) => {
    return firebaseSendPasswordResetEmail(auth, email);
  };
  
  const completeOnboarding = () => {
    setIsNewUser(false);
  };

  return { 
    currentUser, 
    loading,
    isNewUser,
    login, 
    register, 
    logout, 
    sendPasswordResetEmail, // On s'assure qu'elle est bien exportée
    completeOnboarding,
  };
};