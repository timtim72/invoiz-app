import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <View style={[styles.toast, styles[`toast${type}`]]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  toastsuccess: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  toasterror: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  toastText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Toast;