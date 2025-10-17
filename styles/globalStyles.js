import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // =================================================================
  // == STYLES GLOBAUX & MISE EN PAGE
  // =================================================================
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  page: { flex: 1, padding: 20 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6b7280' },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, color: '#6b7280', marginBottom: 16, textAlign: 'center', marginTop: 16 },
  link: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },

  // =================================================================
  // == BOUTONS
  // =================================================================
  primaryButton: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 45 },
  primaryButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginBottom: 24, marginTop: 8 },
  secondaryButtonText: { color: '#1F2937', fontWeight: '600' },
  outlineButton: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  outlineButtonText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  buttonDisabled: { backgroundColor: '#93C5FD', opacity: 0.7 },

  // =================================================================
  // == FORMULAIRES & MODALES
  // =================================================================
  form: { paddingBottom: 20 },
  fieldContainer: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#1f2937' },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20 },
  modal: { backgroundColor: 'white', padding: 24, borderRadius: 12, width: '100%', maxWidth: 500 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 20, textAlign: 'center' },
  modalText: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },

  // =================================================================
  // == PAGE CRÉATION FACTURE (InvoiceNew.js)
  // =================================================================
  itemCard: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 16, marginBottom: 16, position: 'relative' },
  deleteButton: { position: 'absolute', top: 8, right: 8, padding: 8, zIndex: 1 },
  deleteButtonText: { color: '#9CA3AF', fontSize: 20, fontWeight: 'bold' },
  // LA CORRECTION FINALE POUR LE MENU DÉROULANT
  searchWrapper: {
    position: 'relative', // Le parent doit être 'relative'
    zIndex: 10,           // On force ce conteneur à être au-dessus des éléments suivants
  },
  searchResultsContainer: {
    position: 'absolute', // L'enfant est 'absolute' pour flotter
    top: '100%',          // Se positionne juste en dessous de son parent
    marginTop: 4,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 160,
    zIndex: 1000,         // S'assure qu'il est au-dessus de 'searchWrapper'
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchResultItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  totalsSection: { marginTop: 16, marginBottom: 24, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalText: { color: '#6B7280' },
  totalAmount: { fontWeight: '500', color: '#1f2937' },
  grandTotalRow: { borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 8, marginTop: 4 },
  grandTotalText: { fontWeight: 'bold', fontSize: 16, color: '#1f2937' },
  grandTotalAmount: { fontWeight: 'bold', fontSize: 16, color: '#1f2937' },
  paymentTermsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  termButton: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, alignItems: 'center' },
  termButtonActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  termButtonText: { color: '#374151', fontWeight: '600' },
  termButtonTextActive: { color: 'white' },
  
  // =================================================================
  // == PAGE LISTE FACTURES (InvoicesList.js)
  // =================================================================
  filters: { marginBottom: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, backgroundColor: 'white', gap: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1f2937' },
  filterButtons: { flexDirection: 'row', marginTop: 12, gap: 8 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#E5E7EB' },
  filterButtonActive: { backgroundColor: '#3B82F6' },
  filterButtonText: { color: '#374151', fontWeight: '500' },
  filterButtonTextActive: { color: 'white' },
  invoiceList: { flex: 1 },
  invoiceCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, flexDirection: 'column' },
  invoiceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  invoiceIcon: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 6, marginRight: 12 },
  invoiceInfo: { flex: 1 },
  invoiceNumber: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  invoiceClient: { fontSize: 14, color: '#6b7280' },
  invoiceDate: { fontSize: 12, color: '#9ca3af' },
  invoicePaidDate: { fontSize: 12, color: '#10B981', fontWeight: '500' },
  invoiceDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 16 },
  invoiceTotal: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  invoiceActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12, zIndex: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  actionText: { color: '#374151', fontWeight: '500' },
  deleteAction: {},

  // =================================================================
  // == PAGE COMPTE (AccountPage.js)
  // =================================================================
  userInfoHeader: { alignItems: 'center', marginBottom: 32, padding: 20, backgroundColor: 'white', borderRadius: 12 },
  userInfoLabel: { color: '#6b7280', fontSize: 14 },
  userInfoEmail: { color: '#1f2937', fontSize: 16, fontWeight: '600', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 12, textTransform: 'uppercase' },
  accountCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  accountRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, gap: 16 },
  accountText: { fontSize: 16, fontWeight: '500', color: '#1f2937' },
  logoutButton: { marginTop: 16, padding: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#FEF2F2' },
  logoutButtonText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  accountTextDanger: { color: '#EF4444' },

  // =================================================================
  // == PAGE CORBEILLE (TrashPage.js)
  // =================================================================
  trashCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  trashInfoWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16, paddingRight: 16 },
  trashInfo: { flex: 1 },
  trashInvoiceNumber: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  trashClientInfo: { fontSize: 14, color: '#6b7280' },
  trashCardActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  restoreButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 8 },
  restoreButtonText: { color: '#3B82F6', fontWeight: '600' },
  deletePermanentlyButton: { padding: 8, backgroundColor: '#FEF2F2', borderRadius: 6 },
  trashTabsContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#E5E7EB', borderRadius: 8, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 6 },
  tabButtonActive: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { textAlign: 'center', fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#3B82F6' },
  trashActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, minHeight: 44 },
  clearButton: { paddingVertical: 8, paddingHorizontal: 12 },
  clearButtonText: { color: '#EF4444', fontWeight: '500' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  selectedItemCard: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6', borderWidth: 1 },
  
  // =================================================================
  // == MENU SÉLECTION STATUT
  // =================================================================
  statusSelectorModal: { backgroundColor: 'white', borderRadius: 12, padding: 16, width: '80%', maxWidth: 300, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 10 },
  statusOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  statusIndicator: { width: 12, height: 12, borderRadius: 6 },
  statusOptionText: { fontSize: 16, color: '#1f2937', fontWeight: '500' },
  
  // =================================================================
  // == Nouveaux styles pour la progression du logo
  // =================================================================
  logoPreview: { width: 60, height: 60, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  progressContainer: { paddingVertical: 12 },
  progressText: { textAlign: 'center', color: '#6b7280', marginBottom: 8, fontWeight: '500' },
  progressBarBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 4 },
});

