// hooks/useInvoices.js

import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, where, writeBatch, getDocs } from 'firebase/firestore';
import { useAuthContext } from '../contexts/AuthContext';

export const useInvoices = () => {
  const { currentUser } = useAuthContext();
  const [invoices, setInvoices] = useState([]);
  const [trashedInvoices, setTrashedInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeInvoices = () => {};
    let unsubscribeTrashed = () => {};

    if (currentUser) {
      setLoading(true);
      const invoicesCollectionRef = collection(db, 'users', currentUser.uid, 'invoices');

      const qInvoices = query(invoicesCollectionRef, where("deleted", "!=", true));
      unsubscribeInvoices = onSnapshot(qInvoices, (querySnapshot) => {
        const invoicesData = [];
        querySnapshot.forEach((doc) => {
          invoicesData.push({ id: doc.id, ...doc.data() });
        });
        setInvoices(invoicesData);
        setLoading(false);
      });

      const qTrashed = query(invoicesCollectionRef, where("deleted", "==", true));
      unsubscribeTrashed = onSnapshot(qTrashed, (querySnapshot) => {
        const trashedData = [];
        querySnapshot.forEach((doc) => {
          trashedData.push({ id: doc.id, ...doc.data() });
        });
        setTrashedInvoices(trashedData);
      });

    } else {
      setInvoices([]);
      setTrashedInvoices([]);
      setLoading(false);
    }

    return () => {
      unsubscribeInvoices();
      unsubscribeTrashed();
    };
  }, [currentUser]);

  const addInvoice = async (invoiceData) => {
    if (!currentUser) return;
    const invoicesCollectionRef = collection(db, 'users', currentUser.uid, 'invoices');
    await addDoc(invoicesCollectionRef, { ...invoiceData, deleted: false });
  };

  const updateInvoice = async (id, updates) => {
    if (!currentUser) return;
    const invoiceDocRef = doc(db, 'users', currentUser.uid, 'invoices', id);
    await updateDoc(invoiceDocRef, updates);
  };

  const deleteInvoice = async (id) => {
    if (!currentUser) return;
    const invoiceDocRef = doc(db, 'users', currentUser.uid, 'invoices', id);
    await updateDoc(invoiceDocRef, { deleted: true });
  };

  const restoreInvoice = async (id) => {
    if (!currentUser) return;
    const invoiceDocRef = doc(db, 'users', currentUser.uid, 'invoices', id);
    await updateDoc(invoiceDocRef, { deleted: false });
  };
  
  // NOUVELLE FONCTION pour supprimer une seule facture définitivement
  const permanentlyDeleteInvoice = async (id) => {
    if (!currentUser) return;
    const invoiceDocRef = doc(db, 'users', currentUser.uid, 'invoices', id);
    try {
      await deleteDoc(invoiceDocRef);
    } catch (error) {
      console.error("Erreur lors de la suppression définitive de la facture:", error);
    }
  };

  const permanentlyDeleteAllTrashed = async () => {
    if (!currentUser) return;
    const batch = writeBatch(db);
    const invoicesCollectionRef = collection(db, 'users', currentUser.uid, 'invoices');
    const q = query(invoicesCollectionRef, where("deleted", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  return { 
    invoices, 
    addInvoice, 
    updateInvoice, 
    deleteInvoice,
    trashedInvoices,
    restoreInvoice,
    permanentlyDeleteAllTrashed,
    permanentlyDeleteInvoice, // On exporte la nouvelle fonction
    loading 
  };
};

