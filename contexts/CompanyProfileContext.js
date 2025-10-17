// contexts/CompanyProfileContext.js

import React, { createContext, useContext } from 'react';
import { useCompanyProfile } from '../hooks/useCompanyProfile';

const CompanyProfileContext = createContext();

export const CompanyProfileProvider = ({ children }) => {
  const companyProfile = useCompanyProfile();
  return <CompanyProfileContext.Provider value={companyProfile}>{children}</CompanyProfileContext.Provider>;
};

export const useCompanyProfileContext = () => useContext(CompanyProfileContext);