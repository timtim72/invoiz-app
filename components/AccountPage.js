// components/AccountPage.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { styles } from '../styles/globalStyles';
import SvgIcon from './SvgIcon';
import { useAuthContext } from '../contexts/AuthContext';
import { useCompanyProfileContext } from '../contexts/CompanyProfileContext';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AccountPage = ({ onPageChange }) => {
  const { currentUser, sendPasswordResetEmail, logout } = useAuthContext();
  const { profile, updateProfile } = useCompanyProfileContext();

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState(profile);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormState(profile);
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleLogoUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && currentUser) {
      setIsUploading(true);
      setUploadProgress(0);
      const uri = result.assets[0].uri;
      
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `logos/${currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        }, 
        (error) => {
          console.error("Erreur lors de l'envoi du logo:", error);
          Alert.alert("Erreur", "Le logo n'a pas pu être envoyé.");
          setIsUploading(false);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            handleInputChange('logo', downloadURL);
            Alert.alert("Succès", "Logo téléchargé avec succès !");
            setIsUploading(false);
          });
        }
      );
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formState);
      Alert.alert("Profil sauvegardé", "Vos informations ont été mises à jour avec succès.");
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur de sauvegarde du profil:", error);
      Alert.alert("Erreur", "La sauvegarde a échoué.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Réinitialiser le mot de passe",
      `Un e-mail de réinitialisation va être envoyé à ${currentUser.email}. Confirmer ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Envoyer", 
          onPress: async () => {
            try {
              await sendPasswordResetEmail(currentUser.email);
              Alert.alert("E-mail envoyé !", "Veuillez consulter votre boîte de réception pour réinitialiser votre mot de passe.");
            } catch (error) {
              console.error(error);
              Alert.alert("Erreur", "Une erreur est survenue. L'e-mail n'a pas pu être envoyé.");
            }
          }
        }
      ]
    );
  };

  const handleContact = () => {
    Linking.openURL('mailto:timeosantos71@gmail.com?subject=Support App Facturation');
  };

  return (
    <ScrollView style={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>{isEditing ? "Modifier le Profil" : "Mon Compte"}</Text>
          <Text style={styles.subtitle}>{isEditing ? "Mettez à jour vos informations" : "Gérez vos informations et préférences"}</Text>
        </View>
      </View>

      {isEditing ? (
        <View>
          <TouchableOpacity style={[styles.outlineButton, { alignSelf: 'flex-start', marginBottom: 24 }]} onPress={() => setIsEditing(false)}>
            <Text style={styles.outlineButtonText}>← Retour</Text>
          </TouchableOpacity>
          <View style={styles.accountCard}>
            <View style={styles.form}>
              <Text style={styles.label}>Nom de l'entreprise</Text>
              <TextInput style={styles.input} value={formState.name} onChangeText={(text) => handleInputChange('name', text)} />
              <Text style={styles.label}>Adresse</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={formState.address} onChangeText={(text) => handleInputChange('address', text)} multiline />
              <Text style={styles.label}>Logo de l'entreprise</Text>
              {isUploading ? (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>Envoi en cours... {uploadProgress}%</Text>
                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${uploadProgress}%` }]} />
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <TouchableOpacity style={styles.outlineButton} onPress={handleLogoUpload}>
                    <Text style={styles.outlineButtonText}>Choisir une image</Text>
                  </TouchableOpacity>
                  {formState.logo && <Image source={{ uri: formState.logo }} style={styles.logoPreview} />}
                </View>
              )}
              <TouchableOpacity style={[styles.primaryButton, { marginTop: 20 }, isSaving && styles.buttonDisabled]} onPress={handleSaveProfile} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.primaryButtonText}>Enregistrer le profil</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.userInfoHeader}>
            <Text style={styles.userInfoLabel}>Connecté en tant que</Text>
            <Text style={styles.userInfoEmail}>{currentUser?.email}</Text>
          </View>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.accountCard}>
            <TouchableOpacity style={styles.accountRow} onPress={() => setIsEditing(true)}>
              <SvgIcon name="edit" size={20} color="#6b7280" />
              <Text style={styles.accountText}>Modifier le profil de l'entreprise</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Gestion du Compte</Text>
          <View style={styles.accountCard}>
            <TouchableOpacity style={styles.accountRow} onPress={handleChangePassword}>
              <SvgIcon name="user" size={20} color="#6b7280" />
              <Text style={styles.accountText}>Changer mon mot de passe</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Données</Text>
          <View style={styles.accountCard}>
            <TouchableOpacity style={styles.accountRow} onPress={() => onPageChange('trash')}>
              <SvgIcon name="trash" size={20} color="#6b7280" />
              <Text style={styles.accountText}>Corbeille</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.accountCard}>
            <TouchableOpacity style={styles.accountRow} onPress={handleContact}>
              <SvgIcon name="send" size={20} color="#6b7280" />
              <Text style={styles.accountText}>Contacter le support</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default AccountPage;

