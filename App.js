// App.js

import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from './styles/globalStyles';

// --- 1. Importation des "Moteurs" (Contextes) ---
// Chaque contexte fournit des données et des fonctions pour une partie de l'app.
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { InvoicesProvider, useInvoicesContext } from './contexts/InvoicesContext';
import { ClientsProvider, useClientsContext } from './contexts/ClientsContext';
import { CompanyProfileProvider, useCompanyProfileContext } from './contexts/CompanyProfileContext';

// --- 2. Importation de tous les "Écrans" (Composants) ---
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvoicesList from './components/InvoicesList';
import InvoiceDetailPage from './components/InvoiceDetailPage';
import InvoiceNew from './components/InvoiceNew';
import ClientsPage from './components/ClientsPage';
import ClientDetailPage from './components/ClientDetailPage';
import AccountPage from './components/AccountPage';
import TrashPage from './components/TrashPage';
import MonthlyInvoicesPage from './components/MonthlyInvoicesPage';
import LegalPage from './components/LegalPage';
import PrivacyPage from './components/PrivacyPage';

// --- 3. Le Cœur de l'Application (le "Chef d'Orchestre") ---
// Ce composant gère l'état principal : quelle page afficher, quel utilisateur est connecté, etc.
const AppContent = () => {
  // --- Gestion de l'état ---
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authScreen, setAuthScreen] = useState('login');
  
  // États pour passer des données spécifiques aux pages de détail
  const [invoiceToView, setInvoiceToView] = useState(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [clientToView, setClientToView] = useState(null);
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  
  // --- Connexion aux "Moteurs" ---
  // On récupère les données et les états de chargement de chaque contexte.
  const { currentUser, loading: authLoading, login, register } = useAuthContext();
  const { loading: invoicesLoading } = useInvoicesContext();
  const { loading: clientsLoading } = useClientsContext();
  const { loading: profileLoading } = useCompanyProfileContext();

  // --- Fonctions de Navigation ---
  // Ces fonctions sont appelées par les composants enfants pour demander un changement de page.
  const handleViewInvoiceDetails = (invoice) => {
    setInvoiceToView(invoice);
    setCurrentPage('invoice-detail');
  };
  const handleEditInvoice = (invoice) => {
    setInvoiceToEdit(invoice);
    setCurrentPage('edit-invoice');
  };
  const handleNewInvoice = () => {
    setInvoiceToEdit(null);
    setCurrentPage('new-invoice');
  };
  const handleViewClientDetails = (client) => {
    setClientToView(client);
    setCurrentPage('client-detail');
  };
  const handleViewMonthDetails = (monthData) => {
    setSelectedMonthData(monthData);
    setCurrentPage('monthly-details');
  };

  // --- Logique d'Affichage ---

  // 1. On affiche un écran de chargement tant que les données ne sont pas prêtes.
  if (authLoading || invoicesLoading || clientsLoading || profileLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#3B82F6" /></View>;
  }

  // 2. Si personne n'est connecté, on affiche les écrans d'authentification.
  if (!currentUser) {
    return authScreen === 'login' ? (
      <LoginScreen onLogin={login} onSwitchToRegister={() => setAuthScreen('register')} />
    ) : (
      <RegisterScreen onRegister={register} onSwitchToLogin={() => setAuthScreen('login')} />
    );
  }

  // 3. Le "Routeur" : choisit quelle page afficher en fonction de 'currentPage'.
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onPageChange={setCurrentPage} onViewMonthDetails={handleViewMonthDetails} />;
      case 'invoices': return <InvoicesList onPageChange={handleNewInvoice} onEditInvoice={handleEditInvoice} onViewInvoice={handleViewInvoiceDetails} />;
      case 'invoice-detail': return <InvoiceDetailPage invoice={invoiceToView} onPageChange={setCurrentPage} onEditInvoice={handleEditInvoice} />;
      case 'new-invoice': return <InvoiceNew onPageChange={setCurrentPage} />;
      case 'edit-invoice': return <InvoiceNew onPageChange={setCurrentPage} invoiceToEdit={invoiceToEdit} />;
      case 'clients': return <ClientsPage onPageChange={setCurrentPage} onViewClient={handleViewClientDetails} />;
      case 'client-detail': return <ClientDetailPage client={clientToView} onPageChange={setCurrentPage} />;
      case 'account': return <AccountPage onPageChange={setCurrentPage} />;
      case 'trash': return <TrashPage onPageChange={setCurrentPage} />;
      case 'monthly-details': return <MonthlyInvoicesPage monthData={selectedMonthData} onPageChange={setCurrentPage} />;
      case 'legal': return <LegalPage onPageChange={setCurrentPage} />;
      case 'privacy': return <PrivacyPage onPageChange={setCurrentPage} />;
      default: return <Dashboard onPageChange={setCurrentPage} onViewMonthDetails={handleViewMonthDetails} />;
    }
  };

  // 4. Si l'utilisateur est connecté, on affiche le Layout principal avec la page actuelle.
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

// --- Le Composant Racine de toute l'application ---
export default function App() {
  return (
    // On enveloppe toute l'application dans les Providers pour que tous les composants
    // puissent accéder aux données dont ils ont besoin.
    <AuthProvider>
      <CompanyProfileProvider>
        <ClientsProvider>
          <InvoicesProvider>
            <AppContent />
          </InvoicesProvider>
        </ClientsProvider>
      </CompanyProfileProvider>
    </AuthProvider>
  );
}

