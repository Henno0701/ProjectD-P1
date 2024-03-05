import { Image, Text, View, Pressable, Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  // Create safe area space
  const insets = useSafeAreaInsets();

  // place holder info
  const [accountName, setAccountName] = useState("Maruf Rodjan");
  const [selectedImage, setSelectedImage] = useState(null);
  // !--- BEGIN ACCOUNT MODAL ---!
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  const [editedAccountName, setEditedAccountName] = useState("");
  const handleAccountPress = () => setAccountModalVisible(true);
  const closeAccountModal = () => setAccountModalVisible(false);
  // upload image functie
  const uploadimage = async (mode) => {
    try {
      let result = {};
      if (mode === "gallery") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission not granted for MEDIA_LIBRARY.');
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission not granted for CAMERA.');
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.Front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      console.log('ImagePicker result:', result);

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        // Update the state with the selected image URI
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  // opslaan van de account data
  const saveAccountData = async (nameToSave, selectedImage) => {
    try {
      console.log('Saving account data...');

      // Save the image to Expo's MediaLibrary
      if (selectedImage) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission not granted for MEDIA_LIBRARY.');
          return;
        }

        const asset = await MediaLibrary.createAssetAsync(selectedImage);

        // You can customize the album name here
        const albumName = 'MyAppImages';

        // Ensure the album exists
        const album = await MediaLibrary.getAlbumAsync(albumName);
        if (album === null) {
          await MediaLibrary.createAlbumAsync(albumName, asset);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        console.log('Image saved to MediaLibrary:', asset);
      } else {
        console.error('No selected image to save.');
      }

      // Save other account data...
    } catch (error) {
      console.error('Error saving account data:', error);
    }
  };
  // handle functie voor het opslaan van de account data
  const handleAccountSave = async () => {
    try {
      console.log('Entered handleAccountSave');
      const nameToSave = editedAccountName.trim() !== '' ? editedAccountName : accountName;
      console.log('nameToSave:', nameToSave);

      // Update the accountName state if editedAccountName is not empty
      if (editedAccountName.trim() !== '') {
        setAccountName(editedAccountName.trim());
      }

      // Update the image if there is a selected image
      if (selectedImage) {
        // Save or update the image as needed
        // Example: await saveOrUpdateImage(selectedImage);
      }

      // Close the modal
      closeAccountModal();
    } catch (error) {
      console.error('Error handling account save:', error);
    }
  };
  // !--- END ACCOUNT MODAL ---!

  // !! FEEDBACK!!!
  // safe earea context van stations.js overnemen en dan
  // modal background moet secondary_bg_color zijn
  // na kijken gpt heeft fouten ergens in de code achtergelaten
  // margin top van profile weg halen
  //  !! FEEDBACK!!!

  // !--- BEGIN CONTACT DETAILS MODAL ---!
  const [isContactDetailsModalVisible, setContactDetailsModalVisible] = useState(false);
  const handleContactDetailsPress = () => setContactDetailsModalVisible(true);
  const closeContactDetailsModal = () => setContactDetailsModalVisible(false);
  const handleContactDetailsSave = () => {
    // hier komt dan de logica indien er iets voor de contact details pagina komt
    // Close the modal
    closeContactDetailsModal();
  };
  // !--- END CONTACT DETAILS MODAL ---!

  // !--- BEGIN SECURITY MODAL ---!
  const [isSecurityModalVisible, setSecurityModalVisible] = useState(false);
  const handleSecurityPress = () => setSecurityModalVisible(true);
  const closeSecurityModal = () => setSecurityModalVisible(false);
  const handleSecuritySave = () => {
    // hier komt dan de logica indien er iets voor de contact details pagina komt
    // Close the modal
    closeSecurityModal();
  };
  // !--- END SECURITY MODAL ---!

  // USE EFFECT
  useEffect(() => {
    // Load account data from AsyncStorage
    loadAccountData();

    // kijk of de user toestemming heeft gegeven voor de camera of luibrary
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access the photo library denied');
      }
    };
    requestPermission();
  }, []);
  // USE EFFECT

  // !--- ASYNC METHODS ---!
  const loadAccountData = async () => {
    try {
      // Laat de data via asyncstorage
      const savedAccountName = await AsyncStorage.getItem('accountName');

      // indien het niet null is laat het dan zien
      if (savedAccountName !== null) {
        setEditedAccountName(savedAccountName);
      }
    } catch (error) {
      console.error('Error loading account data:', error);
    }
  };
  // !--- END ASYNC METHODS ---!


  return (
    <View className={`flex-1 bg-main_bg_color`} style={{ paddingTop: insets.top }}>
      {/* Hier begint eerst de View bedoeld voor de gehele pagina (body) */}
      <View className="items-center mt-10">
        {/*Hier heb je dan een view die de tekst van profile netjes in het midden zet en profile plaats */}
        <Text className="text-wit mx-5 text-3xl">Profile</Text>
      </View>
      <View className="bg-secondary_bg_color flex flex-row my-8 mx-4 h-28 rounded-xl">
        {/* Hier hebben we dan de div die de persoons gegevens lat zien */}
        <Image
          source={selectedImage ? { uri: selectedImage } : require('../images/Profile.jpg')} // indien de image niet bestaat placeholder
          className="m-3 w-20 h-20 rounded-full"
        />
        <Text className="text-wit m-5 text-base flex-2">{accountName}</Text>
      </View>
      <Text className="text-profile-grijs mx-5 text-base -my-7">Account settings</Text>
      <View className="bg-secondary_bg_color my-8 mx-4 h-58 rounded-xl">
        {/*!--- BEGIN ACOUNT SETTINGS MODAL ---!*/}
        <Pressable onPress={handleAccountPress} className="rounded-lg p-5">
          <Text className="text-wit text-base">Account</Text>
        </Pressable>
        <Modal visible={isAccountModalVisible} animationType="slide">
          <View className="flex-1 bg-secondary_bg_color" style={{ paddingTop: insets.top }}>
            <Text className="text-wit text-xl m-5">Edit Details</Text>
            <View className="rounded-md bg-secondary_bg_color p-6 m-2">
              <Text className="text-wit text-xl">Gebruikersnaam:</Text>
              <TextInput
                placeholder="Naam..."
                placeholderTextColor="grey"
                value={editedAccountName}
                onChangeText={(text) => setEditedAccountName(text)}
                className="text-wit text-base"
              />
              <Text className="text-wit text-xl">Foto:</Text>
              <Pressable className="rounded-lg p-5" onPress={() => uploadimage()}>
                <Text className="text-wit text-base">Pick Image</Text>
              </Pressable>
              {selectedImage && (
                <Image source={{ uri: selectedImage }} className="w-28 h-28" />
              )}
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
        {/*!--- END ACOUNT SETTINGS MODAL ---!*/}
        {/*!--- BEGIN CONTACT DETAILS MODAL ---!*/}
        <Pressable
          onPress={handleContactDetailsPress}
          className="rounded-lg p-5">
          <Text className="text-wit text-base">Contact details</Text>
        </Pressable>
        {/* nu komt de modal voor contact details */}
        <Modal visible={isContactDetailsModalVisible} animationType="slide">
          <View className="flex-1 bg-main_bg_color" style={{ paddingTop: insets.top }}>
            <Text className="text-wit text-xl m-5">Contact gegevens</Text>
            {/* View zodat je wat margin met de top kan geven */}
            <Pressable onPress={closeContactDetailsModal}>
              <Text className="text-wit text-xl">Save</Text>
            </Pressable>
            <Pressable onPress={closeContactDetailsModal}>
              <Text className="text-wit text-xl my-5">Close</Text>
            </Pressable>
          </View>
        </Modal>
        {/*!--- END CONTACT DETAILS MODAL ---!*/}
        {/*!--- BEGIN SECURITY MODAL ---!*/}
        <Pressable
          onPress={handleSecurityPress}
          className="rounded-lg p-5">
          <Text className="text-wit text-base">Security</Text>
        </Pressable>
        {/* nu komt de modal voor contact details */}
        <Modal visible={isSecurityModalVisible} animationType="slide" style={{ paddingTop: insets.top }}>
          <View className="flex-1 bg-main_bg_color">
            <Text className="text-wit text-xl m-5">Security</Text>
            {/* View zodat je wat margin met de top kan geven */}
            <Pressable onPress={closeSecurityModal}>
              <Text className="text-wit text-xl">Save</Text>
            </Pressable>
            <Pressable onPress={closeSecurityModal}>
              <Text className="text-wit text-xl my-5">Close</Text>
            </Pressable>
          </View>
        </Modal>
        {/*!--- END SECURITY MODAL ---!*/}
      </View >
    </View >
  );
}