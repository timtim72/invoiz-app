// components/ClientDetailPage.js

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import SvgIcon from './SvgIcon';
import { useInvoicesContext } from '../contexts/InvoicesContext';

const ClientDetailPage = ({ client, onPageChange }) => {
  const { invoices } = useInvoicesContext();

  // Sécurité : si aucun client n'est trouvé
  if (!client) {
    return (
      <View style={styles.page}>
        <Text>Client non trouvé.</Text>
        <TouchableOpacity onPress={() => onPageChange('clients')}>
          <Text style={styles.link}>Retour à la liste des clients</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // On filtre toutes les factures pour ne garder que celles de ce client
  const clientInvoices = invoices.filter(invoice => invoice.clientName === client.name);
  const totalBilled = clientInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPaid = clientInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0);

  const getStatusColor = (status) => ({ paid: '#10B981', pending: '#F59E0B', overdue: '#EF4444', draft: '#6B7280' }[status] || '#6B7280');
  const getStatusText = (status) => ({ paid: 'Payée', pending: 'En attente', overdue: 'En retard', draft: 'Brouillon' }[status] || status);

  return (
    <ScrollView style={styles.page}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>{client.name}</Text>
          <Text style={styles.subtitle}>{client.email}</Text>
        </View>
        <TouchableOpacity style={styles.outlineButton} onPress={() => onPageChange('clients')}>
          <Text style={styles.outlineButtonText}>← Retour aux clients</Text>
        </TouchableOpacity>
      </View>

      {/* Carte d'informations du client */}
      <View style={styles.clientDetailsCard}>
        <View style={styles.detailRow}>
          <SvgIcon name="user" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{client.phone || 'Aucun téléphone'}</Text>
        </View>
        <View style={styles.detailRow}>
          <SvgIcon name="home" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{client.address || 'Aucune adresse'}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Facturé</Text>
            <Text style={styles.statValue}>{totalBilled.toFixed(2)} €</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Encaissé</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{totalPaid.toFixed(2)} €</Text>
          </View>
        </View>
      </View>

      {/* Historique des factures */}
      <Text style={styles.sectionTitle}>Historique des factures</Text>
      {clientInvoices.length > 0 ? (
        clientInvoices.map(invoice => (
          <View key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
              <Text style={styles.invoiceDate}>
                {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.invoiceAmount}>
              <Text style={styles.invoiceTotal}>{(invoice.total || 0).toFixed(2)} €</Text>
              <Text style={[styles.invoiceStatus, { color: getStatusColor(invoice.status) }]}>
                {getStatusText(invoice.status)}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <SvgIcon name="invoices" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>Aucune facture pour ce client.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  subtitle: { fontSize: 16, color: '#3B82F6' },
  outlineButton: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  outlineButtonText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  clientDetailsCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 32 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  detailText: { fontSize: 16, color: '#374151' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 16, marginTop: 8 },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#1f2937', marginBottom: 16 },
  invoiceCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  invoiceInfo: {},
  invoiceNumber: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  invoiceDate: { fontSize: 14, color: '#6b7280' },
  invoiceAmount: { alignItems: 'flex-end' },
  invoiceTotal: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  invoiceStatus: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 48, backgroundColor: 'white', borderRadius: 12 },
  emptyText: { fontSize: 16, color: '#6b7280', marginTop: 16 },
  link: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },
});

export default ClientDetailPage;
