import React from 'react';
import { View } from 'react-native';

const SvgIcon = ({ name, size = 24, color = '#1f2937' }) => {
  const iconStyle = {
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const renderIcon = () => {
    switch (name) {
      
      // ==========================================================
      // ==           NOUVELLE ICÔNE "CLIENTS" PROFESSIONNELLE     ==
      // ==========================================================
      case 'clients':
        return (
          <View style={iconStyle}>
            {/* Silhouette principale (au centre) */}
            <View style={{ position: 'absolute', alignItems: 'center', zIndex: 2 }}>
              <View style={{ width: size * 0.35, height: size * 0.35, borderRadius: size * 0.175, backgroundColor: color }} />
              <View style={{ width: size * 0.6, height: size * 0.35, backgroundColor: color, marginTop: size * 0.05, borderTopLeftRadius: size * 0.3, borderTopRightRadius: size * 0.3 }} />
            </View>
            {/* Silhouette de gauche (arrière-plan) */}
            <View style={{ position: 'absolute', left: 0, bottom: size * 0.05, opacity: 0.6, zIndex: 1, alignItems: 'center' }}>
              <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, backgroundColor: color }} />
              <View style={{ width: size * 0.4, height: size * 0.3, backgroundColor: color, marginTop: size * 0.05, borderTopLeftRadius: size * 0.2, borderTopRightRadius: size * 0.2 }} />
            </View>
            {/* Silhouette de droite (arrière-plan) */}
            <View style={{ position: 'absolute', right: 0, bottom: size * 0.05, opacity: 0.6, zIndex: 1, alignItems: 'center' }}>
              <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, backgroundColor: color }} />
              <View style={{ width: size * 0.4, height: size * 0.3, backgroundColor: color, marginTop: size * 0.05, borderTopLeftRadius: size * 0.2, borderTopRightRadius: size * 0.2 }} />
            </View>
          </View>
        );
      // ==========================================================

      // ... (le reste des icônes ne change pas)
      case 'dashboard':
        return (
          <View style={iconStyle}>
            <View style={{ flexDirection: 'row', gap: 2 }}><View style={{ width: 8, height: 8, backgroundColor: color }} /><View style={{ width: 8, height: 8, backgroundColor: color }} /></View>
            <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}><View style={{ width: 8, height: 8, backgroundColor: color }} /><View style={{ width: 8, height: 8, backgroundColor: color }} /></View>
          </View>
        );
      case 'invoices':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.7, height: size * 0.9, borderWidth: 1.5, borderColor: color, borderRadius: 2 }}>
              <View style={{ height: 3, backgroundColor: color, margin: 2 }} />
              <View style={{ height: 2, backgroundColor: color, marginHorizontal: 2, marginTop: 1 }} />
              <View style={{ height: 2, backgroundColor: color, marginHorizontal: 2, marginTop: 1 }} />
            </View>
          </View>
        );
      case 'new-invoice':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.8, height: 2, backgroundColor: color }} />
            <View style={{ width: 2, height: size * 0.8, backgroundColor: color, position: 'absolute' }} />
          </View>
        );
      case 'search':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.6, height: size * 0.6, borderRadius: size * 0.3, borderWidth: 1.5, borderColor: color }} />
            <View style={{ width: size * 0.3, height: 2, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', right: 2, bottom: 2 }} />
          </View>
        );
      case 'plus':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.8, height: 2, backgroundColor: color }} />
            <View style={{ width: 2, height: size * 0.8, backgroundColor: color, position: 'absolute' }} />
          </View>
        );
      case 'download':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.7, height: size * 0.5, borderLeftWidth: 1.5, borderRightWidth: 1.5, borderBottomWidth: 1.5, borderColor: color }} />
            <View style={{ width: 2, height: size * 0.4, backgroundColor: color, position: 'absolute', top: 0 }} />
          </View>
        );
      case 'send':
        return (
          <View style={iconStyle}>
            <View style={{ width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: size * 0.4, borderRightWidth: 0, borderBottomWidth: size * 0.2, borderTopWidth: size * 0.2, borderLeftColor: color, borderRightColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent', transform: [{ rotate: '30deg' }] }} />
          </View>
        );
      case 'edit':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.8, height: 2, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, position: 'absolute', right: 2, top: 2 }} />
          </View>
        );
      case 'trash':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.7, height: size * 0.5, borderWidth: 1.5, borderColor: color, borderTopWidth: 0 }} />
            <View style={{ width: size * 0.3, height: 2, backgroundColor: color, position: 'absolute', top: 0 }} />
          </View>
        );
      case 'check':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.3, height: 2, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', left: 4, top: 10 }} />
            <View style={{ width: size * 0.6, height: 2, backgroundColor: color, transform: [{ rotate: '-45deg' }], position: 'absolute', left: 6, top: 8 }} />
          </View>
        );
      case 'user':
        return (
          <View style={iconStyle}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2, backgroundColor: color }} />
              <View style={{ width: size * 0.7, height: size * 0.45, backgroundColor: color, marginTop: size * 0.05, borderTopLeftRadius: size * 0.1, borderTopRightRadius: size * 0.1 }} />
            </View>
          </View>
        );
      case 'home':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.8, height: size * 0.6, backgroundColor: color }} />
            <View style={{ width: size * 0.3, height: size * 0.3, backgroundColor: color, position: 'absolute', top: -size * 0.15, left: size * 0.25 }} />
          </View>
        );
      case 'logout':
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.6, height: size * 0.8, borderWidth: 1.5, borderColor: color }} />
            <View style={{ width: size * 0.3, height: 2, backgroundColor: color, position: 'absolute', right: 0, top: size * 0.4 }} />
          </View>
        );
      default:
        return (
          <View style={iconStyle}>
            <View style={{ width: size * 0.8, height: 2, backgroundColor: color }} />
          </View>
        );
    }
  };

  return renderIcon();
};

export default SvgIcon;