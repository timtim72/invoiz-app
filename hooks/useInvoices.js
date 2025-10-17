// hooks/useInvoices.js

import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, where, writeBatch, getDocs } from 'firebase/firestore';
import { useAuthContext } from '../contexts/AuthContext';

export const useInvoices = () => {
  const { currentUser } = useAuthContext();
  const [invoices, setInvoices] = useState([]);
  const [trashedInvoices, setTrashedInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MOTEUR DE MISE À JOUR AUTOMATIQUE DES STATUTS ---
  useEffect(() => {
    // Cette fonction ne s'exécute que si un utilisateur est connecté
    if (!currentUser || !invoices.length) return;

    const checkOverdueInvoices = async () => {
      const today = new Date();
      // On ne veut pas vérifier les factures déjà payées ou les brouillons
      const invoicesToCheck = invoices.filter(
        inv => inv.status === 'pending' || inv.status === 'sent' 
      );

      if (invoicesToCheck.length === 0) return;

      // On prépare une opération groupée pour mettre à jour toutes les factures en retard d'un seul coup
      const batch = writeBatch(db);
      let updatesMade = false;

      invoicesToCheck.forEach(invoice => {
        if (invoice.dueDate) {
          const dueDate = new Date(invoice.dueDate);
          // Si la date d'échéance est passée et la facture n'est pas payée
          if (today > dueDate) {
            const invoiceRef = doc(db, 'users', currentUser.uid, 'invoices', invoice.id);
            batch.update(invoiceRef, { status: 'overdue' });
            updatesMade = true;
          }
        }
      });

      // Si on a trouvé des factures à mettre à jour, on exécute l'opération
      if (updatesMade) {
        console.log("Mise à jour des factures en retard...");
        await batch.commit();
      }
    };

    checkOverdueInvoices();
  // On exécute cette vérification une seule fois, 1 seconde après que les factures soient chargées
  // Le délai évite les mises à jour trop fréquentes au démarrage
  }, [invoices, currentUser]); 
  // Le hook se relancera si la liste des factures ou l'utilisateur change.

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
    loading 
  };
};
