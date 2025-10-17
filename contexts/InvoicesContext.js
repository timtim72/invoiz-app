import React, { createContext, useContext } from 'react';
import { useInvoices } from '../hooks/useInvoices';

const InvoicesContext = createContext();

export const InvoicesProvider = ({ children }) => {
  const invoices = useInvoices();
  return <InvoicesContext.Provider value={invoices}>{children}</InvoicesContext.Provider>;
};

export const useInvoicesContext = () => useContext(InvoicesContext);