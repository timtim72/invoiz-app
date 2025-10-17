// hooks/useCompanyProfile.js

import { useState, useEffect, useCallback } from 'react'; // On importe 'useCallback'
import { db } from '../config/firebase';
import { doc, setDoc, onSnapshot, runTransaction } from 'firebase/firestore';
import { useAuthContext } from '../contexts/AuthContext';

const initialProfile = {
  name: "Votre Nom / Nom de l'entreprise",
  address: "123 Votre Rue, 75000 Votre Ville",
  logo: null,
  invoiceCounter: 0, 
};

export const useCompanyProfile = () => {
  const { currentUser } = useAuthContext();
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    if (currentUser) {
      setLoading(true);
      const docRef = doc(db, 'profiles', currentUser.uid);

      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({ invoiceCounter: 0, ...data });
        } else {
          setDoc(docRef, initialProfile);
          setProfile(initialProfile);
        }
        setLoading(false);
      }, (error) => {
        console.error("Erreur de lecture du profil:", error);
        setLoading(false);
      });
    } else {
      setProfile(initialProfile);
      setLoading(false);
    }

    return () => unsubscribe();
  }, [currentUser]);

  const updateProfile = async (newProfileData) => {
    if (!currentUser) return;
    const docRef = doc(db, 'profiles', currentUser.uid);
    try {
      await setDoc(docRef, newProfileData, { merge: true });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  };
  
  // ON ENVELOPPE LA FONCTION DANS 'useCallback' POUR LA STABILISER
  const getNextInvoiceNumber = useCallback(async () => {
    if (!currentUser) return null;
    const docRef = doc(db, 'profiles', currentUser.uid);
    const year = new Date().getFullYear();

    try {
      const newInvoiceNumber = await runTransaction(db, async (transaction) => {
        const profileDoc = await transaction.get(docRef);
        
        if (!profileDoc.exists()) {
          transaction.set(docRef, initialProfile);
          return `FAC-${year}-001`;
        }

        const newCounter = (profileDoc.data().invoiceCounter || 0) + 1;
        transaction.update(docRef, { invoiceCounter: newCounter });
        
        const paddedCounter = String(newCounter).padStart(3, '0');
        return `FAC-${year}-${paddedCounter}`;
      });
      return newInvoiceNumber;

    } catch (e) {
      console.error("La transaction pour le numéro de facture a échoué: ", e);
      return `FAC-${Date.now()}`;
    }
  }, [currentUser]); // La fonction ne sera recréée que si 'currentUser' change

  return { profile, updateProfile, loading, getNextInvoiceNumber };
};

