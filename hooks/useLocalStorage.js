// hooks/useLocalStorage.js

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  // Charger les données une seule fois au démarrage
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then(storedValue => {
        if (storedValue !== null) {
          setValue(JSON.parse(storedValue));
        }
      })
      .catch(error => {
        console.error(`Erreur au chargement de '${key}' depuis le stockage`, error);
      });
  }, [key]);

  // Hook pour sauvegarder à chaque changement de la valeur
  useEffect(() => {
    try {
      AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
       console.error(`Erreur à la sauvegarde de '${key}' dans le stockage`, error);
    }
  }, [key, value]);

  return [value, setValue];
}