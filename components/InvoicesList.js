// components/InvoicesList.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { styles } from '../styles/globalStyles';
import Toast from './Toast';
import SvgIcon from './SvgIcon';
import { useInvoicesContext } from '../contexts/InvoicesContext';
import { useCompanyProfileContext } from '../contexts/CompanyProfileContext';
import { generateInvoicePdf } from '../utils/pdfGenerator';

const InvoicesList = ({ onPageChange, onEditInvoice, onViewInvoice }) => {
  const { invoices, updateInvoice, deleteInvoice } = useInvoicesContext();
  const { profile } = useCompanyProfileContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const showMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };
  
  const statusPriority = { overdue: 1, pending: 2, draft: 3, paid: 4 };

  const filteredAndSortedInvoices = invoices
    .filter(invoice => {
      const invoiceNumber = invoice?.invoiceNumber || '';
      const clientName = invoice?.clientName || '';
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = invoiceNumber.toLowerCase().includes(searchTermLower) || clientName.toLowerCase().includes(searchTermLower);
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);

  const getStatusColor = (status) => ({ paid: '#10B981', pending: '#F59E0B', overdue: '#EF4444', draft: '#6B7280' }[status] || '#6B7280');
  const getStatusText = (status) => ({ paid: 'Payée', pending: 'En attente', overdue: 'En retard', draft: 'Brouillon' }[status] || status);

  const openStatusSelector = (invoice) => {
    setEditingInvoice(invoice);
    setIsStatusModalVisible(true);
  };

  const handleUpdateStatus = (newStatus) => {
    if (editingInvoice) updateInvoice(editingInvoice.id, { status: newStatus });
    setIsStatusModalVisible(false);
    setEditingInvoice(null);
  };

  const handleDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete.id);
      showMessage('Facture supprimée avec succès');
    }
    setShowDeleteConfirm(false);
    setInvoiceToDelete(null);
  };

  const handleDownloadPDF = (invoice) => {
    generateInvoicePdf(invoice, profile);
  };
  
  // LA FONCTION "ENVOYER" EST MAINTENANT MISE À JOUR
  const handleSendEmail = (invoice) => {
    if (!invoice.clientEmail) {
      Alert.alert("Adresse e-mail manquante", "Ce client n'a pas d'adresse e-mail enregistrée pour cette facture.");
      return;
    }

    // --- NOUVELLE LOGIQUE ---
    // Si la facture est un brouillon, on la met à jour en "en attente"
    if (invoice.status === 'draft') {
      updateInvoice(invoice.id, { status: 'pending' });
      showMessage(`Facture ${invoice.invoiceNumber} marquée comme envoyée.`);
    }
    // --- FIN DE LA NOUVELLE LOGIQUE ---

    const subject = `Facture ${invoice.invoiceNumber} de ${profile.name}`;
    const body = `Bonjour ${invoice.clientName},\n\nVeuillez trouver ci-joint votre facture N°${invoice.invoiceNumber} d'un montant de ${(invoice.total || 0).toFixed(2)} €.\n\nCordialement,\n${profile.name}`;
    const mailtoUrl = `mailto:${invoice.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl);
  };

  const handleMarkAsPaid = (invoice) => {
    updateInvoice(invoice.id, { status: 'paid', paidAt: new Date().toISOString() });
    showMessage(`Facture ${invoice.invoiceNumber} marquée comme payée.`);
  };

  return (
    <View style={styles.page}>
      {showToast && <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />}
      
      {isStatusModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.statusSelectorModal}>
            <Text style={styles.modalTitle}>Changer le statut</Text>
            {['draft', 'pending', 'paid', 'overdue'].map(status => (
              <TouchableOpacity key={status} style={styles.statusOption} onPress={() => handleUpdateStatus(status)}>
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]} />
                <Text style={styles.statusOptionText}>{getStatusText(status)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showDeleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Supprimer la facture</Text>
            <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer la facture {invoiceToDelete?.invoiceNumber} ?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setShowDeleteConfirm(false)}><Text style={styles.outlineButtonText}>Annuler</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#EF4444' }]} onPress={confirmDelete}><Text style={styles.primaryButtonText}>Supprimer</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.pageHeader}>
        <View><Text style={styles.title}>Factures</Text><Text style={styles.subtitle}>Gérez toutes vos factures</Text></View>
        <TouchableOpacity style={styles.primaryButton} onPress={onPageChange}><SvgIcon name="plus" size={16} color="white" /><Text style={styles.primaryButtonText}>Nouvelle facture</Text></TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <View style={styles.searchContainer}><SvgIcon name="search" size={18} color="#9ca3af" /><TextInput style={styles.searchInput} placeholder="Rechercher par numéro ou client..." value={searchTerm} onChangeText={setSearchTerm}/></View>
        <View style={styles.filterButtons}>
          {['all', 'draft', 'pending', 'paid', 'overdue'].map(status => (
            <TouchableOpacity key={status} style={[ styles.filterButton, statusFilter === status && styles.filterButtonActive ]} onPress={() => setStatusFilter(status)}>
              <Text style={[ styles.filterButtonText, statusFilter === status && styles.filterButtonTextActive ]}>{status === 'all' ? 'Tous' : getStatusText(status)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.invoiceList} keyboardShouldPersistTaps="handled">
        {filteredAndSortedInvoices.length > 0 ? (
          filteredAndSortedInvoices.map(invoice => (
            <View key={invoice.id} style={styles.invoiceCard}>
              <TouchableOpacity onPress={() => onViewInvoice(invoice)}>
                <View style={styles.invoiceHeader}>
                  <View style={styles.invoiceIcon}><SvgIcon name="invoices" size={20} color="#3B82F6" /></View>
                  <View style={styles.invoiceInfo}>
                    <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                    <Text style={styles.invoiceClient}>{invoice.clientName}</Text>
                  </View>
                </View>
                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceTotal}>{`${(invoice.total || 0).toFixed(2)} €`}</Text>
                  <TouchableOpacity onPress={() => openStatusSelector(invoice)}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(invoice.status)}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <View style={[styles.invoiceActions, { zIndex: 10 }]}>
                <TouchableOpacity style={styles.actionButton} onPress={() => onEditInvoice(invoice)}>
                  <SvgIcon name="edit" size={16} color="#374151" />
                  <Text style={styles.actionText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDownloadPDF(invoice)}>
                  <SvgIcon name="download" size={16} color="#374151" />
                  <Text style={styles.actionText}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleSendEmail(invoice)}>
                  <SvgIcon name="send" size={16} color="#374151" />
                  <Text style={styles.actionText}>Envoyer</Text>
                </TouchableOpacity>
                {invoice.status !== 'paid' && <TouchableOpacity style={styles.actionButton} onPress={() => handleMarkAsPaid(invoice)}>
                  <SvgIcon name="check" size={16} color="#10B981" />
                  <Text style={styles.actionText}>Payer</Text>
                </TouchableOpacity>}
                <TouchableOpacity style={[styles.actionButton, styles.deleteAction]} onPress={() => handleDelete(invoice)}>
                  <SvgIcon name="trash" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}><SvgIcon name="invoices" size={48} color="#9ca3af" /><Text style={styles.emptyText}>{invoices.length === 0 ? 'Aucune facture créée' : 'Aucun résultat'}</Text></View>
        )}
      </ScrollView>
    </View>
  );
};

export default InvoicesList;

