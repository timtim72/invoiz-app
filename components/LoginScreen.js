import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import SvgIcon from './SvgIcon';
import Toast from './Toast';

const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('demo@invoice.com');
  const [password, setPassword] = useState('demo123');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    try {
      const success = await onLogin(email, password);
      if (!success) {
        showMessage('Email ou mot de passe incorrect');
      }
    } catch (error) {
      showMessage('Une erreur est survenue');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      {showToast && <Toast message={toastMessage} type="error" onClose={() => setShowToast(false)} />}

      <View style={styles.loginCard}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <SvgIcon name="invoices" size={32} color="white" />
          </View>
          {/* LE NOM A ÉTÉ CHANGÉ ICI */}
          <Text style={styles.appTitle}>Invoiz</Text>
          <Text style={styles.appSubtitle}>Gestion de facturation professionnelle</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.switchAuth}>
          {/* ET ICI AUSSI POUR LA COHÉRENCE */}
          <Text style={styles.switchText}>Nouveau sur Invoiz ? </Text>
          <TouchableOpacity onPress={onSwitchToRegister} disabled={loading}>
            <Text style={styles.switchLink}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20 },
  loginCard: { backgroundColor: 'white', padding: 32, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8, width: '100%', maxWidth: 400 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, marginBottom: 16 },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  appSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: 'white' },
  primaryButton: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8, minHeight: 53 },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  switchAuth: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  switchText: { color: '#6b7280', fontSize: 14 },
  switchLink: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },
});

export default LoginScreen;