// components/ClientsPage.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import SvgIcon from './SvgIcon';
import Toast from './Toast';
import { useClientsContext } from '../contexts/ClientsContext';

const ClientsPage = ({ onPageChange, onViewClient }) => {
  const { clients, addClient, updateClient, deleteClient } = useClientsContext();

  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  // Nouvel état pour le chargement
  const [isSaving, setIsSaving] = useState(false);

  const showMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const filteredClients = clients.filter(client =>
    (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleAddNewClient = () => {
    setEditingClient(null);
    setClientForm({ name: '', email: '', phone: '', address: '' });
    setShowClientForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientForm({ name: client.name, email: client.email, phone: client.phone || '', address: client.address || '' });
    setShowClientForm(true);
  };

  // Fonction de sauvegarde mise à jour
  const handleSaveClient = async () => {
    if (!clientForm.name || !clientForm.email) {
      showMessage('Le nom et l\'email sont obligatoires');
      return;
    }
    setIsSaving(true);
    try {
      if (editingClient) {
        await updateClient(editingClient.id, { ...clientForm, createdAt: editingClient.createdAt });
        showMessage('Client modifié avec succès');
      } else {
        await addClient({ ...clientForm, createdAt: new Date().toISOString() });
        showMessage('Client ajouté avec succès');
      }
      setShowClientForm(false);
      setEditingClient(null);
    } catch (error) {
      console.error("Erreur de sauvegarde du client:", error);
      showMessage("La sauvegarde a échoué.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      showMessage('Client supprimé avec succès');
    }
    setShowDeleteConfirm(false);
    setClientToDelete(null);
  };

  return (
    <View style={styles.page}>
      {showToast && <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />}
      {showDeleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}><Text style={styles.modalTitle}>Supprimer le client</Text><Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer {clientToDelete?.name} ?</Text><View style={styles.modalActions}><TouchableOpacity style={styles.outlineButton} onPress={() => setShowDeleteConfirm(false)}><Text style={styles.outlineButtonText}>Annuler</Text></TouchableOpacity><TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#EF4444' }]} onPress={confirmDelete}><Text style={styles.primaryButtonText}>Supprimer</Text></TouchableOpacity></View></View>
        </View>
      )}
      <View style={styles.pageHeader}>
        <View><Text style={styles.title}>Clients</Text><Text style={styles.subtitle}>Gérez votre base de clients</Text></View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddNewClient}><SvgIcon name="plus" size={16} color="white" /><Text style={styles.primaryButtonText}>Nouveau client</Text></TouchableOpacity>
      </View>

      {showClientForm && (
        <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>{editingClient ? 'Modifier le client' : 'Nouveau client'}</Text>
                    <View style={styles.form}>
                        <Text style={styles.label}>Nom du client *</Text>
                        <TextInput style={styles.input} placeholder="Nom complet" value={clientForm.name} onChangeText={(text) => setClientForm({...clientForm, name: text})} />
                        <Text style={styles.label}>Email *</Text>
                        <TextInput style={styles.input} placeholder="email@exemple.com" value={clientForm.email} onChangeText={(text) => setClientForm({...clientForm, email: text})} keyboardType="email-address" autoCapitalize="none" />
                        <Text style={styles.label}>Téléphone</Text>
                        <TextInput style={styles.input} placeholder="01 23 45 67 89" value={clientForm.phone} onChangeText={(text) => setClientForm({...clientForm, phone: text})} keyboardType="phone-pad" />
                        <Text style={styles.label}>Adresse</Text>
                        <TextInput style={[styles.input, styles.textArea]} placeholder="Adresse complète" value={clientForm.address} onChangeText={(text) => setClientForm({...clientForm, address: text})} multiline numberOfLines={3} />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.outlineButton} onPress={() => setShowClientForm(false)} disabled={isSaving}><Text style={styles.outlineButtonText}>Annuler</Text></TouchableOpacity>
                            {/* BOUTON DE SAUVEGARDE MIS À JOUR */}
                            <TouchableOpacity style={[styles.primaryButton, isSaving && styles.buttonDisabled]} onPress={handleSaveClient} disabled={isSaving}>
                              {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.primaryButtonText}>{editingClient ? 'Modifier' : 'Ajouter'}</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
      )}

      <View style={styles.filters}><View style={styles.searchContainer}><SvgIcon name="search" size={18} color="#9ca3af" /><TextInput style={styles.searchInput} placeholder="Rechercher un client..." value={searchTerm} onChangeText={setSearchTerm} /></View></View>
      <ScrollView style={styles.clientList}>
        {filteredClients.length === 0 ? (
          <View style={styles.emptyState}>
            <SvgIcon name="clients" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>{clients.length === 0 ? 'Aucun client' : 'Aucun résultat'}</Text>
            {clients.length === 0 && <TouchableOpacity style={styles.primaryButton} onPress={handleAddNewClient}><Text style={styles.primaryButtonText}>Ajouter votre premier client</Text></TouchableOpacity>}
          </View>
        ) : (
          filteredClients.map(client => (
            <View key={client.id} style={styles.clientCard}>
              <TouchableOpacity style={styles.clientInfo} onPress={() => onViewClient(client)}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientEmail}>{client.email}</Text>
                {client.phone && <View style={styles.clientDetail}><SvgIcon name="user" size={14} color="#6b7280" /><Text style={styles.clientPhone}>{client.phone}</Text></View>}
                {client.address && <View style={styles.clientDetail}><SvgIcon name="home" size={14} color="#6b7280" /><Text style={styles.clientAddress}>{client.address}</Text></View>}
                {client.createdAt && <Text style={styles.clientSince}>Client depuis {new Date(client.createdAt).toLocaleDateString('fr-FR')}</Text>}
              </TouchableOpacity>
              <View style={styles.clientActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditClient(client)}><SvgIcon name="edit" size={16} color="#3B82F6" /></TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(client)}><SvgIcon name="trash" size={16} color="#EF4444" /></TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6b7280' },
  primaryButton: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 45 },
  primaryButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20 },
  modal: { backgroundColor: 'white', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 20, textAlign: 'center' },
  modalText: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: 'white' },
  textArea: { height: 80, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  outlineButton: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  outlineButtonText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  filters: { marginBottom: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, backgroundColor: 'white', gap: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  clientList: { flex: 1 },
  clientCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  clientEmail: { fontSize: 14, color: '#3B82F6', marginBottom: 8 },
  clientDetail: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  clientPhone: { fontSize: 12, color: '#6b7280' },
  clientAddress: { fontSize: 12, color: '#6b7280' },
  clientSince: { fontSize: 11, color: '#9ca3af', marginTop: 8 },
  clientActions: { flexDirection: 'row', gap: 8 },
  editButton: { padding: 8, borderRadius: 6, backgroundColor: '#f0f9ff' },
  deleteButton: { padding: 8, borderRadius: 6, backgroundColor: '#fef2f2' },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, color: '#6b7280', marginBottom: 16, textAlign: 'center', marginTop: 16 },
  buttonDisabled: { backgroundColor: '#93C5FD', opacity: 0.7 },
});

export default ClientsPage;

