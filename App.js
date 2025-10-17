// App.js

import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from './styles/globalStyles';

import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { InvoicesProvider, useInvoicesContext } from './contexts/InvoicesContext';
import { ClientsProvider, useClientsContext } from './contexts/ClientsContext';
import { CompanyProfileProvider, useCompanyProfileContext } from './contexts/CompanyProfileContext';

import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Dashboard from './components/Dashboard';
import InvoiceNew from './components/InvoiceNew';
import InvoicesList from './components/InvoicesList';
import ClientsPage from './components/ClientsPage';
import Layout from './components/Layout';
import AccountPage from './components/AccountPage';
import TrashPage from './components/TrashPage';
import MonthlyInvoicesPage from './components/MonthlyInvoicesPage';
import LegalPage from './components/LegalPage';
import PrivacyPage from './components/PrivacyPage';
// 1. On importe notre nouvelle page de détail
import InvoiceDetailPage from './components/InvoiceDetailPage';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authScreen, setAuthScreen] = useState('login');
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  // 2. NOUVEL ÉTAT pour garder en mémoire la facture à AFFICHER
  const [invoiceToView, setInvoiceToView] = useState(null);

  const { currentUser, loading: authLoading, login, register } = useAuthContext();
  const { loading: invoicesLoading } = useInvoicesContext();
  const { loading: clientsLoading } = useClientsContext();
  const { loading: profileLoading } = useCompanyProfileContext();

  const handleViewMonthDetails = (monthData) => {
    setSelectedMonthData(monthData);
    setCurrentPage('monthly-details');
  };

  const handleEditInvoice = (invoice) => {
    setInvoiceToEdit(invoice);
    setCurrentPage('edit-invoice');
  };
  
  const handleNewInvoice = () => {
    setInvoiceToEdit(null);
    setCurrentPage('new-invoice');
  };
  
  // 3. NOUVELLE FONCTION pour démarrer l'affichage du détail
  const handleViewInvoiceDetails = (invoice) => {
    setInvoiceToView(invoice);
    setCurrentPage('invoice-detail');
  };

  if (authLoading || invoicesLoading || clientsLoading || profileLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#3B82F6" /></View>;
  }

  if (!currentUser) {
    return authScreen === 'login' ? (
      <LoginScreen onLogin={login} onSwitchToRegister={() => setAuthScreen('register')} />
    ) : (
      <RegisterScreen onRegister={register} onSwitchToLogin={() => setAuthScreen('login')} />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onPageChange={setCurrentPage} onViewMonthDetails={handleViewMonthDetails} />;
      case 'new-invoice': return <InvoiceNew onPageChange={setCurrentPage} />;
      case 'edit-invoice': return <InvoiceNew onPageChange={setCurrentPage} invoiceToEdit={invoiceToEdit} />;
      // 4. On passe la nouvelle fonction à la liste des factures
      case 'invoices': return <InvoicesList onPageChange={handleNewInvoice} onEditInvoice={handleEditInvoice} onViewInvoice={handleViewInvoiceDetails} />;
      // 5. ON AJOUTE LA ROUTE POUR LA NOUVELLE PAGE
      case 'invoice-detail': return <InvoiceDetailPage invoice={invoiceToView} onPageChange={setCurrentPage} onEditInvoice={handleEditInvoice} />;
      
      case 'clients': return <ClientsPage onPageChange={setCurrentPage} />;
      case 'account': return <AccountPage onPageChange={setCurrentPage} />;
      case 'trash': return <TrashPage onPageChange={setCurrentPage} />;
      case 'monthly-details': return <MonthlyInvoicesPage monthData={selectedMonthData} onPageChange={setCurrentPage} />;
      case 'legal': return <LegalPage onPageChange={setCurrentPage} />;
      case 'privacy': return <PrivacyPage onPageChange={setCurrentPage} />;
      default: return <Dashboard onPageChange={setCurrentPage} onViewMonthDetails={handleViewMonthDetails} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      currentUser={currentUser}
    >
      {renderPage()}
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CompanyProfileProvider>
        <ClientsProvider>
          <InvoicesProvider>
            <View style={styles.container}>
              <AppContent />
            </View>
          </InvoicesProvider>
        </ClientsProvider>
      </CompanyProfileProvider>
    </AuthProvider>
  );
}