import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const PrivacyPage = ({ onPageChange }) => {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Politique de Confidentialité</Text>
        <TouchableOpacity style={styles.outlineButton} onPress={() => onPageChange('dashboard')}>
          <Text style={styles.outlineButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.legalContent}>
        <Text style={styles.legalText}>Dernière mise à jour : 16 octobre 2025</Text>

        <Text style={styles.legalSectionTitle}>1. Collecte des données personnelles</Text>
        <Text style={styles.legalText}>
          Dans le cadre de l'utilisation de l'application Invoiz, nous collectons les données suivantes :
          {'\n'}• Lors de l'inscription : votre adresse e-mail.
          {'\n'}• Lors de l'utilisation : les données que vous créez volontairement (profil d'entreprise, clients, factures).
          {'\n\n'}
          Ces données sont stockées de manière sécurisée sur les serveurs de notre sous-traitant Google Firebase et sont associées à votre compte utilisateur unique.
        </Text>

        <Text style={styles.legalSectionTitle}>2. Utilisation de vos données</Text>
        <Text style={styles.legalText}>
          Vos données personnelles sont utilisées exclusivement pour les finalités suivantes :
          {'\n'}• Gérer votre accès et l'utilisation de l'application.
          {'\n'}• Sauvegarder et synchroniser vos données (clients, factures) sur votre compte.
          {'\n'}• Communiquer avec vous pour des raisons de support ou de sécurité (ex: réinitialisation de mot de passe).
          {'\n\n'}
          Nous nous engageons à ne jamais vendre, louer ou partager vos données personnelles avec des tiers à des fins commerciales.
        </Text>

        <Text style={styles.legalSectionTitle}>3. Sécurité des données</Text>
        <Text style={styles.legalText}>
          Toutes les données que vous entrez dans l'application sont chiffrées lors de leur transit entre votre appareil et les serveurs de Google Firebase. Nous mettons en œuvre des mesures de sécurité techniques pour protéger vos données contre l'accès, la modification ou la destruction non autorisés.
        </Text>

        <Text style={styles.legalSectionTitle}>4. Vos droits</Text>
        <Text style={styles.legalText}>
          Conformément à la réglementation en vigueur (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à l'adresse suivante : [timeosantos71@gmail.com].
        </Text>
        
        <Text style={styles.legalSectionTitle}>5. Avertissement</Text>
        <Text style={styles.legalText}>
          Ce document est un modèle. Pour une politique de confidentialité complète et conforme, il est indispensable de consulter un professionnel ou un service juridique spécialisé.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  outlineButton: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  outlineButtonText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  legalContent: { backgroundColor: 'white', padding: 20, borderRadius: 12 },
  legalSectionTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 8, marginTop: 16 },
  legalText: { fontSize: 16, color: '#6b7280', lineHeight: 24 },
});

export default PrivacyPage;