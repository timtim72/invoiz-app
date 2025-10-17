// components/MonthlyInvoicesPage.js

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import SvgIcon from './SvgIcon';
import { useInvoicesContext } from '../contexts/InvoicesContext';

const MonthlyInvoicesPage = ({ monthData, onPageChange }) => {
  const { invoices } = useInvoicesContext();
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');

  // --- LOGIQUE DU SÉLECTEUR DE DATE ---
  const [selectedDate, setSelectedDate] = useState({
    year: new Date(monthData.monthKey + '-02').getFullYear(),
    month: new Date(monthData.monthKey + '-02').getMonth(), // 0 = Janvier, 11 = Décembre
  });
  const [pickerDate, setPickerDate] = useState(selectedDate);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const availableYears = useMemo(() => {
    const years = new Set(paidInvoices.map(inv => inv.createdAt ? new Date(inv.createdAt).getFullYear() : null));
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).filter(Boolean).sort((a, b) => b - a);
  }, [paidInvoices]);

  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const applyDateChange = () => {
    setSelectedDate(pickerDate);
    setIsPickerVisible(false);
  };

  // --- FILTRAGE DES FACTURES ---
  const monthlyInvoices = useMemo(() => {
    return paidInvoices.filter(invoice => {
      if (!invoice.createdAt) return false;
      const invoiceDate = new Date(invoice.createdAt);
      return invoiceDate.getFullYear() === selectedDate.year && invoiceDate.getMonth() === selectedDate.month;
    });
  }, [paidInvoices, selectedDate]);

  const totalRevenue = monthlyInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

  const getStatusColor = (status) => ({ paid: '#10B981', pending: '#F59E0B', overdue: '#EF4444', draft: '#6B7280' }[status] || '#6B7280');
  const getStatusText = (status) => ({ paid: 'Payée', pending: 'En attente', overdue: 'En retard', draft: 'Brouillon' }[status] || status);

  return (
    <View style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={{ flex: 1 }}>
          {/* LE BOUTON SÉLECTEUR DE DATE REMPLACE LE TITRE */}
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setIsPickerVisible(true)}>
            <Text style={styles.datePickerText}>{`${months[selectedDate.month]} ${selectedDate.year}`}</Text>
            <SvgIcon name="download" size={16} color="#3B82F6" />
          </TouchableOpacity>
          <Text style={styles.subtitle}>Total encaissé : {totalRevenue.toFixed(2)} €</Text>
        </View>
        <TouchableOpacity style={styles.outlineButton} onPress={() => onPageChange('dashboard')}>
          <Text style={styles.outlineButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {monthlyInvoices.length > 0 ? (
          monthlyInvoices.map(invoice => (
            <View key={invoice.id} style={styles.invoiceCard}>
              <View style={styles.invoiceHeader}><View style={styles.invoiceIcon}><SvgIcon name="invoices" size={20} color="#3B82F6" /></View><View style={styles.invoiceInfo}><Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text><Text style={styles.invoiceClient}>{invoice.clientName}</Text></View></View>
              <View style={styles.invoiceAmount}><Text style={styles.invoiceTotal}>{(invoice.total || 0).toFixed(2)} €</Text><Text style={[styles.invoiceStatus, { color: getStatusColor(invoice.status) }]}>{getStatusText(invoice.status)}</Text></View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}><SvgIcon name="invoices" size={48} color="#9ca3af" /><Text style={styles.emptyText}>Aucune facture payée pour ce mois.</Text></View>
        )}
      </ScrollView>

      {/* LA MODALE POUR SÉLECTIONNER LE MOIS ET L'ANNÉE */}
      <Modal visible={isPickerVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsPickerVisible(false)}>
          <View style={styles.datePickerModal} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Sélectionner une date</Text>
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.pickerColumn}>
                {months.map((month, index) => (
                  <TouchableOpacity key={month} onPress={() => setPickerDate({ ...pickerDate, month: index })}>
                    <Text style={[styles.pickerItem, pickerDate.month === index && styles.pickerItemActive]}>{month}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn}>
                {availableYears.map(year => (
                  <TouchableOpacity key={year} onPress={() => setPickerDate({ ...pickerDate, year: year })}>
                    <Text style={[styles.pickerItem, pickerDate.year === year && styles.pickerItemActive]}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.primaryButtonModal} onPress={applyDateChange}>
              <Text style={styles.primaryButtonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 8 },
  outlineButton: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  outlineButtonText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  invoiceCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, marginBottom: 12 },
  invoiceHeader: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  invoiceIcon: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 6, marginRight: 12 },
  invoiceInfo: { flex: 1 },
  invoiceNumber: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  invoiceClient: { fontSize: 14, color: '#6b7280' },
  invoiceAmount: { alignItems: 'flex-end' },
  invoiceTotal: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  invoiceStatus: { fontSize: 12, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, color: '#6b7280', marginBottom: 16, textAlign: 'center', marginTop: 16 },
  datePickerButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignSelf: 'flex-start' },
  datePickerText: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  datePickerModal: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 20, textAlign: 'center' },
  pickerContainer: { flexDirection: 'row', height: 200, marginBottom: 20 },
  pickerColumn: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  pickerItem: { fontSize: 18, textAlign: 'center', paddingVertical: 10 },
  pickerItemActive: { color: '#3B82F6', fontWeight: 'bold' },
  primaryButtonModal: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default MonthlyInvoicesPage;