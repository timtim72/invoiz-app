import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SvgIcon from './SvgIcon';

// =================================================================
// ==                        COMPOSANT FOOTER                       ==
// =================================================================
// Ce composant simple affiche les liens légaux en bas de page.
// Il est défini ici car il est utilisé uniquement par le Layout.
const Footer = ({ onPageChange }) => (
  <View style={styles.footer}>
    <TouchableOpacity style={styles.footerLink} onPress={() => onPageChange('legal')}>
      <Text style={styles.footerText}>Mentions Légales</Text>
    </TouchableOpacity>
    <Text style={styles.footerSeparator}>|</Text>
    <TouchableOpacity style={styles.footerLink} onPress={() => onPageChange('privacy')}>
      <Text style={styles.footerText}>Politique de Confidentialité</Text>
    </TouchableOpacity>
  </View>
);

// =================================================================
// ==                    COMPOSANT PRINCIPAL LAYOUT                 ==
// =================================================================
// Ce composant sert de "modèle" pour toutes les pages de l'application
// une fois que l'utilisateur est connecté. Il contient l'en-tête,
// la navigation principale et le pied de page.
const Layout = ({ children, currentPage, onPageChange, currentUser }) => {
  // Définition des éléments du menu de navigation principal.
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'invoices', label: 'Factures', icon: 'invoices' },
    { id: 'clients', label: 'Clients', icon: 'clients' },
    { id: 'account', label: 'Mon Compte', icon: 'user' }
  ];

  return (
    // Conteneur principal qui occupe tout l'écran et organise les éléments verticalement
    <View style={styles.layout}>
      
      {/* ===== EN-TÊTE (HEADER) ===== */}
      <View style={styles.header}>
        {/* Partie gauche : Logo et nom de l'application */}
        <View style={styles.headerLeft}>
          <View style={styles.logo}><SvgIcon name="invoices" size={20} color="white" /></View>
          <Text style={styles.logoText}>Invoiz</Text>
        </View>
        
        {/* Partie centrale : Navigation principale */}
        <View style={styles.nav}>{menuItems.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.navButton, currentPage === item.id && styles.navButtonActive]} 
            onPress={() => onPageChange(item.id)}
          >
            <SvgIcon name={item.icon} size={16} color={currentPage === item.id ? 'white' : '#6b7280'} />
            <Text style={[styles.navText, currentPage === item.id && styles.navTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}</View>
        
        {/* Partie droite : Infos utilisateur et bouton d'action rapide */}
        <View style={styles.headerRight}>
          <Text style={styles.userInfo}>{currentUser?.email}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => onPageChange('new-invoice')}>
            <SvgIcon name="plus" size={16} color="white" /><Text style={styles.primaryButtonText}>Nouvelle facture</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== CONTENU PRINCIPAL DE LA PAGE ===== */}
      {/* C'est ici que le contenu de chaque page (Dashboard, Clients, etc.) sera affiché */}
      <View style={styles.main}>
        {children}
      </View>
      
      {/* ===== PIED DE PAGE (FOOTER) ===== */}
      <Footer onPageChange={onPageChange} />
    </View>
  );
};

// =================================================================
// ==                           STYLES                            ==
// =================================================================
const styles = StyleSheet.create({
  // --- Structure du Layout ---
  layout: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'space-between', // Pousse le footer en bas de l'écran
  },
  main: {
    flex: 1, // Le contenu principal prend tout l'espace vertical disponible
  },
  
  // --- En-tête (Header) ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  logo: { 
    backgroundColor: '#3B82F6', 
    padding: 8, 
    borderRadius: 6 
  },
  logoText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginLeft: 12 
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  userInfo: { 
    fontSize: 14, 
    color: '#6b7280', 
    fontWeight: '500' 
  },
  
  // --- Navigation Centrale ---
  nav: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1, 
    justifyContent: 'center' 
  },
  navButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8, 
    marginHorizontal: 4, 
    gap: 8 
  },
  navButtonActive: { 
    backgroundColor: '#3B82F6' 
  },
  navText: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#6b7280' 
  },
  navTextActive: { 
    color: 'white' 
  },
  
  // --- Boutons d'Action ---
  primaryButton: { 
    backgroundColor: '#3B82F6', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 6, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  primaryButtonText: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: '500' 
  },

  // --- Pied de Page (Footer) ---
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerLink: {
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerSeparator: {
    fontSize: 12,
    color: '#d1d5db',
  }
});

export default Layout;

