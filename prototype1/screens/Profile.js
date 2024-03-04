import { Image, Text, View, Pressable, StyleSheet, Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ProfileScreen() {
  var secondary_bg_color = "#232323";

  // Account Modal
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  const [editedAccountName, setEditedAccountName] = useState("");
  const [editedAccountImageURL, setEditedAccountImageURL] = useState("");
  const [accountName, setAccountName] = useState("Maruf Rodjan");
  const [accountImageURL, setAccountImageURL] = useState("https://imgur.com/4OxZys5.jpg");

  const handleAccountPress = () => setAccountModalVisible(true);
  const closeAccountModal = () => setAccountModalVisible(false);
  const handleAccountSave = () => {
    // Check if editedAccountName is not empty, if empty, use current accountName
    const nameToSave = editedAccountName.trim() !== '' ? editedAccountName : accountName;

    // Check if editedAccountImageURL is not empty, if empty, use current accountImageURL
    const imageURLToSave = editedAccountImageURL.trim() !== '' ? editedAccountImageURL : accountImageURL;

    // Update the state variables with the values to save
    setAccountName(nameToSave);
    setAccountImageURL(imageURLToSave);

    // Save the data
    saveAccountData();

    // Close the modal
    closeAccountModal();
  };
  // Contact Details Modal
  const [isContactDetailsModalVisible, setContactDetailsModalVisible] = useState(false);
  const handleContactDetailsPress = () => setContactDetailsModalVisible(true);
  const closeContactDetailsModal = () => setContactDetailsModalVisible(false);
  const handleContactDetailsSave = () => {
    // Logic for saving Contact details
    // ...

    // Close the modal
    closeContactDetailsModal();
  };
  useEffect(() => {
    // laad de data via asycnstorage
    loadAccountData();
  }, []);

  const saveAccountData = async () => {
    try {
      // Check if editedAccountName is not empty, if empty, use current accountName
      const nameToSave = editedAccountName.trim() !== '' ? editedAccountName : accountName;

      // Check if editedAccountImageURL is not empty, if empty, use current accountImageURL
      const imageURLToSave = editedAccountImageURL.trim() !== '' ? editedAccountImageURL : accountImageURL;

      // Save the account data via AsyncStorage (later it will go through a database)
      await AsyncStorage.setItem('accountName', nameToSave);
      await AsyncStorage.setItem('accountImageURL', imageURLToSave);
    } catch (error) {
      console.error('Error saving account data:', error);
    }
  };

  const loadAccountData = async () => {
    try {
      // Load account data via AsyncStorage
      const savedAccountName = await AsyncStorage.getItem('accountName');
      const savedAccountImageURL = await AsyncStorage.getItem('accountImageURL');

      // Update the state with the loaded data if not null
      if (savedAccountName !== null) {
        setAccountName(savedAccountName);
      }

      if (savedAccountImageURL !== null) {
        setAccountImageURL(savedAccountImageURL);
      }
    } catch (error) {
      console.error('Error loading account data:', error);
    }
  };

  return (
    <View className="flex-1 bg-main_bg_color ">
      {/* Hier begint eerst de View bedoeld voor de gehele pagina (body) */}
      <View className="items-center mt-10">
        {/*Hier heb je dan een view die de tekst van profile netjes in het midden zet en profile plaats */}
        <Text className="text-wit mx-5 text-3xl">Profile</Text>
      </View>
      <View className="bg-secondary_bg_color flex flex-row my-8 mx-4 h-28 rounded-xl">
        {/* Hier hebben we dan de div die de persoons gegevens lat zien */}
        <Image
          className="m-3 w-20 h-20 rounded-full"
          source={{
            uri: accountImageURL,
          }}
        />
        <Text className="text-wit m-5 text-base flex-2">{accountName}</Text>
      </View>
      <Text className="text-profile-grijs mx-5 text-base -my-7">Account settings</Text>
      {/* zogenaamde div met account settings komt hieronder met zn eigen view*/}
      <View className="bg-secondary_bg_color my-8 mx-4 h-44 rounded-xl">
        <Pressable onPress={handleAccountPress} style={styles.wrapperCustom}>
          <Text style={styles.text}>Account</Text>
        </Pressable>
        <Modal visible={isAccountModalVisible} animationType="slide">
          <View className="flex-1 bg-main_bg_color">
            <Text className="text-wit text-xl m-5">Edit Details</Text>
            <View className="rounded-md bg-secondary_bg_color p-6 m-2">
              <Text className="text-wit text-xl">Gebruikersnaam:</Text>
              <TextInput
                placeholder="Naam..."
                placeholderTextColor="grey"
                value={editedAccountName}
                onChangeText={(text) => setEditedName(text)}
                style={styles.textInput}
              />
              <Text className="text-wit text-xl">Gebruikersnaam:</Text>
              <TextInput
                placeholder="Url..."
                placeholderTextColor="grey"
                value={editedAccountImageURL}
                onChangeText={(text) => setEditedImageURL(text)}
                style={styles.textInput}
              />
              <View className="my-10">
                {/* View zodat je wat margin met de top kan geven */}
                <Pressable onPress={handleAccountSave}>
                  <Text className="text-wit text-xl">Save</Text>
                </Pressable>
                <Pressable onPress={closeAccountModal}>
                  <Text className="text-wit text-xl my-5">Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Pressable
          onPress={handleContactDetailsPress}
          style={[styles.wrapperCustom,]}>
          <Text style={styles.text}>Contact details</Text>
        </Pressable>
        {/* nu komt de modal voor contact details */}
        <Modal visible={isContactDetailsModalVisible} animationType="slide">
          <View className="flex-1 bg-main_bg_color">
            <Text className="text-wit text-xl m-5">Edit Details</Text>
            {/* View zodat je wat margin met de top kan geven */}
            <Pressable onPress={closeContactDetailsModal}>
              <Text className="text-wit text-xl">Save</Text>
            </Pressable>
            <Pressable onPress={closeContactDetailsModal}>
              <Text className="text-wit text-xl my-5">Close</Text>
            </Pressable>
          </View>
        </Modal>
        <Pressable
          style={[styles.wrapperCustom,]}>
          <Text style={styles.text}>Security</Text>
        </Pressable>
      </View >
    </View >
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'white',
  },
  textInput: {
    fontSize: 16,
    color: 'white',
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 18,
    backgroundColor: '#232323',
  },
});