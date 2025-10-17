// components/InvoiceNew.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import { styles } from '../styles/globalStyles';
import { useClientsContext } from '../contexts/ClientsContext';
import { useInvoicesContext } from '../contexts/InvoicesContext';
// On importe le contexte du profil pour accéder au compteur
import { useCompanyProfileContext } from '../contexts/CompanyProfileContext';

const LineItemCard = ({ item, index, onItemChange, onRemoveItem }) => (
  <View style={styles.itemCard}>
    <TouchableOpacity onPress={() => onRemoveItem(index)} style={styles.deleteButton}><Text style={styles.deleteButtonText}>✕</Text></TouchableOpacity>
    <View style={styles.fieldContainer}><Text style={styles.label}>Description</Text><TextInput style={styles.input} placeholder="Nom du produit ou service" value={item.description} onChangeText={(text) => onItemChange(index, 'description', text)} /></View>
    <View style={{ flexDirection: 'row' }}>
      <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}><Text style={styles.label}>Quantité</Text><TextInput style={styles.input} placeholder="1" value={String(item.quantity)} onChangeText={(text) => onItemChange(index, 'quantity', text)} keyboardType="numeric" /></View>
      <View style={[styles.fieldContainer, { flex: 1.5 }]}><Text style={styles.label}>Prix U. (€)</Text><TextInput style={styles.input} placeholder="150.00" value={String(item.price)} onChangeText={(text) => onItemChange(index, 'price', text)} keyboardType="numeric" /></View>
    </View>
  </View>
);

