import React, { createContext, useContext } from 'react';
import { useClients } from '../hooks/useClients';

const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const clients = useClients();
  return <ClientsContext.Provider value={clients}>{children}</ClientsContext.Provider>;
};

export const useClientsContext = () => useContext(ClientsContext);
