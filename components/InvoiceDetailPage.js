// components/InvoiceDetailPage.js

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import SvgIcon from './SvgIcon';
import { useCompanyProfileContext } from '../contexts/CompanyProfileContext';
import { useInvoicesContext } from '../contexts/InvoicesContext';
import { generateInvoicePdf } from '../utils/pdfGenerator';

// Helper pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const InvoiceDetailPage = ({ invoice, onPageChange, onEditInvoice }) => {
  const { profile } = useCompanyProfileContext();
  const { updateInvoice } = useInvoicesContext();

  if (!invoice) {
    return (
      <View style={styles.page}>
        <Text>Facture non trouvée.</Text>
        <TouchableOpacity onPress={() => onPageChange('invoices')}>
          <Text style={styles.link}>Retour à la liste</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status) => ({ paid: '#10B981', pending: '#F59E0B', overdue: '#EF4444', draft: '#6B7280' }[status] || '#6B7280');
  const getStatusText = (status) => ({ paid: 'Payée', pending: 'En attente', overdue: 'En retard', draft: 'Brouillon' }[status] || status);

  const handleDownloadPDF = () => {
    generateInvoicePdf(invoice, profile);
  };

  return (
    <ScrollView style={styles.page}>
      {/* --- En-tête avec les actions --- */}
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.outlineButton} onPress={() => onPageChange('invoices')}>
          <Text style={styles.outlineButtonText}>← Retour</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onEditInvoice(invoice)}>
            <SvgIcon name="edit" size={16} color="#374151" />
            <Text style={styles.actionText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadPDF}>
            <SvgIcon name="download" size={16} color="#374151" />
            <Text style={styles.actionText}>PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Contenu de la facture --- */}
      <View style={styles.invoiceContent}>
        <View style={styles.invoiceHeader}>
          <View>
            <Text style={styles.invoiceTitle}>{invoice.invoiceNumber}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
              <Text style={styles.statusText}>{getStatusText(invoice.status)}</Text>
            </View>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{profile.name}</Text>
            <Text style={styles.companyAddress}>{profile.address}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>FACTURÉ À</Text>
            <Text style={styles.infoValue}>{invoice.clientName}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>DATE DE FACTURATION</Text>
            <Text style={styles.infoValue}>{formatDate(invoice.createdAt)}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>DATE D'ÉCHÉANCE</Text>
            <Text style={styles.infoValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
        </View>

        {/* Tableau des produits */}
        <View style={styles.itemsTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 3 }]}>Description</Text>
            <Text style={styles.headerText}>Qté</Text>
            <Text style={styles.headerText}>Prix U.</Text>
            <Text style={[styles.headerText, { textAlign: 'right' }]}>Total</Text>
          </View>
          {(invoice.lineItems || []).map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.rowText, { flex: 3 }]}>{item.description}</Text>
              <Text style={styles.rowText}>{item.quantity}</Text>
              <Text style={styles.rowText}>{Number(item.price || 0).toFixed(2)}€</Text>
              <Text style={[styles.rowText, { textAlign: 'right' }]}>{((item.quantity || 0) * (item.price || 0)).toFixed(2)}€</Text>
            </View>
          ))}
        </View>
        
        {/* Totaux */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
            <Text style={styles.totalValue}>{(invoice.subtotal || 0).toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA (20%)</Text>
            <Text style={styles.totalValue}>{(invoice.tax || 0).toFixed(2)} €</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total à payer</Text>
            <Text style={styles.grandTotalValue}>{(invoice.total || 0).toFixed(2)} €</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  outlineButton: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  outlineButtonText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, backgroundColor: '#E5E7EB', borderRadius: 8 },
  actionText: { color: '#374151', fontWeight: '500' },
  invoiceContent: { backgroundColor: 'white', borderRadius: 12, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  invoiceTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  companyInfo: { alignItems: 'flex-end' },
  companyName: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  companyAddress: { fontSize: 14, color: '#6b7280' },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB', paddingVertical: 20 },
  infoBlock: {},
  infoLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  itemsTable: { marginBottom: 30 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F9FAFB', padding: 10, borderRadius: 8, marginBottom: 8 },
  headerText: { flex: 1, fontWeight: '600', color: '#6b7280' },
  tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rowText: { flex: 1, color: '#1f2937' },
  totalsContainer: { alignSelf: 'flex-end', width: '50%', maxWidth: 250 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { color: '#6b7280' },
  totalValue: { color: '#1f2937', fontWeight: '500' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  grandTotalLabel: { color: '#1f2937', fontWeight: 'bold' },
  grandTotalValue: { color: '#1f2937', fontWeight: 'bold', fontSize: 18 },
  link: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },
});

export default InvoiceDetailPage;