const InvoiceNew = ({ onPageChange, invoiceToEdit }) => {
  const { clients } = useClientsContext();
  const { addInvoice, updateInvoice } = useInvoicesContext();
  // On récupère la nouvelle fonction pour obtenir le numéro de facture
  const { getNextInvoiceNumber } = useCompanyProfileContext();

  const isEditMode = !!invoiceToEdit;

  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(''); // Commence vide
  const [lineItems, setLineItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const TVA_RATE = 0.20;
  const [paymentTerms, setPaymentTerms] = useState(30);

  // EFFET POUR GÉNÉRER LE NUMÉRO DE FACTURE
  useEffect(() => {
    // Si on est en mode édition, on utilise le numéro existant
    if (isEditMode && invoiceToEdit) {
      setInvoiceNumber(invoiceToEdit.invoiceNumber);
      setLineItems(invoiceToEdit.lineItems || [{ description: '', quantity: 1, price: 0 }]);
      setClientSearchQuery(invoiceToEdit.clientName);
      const existingClient = clients.find(c => c.name === invoiceToEdit.clientName);
      if (existingClient) setSelectedClient(existingClient);
      setIsClientSelected(true);
    } else {
      // Si on crée une nouvelle facture, on demande le prochain numéro
      const fetchInvoiceNumber = async () => {
        // On s'assure que la fonction existe avant de l'appeler
        if (getNextInvoiceNumber) {
          const nextNumber = await getNextInvoiceNumber();
          if (nextNumber) {
            setInvoiceNumber(nextNumber);
          }
        }
      };
      fetchInvoiceNumber();
    }
  }, [invoiceToEdit, isEditMode, clients, getNextInvoiceNumber]);


  const handleClientSearch = (query) => {
    setClientSearchQuery(query);
    setIsClientSelected(false);
    setSelectedClient(null);
    if (query) setFilteredClients(clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase())));
    else setFilteredClients([]);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setClientSearchQuery(client.name);
    setFilteredClients([]);
    setIsClientSelected(true);
  };

  useEffect(() => {
    const currentSubtotal = lineItems.reduce((acc, item) => (acc + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)), 0);
    const currentTax = currentSubtotal * TVA_RATE;
    const currentTotal = currentSubtotal + currentTax;
    setSubtotal(currentSubtotal); setTax(currentTax); setTotal(currentTotal);
  }, [lineItems]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...lineItems];
    newItems[index][field] = value;
    setLineItems(newItems);
  };
  const handleAddItem = () => setLineItems([...lineItems, { description: '', quantity: 1, price: 0 }]);
  const handleRemoveItem = (index) => { if (lineItems.length > 1) setLineItems(lineItems.filter((_, i) => i !== index)); };
  
  const handleSaveInvoice = () => {
    if (!isClientSelected || !selectedClient) {
      Alert.alert('Erreur', 'Veuillez sélectionner un client dans la liste.');
      return;
    }

    const createdAt = isEditMode && invoiceToEdit.createdAt ? new Date(invoiceToEdit.createdAt) : new Date();
    const dueDate = new Date(createdAt);
    dueDate.setDate(dueDate.getDate() + paymentTerms);

    const invoiceData = { 
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      invoiceNumber, 
      lineItems, 
      subtotal, 
      tax, 
      total,
      dueDate: dueDate.toISOString(),
    };

    if (isEditMode) {
      updateInvoice(invoiceToEdit.id, invoiceData);
      Alert.alert('Succès', 'Facture modifiée avec succès !');
    } else {
      addInvoice({ ...invoiceData, status: 'draft', createdAt: createdAt.toISOString() });
      Alert.alert('Succès', 'Facture créée avec succès !');
    }
    
    onPageChange('invoices');
  };

  const paymentTermOptions = [15, 30, 45, 60];

  return (
    <ScrollView style={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.pageHeader}>
        <Text style={styles.title}>{isEditMode ? 'Modifier la Facture' : 'Nouvelle Facture'}</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Numéro de facture</Text>
          {/* Le champ n'est plus modifiable par l'utilisateur */}
          <TextInput style={[styles.input, { backgroundColor: '#E5E7EB' }]} value={invoiceNumber} editable={false} />
        </View>
        <View style={styles.searchWrapper}>
          <Text style={styles.label}>Rechercher un client</Text>
          <TextInput style={styles.input} placeholder="Tapez pour rechercher..." value={clientSearchQuery} onChangeText={handleClientSearch} />
          {filteredClients.length > 0 && !isClientSelected && (
            <FlatList
              style={styles.searchResultsContainer}
              data={filteredClients}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.searchResultItem} onPress={() => handleSelectClient(item)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Délai de paiement</Text>
          <View style={styles.paymentTermsContainer}>
            {paymentTermOptions.map(days => (
              <TouchableOpacity
                key={days}
                style={[styles.termButton, paymentTerms === days && styles.termButtonActive]}
                onPress={() => setPaymentTerms(days)}
              >
                <Text style={[styles.termButtonText, paymentTerms === days && styles.termButtonTextActive]}>{`Net ${days} jours`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={[styles.label, { marginTop: 16, fontSize: 16 }]}>Produits / Services</Text>
        {lineItems.map((item, index) => (
          <LineItemCard key={index} item={item} index={index} onItemChange={handleItemChange} onRemoveItem={handleRemoveItem} />
        ))}
        <TouchableOpacity style={styles.secondaryButton} onPress={handleAddItem}>
          <Text style={styles.secondaryButtonText}>+ Ajouter un produit</Text>
        </TouchableOpacity>
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}><Text style={styles.totalText}>Sous-total :</Text><Text style={styles.totalAmount}>{subtotal.toFixed(2)} €</Text></View>
          <View style={styles.totalRow}><Text style={styles.totalText}>TVA ({(TVA_RATE * 100).toFixed(0)}%) :</Text><Text style={styles.totalAmount}>{tax.toFixed(2)} €</Text></View>
          <View style={[styles.totalRow, styles.grandTotalRow]}><Text style={styles.grandTotalText}>TOTAL :</Text><Text style={styles.grandTotalAmount}>{total.toFixed(2)} €</Text></View>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveInvoice}>
          <Text style={styles.primaryButtonText}>{isEditMode ? 'Enregistrer les modifications' : 'Enregistrer la facture'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default InvoiceNew;

