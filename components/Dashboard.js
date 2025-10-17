import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import SvgIcon from './SvgIcon';
import { useAuthContext } from '../contexts/AuthContext';
import { useInvoicesContext } from '../contexts/InvoicesContext';

const Dashboard = ({ onPageChange, onViewMonthDetails }) => {
  const { currentUser } = useAuthContext();
  const { invoices } = useInvoicesContext();

  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

  const stats = {
    totalInvoices: invoices.length,
    paidAmount: paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    pendingAmount: pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    overdueCount: overdueInvoices.length
  };
  
  const recentInvoices = invoices.slice(0, 3);
  
  const getMonthlyRevenue = () => {
    const monthlyData = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = 0;
    }

    paidInvoices.forEach(invoice => {
      if (invoice.createdAt) {
        const invoiceDate = new Date(invoice.createdAt);
        if (invoiceDate >= sixMonthsAgo) {
          const monthKey = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyData[monthKey] !== undefined) {
            monthlyData[monthKey] += invoice.total || 0;
          }
        }
      }
    });
    
    return Object.entries(monthlyData).map(([key, value]) => ({
      month: new Date(key + '-02').toLocaleString('fr-FR', { month: 'short' }).replace('.', ''),
      monthFullName: new Date(key + '-02').toLocaleString('fr-FR', { month: 'long', year: 'numeric' }),
      revenue: value,
      monthKey: key,
    }));
  };

  const revenueData = getMonthlyRevenue();
  const actualMaxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
  const maxRevenue = Math.ceil(actualMaxRevenue / 1000) * 1000 || 1000;

  const getStatusColor = (status) => ({ paid: '#10B981', pending: '#F59E0B', overdue: '#EF4444', draft: '#6B7280' }[status] || '#6B7280');
  const getStatusText = (status) => ({ paid: 'Payée', pending: 'En attente', overdue: 'En retard', draft: 'Brouillon' }[status] || status);

  return (
    <ScrollView style={styles.page}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Tableau de bord</Text>
          <Text style={styles.subtitle}>Bienvenue, {currentUser?.email}</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => onPageChange('new-invoice')}>
          <SvgIcon name="plus" size={16} color="white" />
          <Text style={styles.primaryButtonText}>Nouvelle facture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}><SvgIcon name="invoices" size={24} color="#3B82F6" /></View><View><Text style={styles.statLabel}>Total factures</Text><Text style={styles.statNumber}>{stats.totalInvoices}</Text></View></View>
        <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: '#F0FDF4' }]}><SvgIcon name="check" size={24} color="#10B981" /></View><View><Text style={styles.statLabel}>Montant encaissé</Text><Text style={styles.statNumber}>{stats.paidAmount.toFixed(2)} €</Text></View></View>
        <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: '#FFFBEB' }]}><SvgIcon name="invoices" size={24} color="#F59E0B" /></View><View><Text style={styles.statLabel}>En attente</Text><Text style={styles.statNumber}>{stats.pendingAmount.toFixed(2)} €</Text></View></View>
        <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: '#FEF2F2' }]}><SvgIcon name="invoices" size={24} color="#EF4444" /></View><View><Text style={styles.statLabel}>En retard</Text><Text style={styles.statNumber}>{stats.overdueCount}</Text></View></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenus mensuels (6 derniers mois)</Text>
        <View style={styles.chartContainer}>
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>{`${maxRevenue}€`}</Text>
            <Text style={styles.yAxisLabel}>0€</Text>
          </View>
          {revenueData.map((data, index) => (
            <TouchableOpacity key={index} style={styles.barWrapper} onPress={() => onViewMonthDetails(data)}>
              <View style={[styles.bar, { height: `${(data.revenue / maxRevenue) * 100}%` }]} />
              <Text style={styles.barLabel}>{data.month}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Factures récentes</Text>
            <TouchableOpacity onPress={() => onPageChange('invoices')}><Text style={styles.link}>Voir toutes</Text></TouchableOpacity>
        </View>
        {recentInvoices.length > 0 ? (
          <View style={styles.invoiceList}>
            {recentInvoices.map(invoice => (
              <View key={invoice.id} style={styles.invoiceCard}>
                <View style={styles.invoiceHeader}>
                  <View style={styles.invoiceIcon}><SvgIcon name="invoices" size={20} color="#3B82F6" /></View>
                  <View style={styles.invoiceInfo}>
                    <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                    <Text style={styles.invoiceClient}>{invoice.clientName}</Text>
                  </View>
                </View>
                <View style={styles.invoiceAmount}>
                  <Text style={styles.invoiceTotal}>{(invoice.total || 0).toFixed(2)} €</Text>
                  <Text style={[styles.invoiceStatus, { color: getStatusColor(invoice.status) }]}>{getStatusText(invoice.status)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <SvgIcon name="invoices" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>Aucune facture créée</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => onPageChange('new-invoice')}>
              <Text style={styles.primaryButtonText}>Créer votre première facture</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6b7280' },
  primaryButton: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  primaryButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: 'white', padding: 20, borderRadius: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statIcon: { padding: 12, borderRadius: 8, marginRight: 12 },
  statLabel: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#1f2937' },
  link: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },
  invoiceList: { gap: 12 },
  invoiceCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
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
  chartContainer: { backgroundColor: 'white', borderRadius: 12, paddingVertical: 20, paddingRight: 20, marginTop: 16, flexDirection: 'row', alignItems: 'flex-end', height: 220, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, paddingLeft: 50, gap: 12 },
  yAxis: { position: 'absolute', left: 15, top: 20, bottom: 40, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 5 },
  yAxisLabel: { fontSize: 12, color: '#9ca3af' },
  barWrapper: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: '40%', backgroundColor: '#3B82F6', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabel: { marginTop: 8, fontSize: 12, color: '#6b7280' },
});

export default Dashboard;