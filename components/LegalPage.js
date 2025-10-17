import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const LegalPage = ({ onPageChange }) => {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Mentions Légales</Text>
        <TouchableOpacity style={styles.outlineButton} onPress={() => onPageChange('dashboard')}>
          <Text style={styles.outlineButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.legalContent}>
        <Text style={styles.legalSectionTitle}>1. Éditeur de l'application</Text>
        <Text style={styles.legalText}>
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, il est précisé aux utilisateurs de l'application Invoiz l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
          {'\n\n'}
          <Text style={{ fontWeight: 'bold' }}>Raison Sociale :</Text> [Invoiz-app]
          {'\n'}
          <Text style={{ fontWeight: 'bold' }}>Statut juridique :</Text> [micro-entreprise]
          {'\n'}
          <Text style={{ fontWeight: 'bold' }}>Adresse :</Text> [Hameau de premine]
          {'\n'}
          <Text style={{ fontWeight: 'bold' }}>Adresse e-mail :</Text> [timeosantos71@gmail.com]
          {'\n'}
          <Text style={{ fontWeight: 'bold' }}>Numéro SIRET :</Text> [SIRET]
        </Text>

        <Text style={styles.legalSectionTitle}>2. Directeur de la publication</Text>
        <Text style={styles.legalText}>
          Le directeur de la publication est [Timeo SANTOS].
        </Text>
        
        <Text style={styles.legalSectionTitle}>3. Hébergement</Text>
        <Text style={styles.legalText}>
          L'application Invoiz et ses données sont hébergées par Google Firebase, un service fourni par Google Ireland Limited.
          {'\n'}
          Siège social : Gordon House, Barrow Street, Dublin 4, Irlande.
        </Text>

        <Text style={styles.legalSectionTitle}>4. Propriété intellectuelle</Text>
        <Text style={styles.legalText}>
          Tous les éléments de l'application Invoiz, qu'ils soient visuels ou logiciels (textes, images, graphismes, logo, icônes, code source), sont la propriété exclusive de [Nom de votre entreprise ou Votre Nom Complet] et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
          {'\n\n'}
          Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments de l'application, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
        </Text>
        
        <Text style={styles.legalSectionTitle}>5. Avertissement</Text>
        <Text style={styles.legalText}>
          Les informations contenues dans ce document sont fournies à titre indicatif et ne sauraient engager la responsabilité de l'éditeur. Pour des mentions légales complètes et adaptées à votre situation, il est recommandé de consulter un professionnel du droit.
        </Text>
      </View>
    </ScrollView>
  );
};

// ... (les styles ne changent pas)
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

export default LegalPage;

