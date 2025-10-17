// hooks/useClients.js

import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, where, writeBatch, getDocs } from 'firebase/firestore';
import { useAuthContext } from '../contexts/AuthContext';

export const useClients = () => {
  const { currentUser } = useAuthContext();
  const [clients, setClients] = useState([]);
  const [trashedClients, setTrashedClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeClients = () => {};
    let unsubscribeTrashed = () => {};

    if (currentUser) {
      setLoading(true);
      const clientsCollectionRef = collection(db, 'users', currentUser.uid, 'clients');

      const qClients = query(clientsCollectionRef, where("deleted", "!=", true));
      unsubscribeClients = onSnapshot(qClients, (querySnapshot) => {
        const clientsData = [];
        querySnapshot.forEach((doc) => {
          clientsData.push({ id: doc.id, ...doc.data() });
        });
        setClients(clientsData);
        setLoading(false);
      });

      const qTrashed = query(clientsCollectionRef, where("deleted", "==", true));
      unsubscribeTrashed = onSnapshot(qTrashed, (querySnapshot) => {
        const trashedData = [];
        querySnapshot.forEach((doc) => {
          trashedData.push({ id: doc.id, ...doc.data() });
        });
        setTrashedClients(trashedData);
      });

    } else {
      setClients([]);
      setTrashedClients([]);
      setLoading(false);
    }

    return () => {
      unsubscribeClients();
      unsubscribeTrashed();
    };
  }, [currentUser]);

  const addClient = async (clientData) => {
    if (!currentUser) return;
    try {
      const clientsCollectionRef = collection(db, 'users', currentUser.uid, 'clients');
      await addDoc(clientsCollectionRef, { ...clientData, deleted: false });
    } catch (error)      {
      console.error("Erreur lors de l'ajout du client:", error);
    }
  };

  const updateClient = async (id, updates) => {
    if (!currentUser) return;
    const clientDocRef = doc(db, 'users', currentUser.uid, 'clients', id);
    try {
      await updateDoc(clientDocRef, updates);
    } catch (error) {
      console.error("Erreur lors de la modification du client:", error);
    }
  };

  const deleteClient = async (id) => {
    if (!currentUser) return;
    const clientDocRef = doc(db, 'users', currentUser.uid, 'clients', id);
    try {
      await updateDoc(clientDocRef, { deleted: true });
    } catch (error) {
      console.error("Erreur lors de la mise à la corbeille du client:", error);
    }
  };

  const restoreClient = async (id) => {
    if (!currentUser) return;
    const clientDocRef = doc(db, 'users', currentUser.uid, 'clients', id);
    try {
      await updateDoc(clientDocRef, { deleted: false });
    } catch (error) {
      console.error("Erreur lors de la restauration du client:", error);
    }
  };

  // NOUVELLE FONCTION pour supprimer un seul client définitivement
  const permanentlyDeleteClient = async (id) => {
    if (!currentUser) return;
    const clientDocRef = doc(db, 'users', currentUser.uid, 'clients', id);
    try {
      await deleteDoc(clientDocRef);
    } catch (error) {
      console.error("Erreur lors de la suppression définitive du client:", error);
    }
  };

  const permanentlyDeleteAllTrashed = async () => {
    if (!currentUser) return;
    try {
      const batch = writeBatch(db);
      const clientsCollectionRef = collection(db, 'users', currentUser.uid, 'clients');
      
      const q = query(clientsCollectionRef, where("deleted", "==", true));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log("Corbeille des clients vidée avec succès.");

    } catch (error) {
      console.error("Erreur lors de la suppression définitive des clients:", error);
    }
  };

  return { 
    clients, 
    addClient, 
    updateClient, 
    deleteClient,
    trashedClients,
    restoreClient,
    permanentlyDeleteAllTrashed,
    permanentlyDeleteClient, // On exporte la nouvelle fonction
    loading 
  };
};

