// components/OnboardingGuide.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from '../styles/globalStyles';
import SvgIcon from './SvgIcon';

const OnboardingGuide = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);

  // On définit ici les étapes de notre tutoriel
  const steps = [
    {
      title: 'Bienvenue sur Invoiz !',
      text: 'Créons ensemble votre première facture. Suivez ces quelques étapes simples pour commencer.',
      icon: 'invoices',
    },
    {
      title: 'Étape 1 : Créez un client',
      text: 'Avant de facturer, vous devez ajouter un client. Rendez-vous sur la page "Clients" pour en créer un.',
      icon: 'clients',
    },
    {
      title: 'Étape 2 : Créez une facture',
      text: 'Cliquez sur "Nouvelle facture" pour ouvrir le formulaire. Vous pourrez y sélectionner votre client et ajouter des produits.',
      icon: 'new-invoice',
    },
    {
      title: 'Vous êtes prêt !',
      text: 'Vous avez maintenant toutes les clés en main pour gérer votre facturation. Bon courage !',
      icon: 'check',
    },
  ];

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onFinish(); // Appelle la fonction pour fermer le guide
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  return (
    <Modal transparent={true} visible={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.onboardingModal}>
          <View style={styles.onboardingIconContainer}>
            <SvgIcon name={currentStep.icon} size={32} color="#3B82F6" />
          </View>
          <Text style={styles.onboardingTitle}>{currentStep.title}</Text>
          <Text style={styles.onboardingText}>{currentStep.text}</Text>

          <View style={styles.onboardingFooter}>
            <Text style={styles.onboardingStepCounter}>{`${stepIndex + 1} / ${steps.length}`}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryButtonText}>{isLastStep ? 'Terminer' : 'Suivant'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OnboardingGuide;