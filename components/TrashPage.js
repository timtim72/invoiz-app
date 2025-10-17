// components/TrashPage.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../styles/globalStyles';
import SvgIcon from './SvgIcon';
import { useInvoicesContext } from '../contexts/InvoicesContext';
import { useClientsContext } from '../contexts/ClientsContext';

const TrashPage = ({ onPageChange }) => {
  const { 
    trashedInvoices, 
    restoreInvoice, 
    permanentlyDeleteAllTrashed: clearInvoices, 
    permanentlyDeleteInvoice 
  } = useInvoicesContext();
  
  const { 
    trashedClients, 
    restoreClient, 
    permanentlyDeleteAllTrashed: clearClients, 
    permanentlyDeleteClient 
  } = useClientsContext();

  const [view, setView] = useState('invoices');
  const [selectedItems, setSelectedItems] = useState([]);
  
  // NOUVEL ÉTAT pour gérer notre propre fenêtre de confirmation
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const toggleSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleRestoreSelected = () => {
    const restoreAction = view === 'invoices' ? restoreInvoice : restoreClient;
    selectedItems.forEach(id => restoreAction(id));
    setSelectedItems([]);
  };

  // 1. Ouvre notre fenêtre de confirmation
  const handleClearTrash = () => {
    setShowClearConfirm(true);
  };
  
  // 2. Exécute l'action après confirmation
  const confirmClearTrash = () => {
    if (view === 'invoices') {
      clearInvoices();
    } else {
      clearClients();
    }
    setSelectedItems([]);
    setShowClearConfirm(false);
  };
  
  const handlePermanentDelete = (item) => {
    // La suppression unitaire avec Alert.alert fonctionne, on la garde pour l'instant
    // Si elle pose problème, on la remplacera aussi par une modale.
    const itemType = view === 'invoices' ? 'la facture' : 'le client';
    const itemName = item.invoiceNumber || item.name;

    Alert.alert(
      "Suppression définitive",
      `Êtes-vous sûr de vouloir supprimer définitivement ${itemType} "${itemName}" ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: 'destructive',
          onPress: () => {
            if (view === 'invoices') permanentlyDeleteInvoice(item.id);
            else permanentlyDeleteClient(item.id);
          }
        }
      ]
    );
  };
  
  const currentData = view === 'invoices' ? trashedInvoices : trashedClients;

  return (
    <View style={styles.page}>
      {/* NOTRE NOUVELLE FENÊTRE DE CONFIRMATION */}
      {showClearConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Vider la corbeille</Text>
            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer définitivement tous les {view === 'invoices' ? 'factures' : 'clients'} ? Cette action est irréversible.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setShowClearConfirm(false)}>
                <Text style={styles.outlineButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#EF4444' }]} onPress={confirmClearTrash}>
                <Text style={styles.primaryButtonText}>Vider la corbeille</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Corbeille</Text>
          <Text style={styles.subtitle}>Gérez les éléments supprimés</Text>
        </View>
        <TouchableOpacity onPress={() => onPageChange('account')}>
          <Text style={styles.link}>Retour au compte</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.trashTabsContainer}>
        <TouchableOpacity style={[styles.tabButton, view === 'invoices' && styles.tabButtonActive]} onPress={() => { setView('invoices'); setSelectedItems([]); }}>
          <Text style={[styles.tabText, view === 'invoices' && styles.tabTextActive]}>Factures</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, view === 'clients' && styles.tabButtonActive]} onPress={() => { setView('clients'); setSelectedItems([]); }}>
          <Text style={[styles.tabText, view === 'clients' && styles.tabTextActive]}>Clients</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.trashActions}>
        {selectedItems.length > 0 && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleRestoreSelected}>
            <Text style={styles.primaryButtonText}>Restaurer la sélection ({selectedItems.length})</Text>
          </TouchableOpacity>
        )}
        {currentData && currentData.length > 0 && (
           <TouchableOpacity style={styles.clearButton} onPress={handleClearTrash}>
            <Text style={styles.clearButtonText}>Vider la corbeille</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView keyboardShouldPersistTaps="handled">
        {currentData && currentData.length > 0 ? (
          currentData.map(item => {
            const isSelected = selectedItems.includes(item.id);
            if (!item) return null;
            
            return (
              // NOUVELLE APPARENCE DE LA CARTE
              <View key={item.id} style={[styles.trashCard, isSelected && styles.selectedItemCard]}>
                <TouchableOpacity style={styles.trashInfoWrapper} onPress={() => toggleSelection(item.id)}>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <SvgIcon name="check" size={16} color="white" />}
                  </View>
                  <View style={styles.trashInfo}>
                    {view === 'invoices' ? (
                      <>
                        <Text style={styles.trashInvoiceNumber}>{item.invoiceNumber || 'Facture sans numéro'}</Text>
                        <Text style={styles.trashClientInfo}>{`Client: ${item.clientName || 'N/A'} - Total: ${(item.total || 0).toFixed(2)} €`}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.trashInvoiceNumber}>{item.name || 'Client sans nom'}</Text>
                        <Text style={styles.trashClientInfo}>{item.email || 'Email non renseigné'}</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
                
                <View style={styles.trashCardActions}>
                  <TouchableOpacity style={styles.restoreButton} onPress={() => (view === 'invoices' ? restoreInvoice(item.id) : restoreClient(item.id))}>
                    <Text style={styles.restoreButtonText}>Restaurer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deletePermanentlyButton} onPress={() => handlePermanentDelete(item)}>
                    <SvgIcon name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })
        ) : (
          <View style={styles.emptyState}>
            <SvgIcon name="trash" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>La corbeille est vide</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TrashPage;

