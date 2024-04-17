import { Image, Text, View, Pressable, Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [accountName, setAccountName] = useState("Maruf Rodjan");
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  const [editedAccountName, setEditedAccountName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image

  const handleAccountPress = () => setAccountModalVisible(true);
  const closeAccountModal = () => setAccountModalVisible(false);

  // Handle Account Save Functionality
  const handleAccountSave = async () => {
    try {
      const response = await fetch('http://192.168.178.123:8080/setName', { // ONTHOUD DE NUMMERS MOETEN JOUW IP ADRESS ZIJN VAN JE PC ZODRA CLLIENT EN SERVER RUNNEN OP JE LAPTOP/PC
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedAccountName }),
      });
      // Update the account name locally
      setAccountName(editedAccountName);
      // Close the modal
      closeAccountModal();
    } catch (error) {
      console.error('Error setting account name:', error);
    }
  };
  // Fetch account name from server when component mounts
  useEffect(() => {
    fetchAccountName();
  }, []);

  // Function to fetch account name from server
  const fetchAccountName = async () => {
    try {
      const response = await fetch('http://192.168.178.123:8080/getName'); // ONTHOUD DE NUMMERS MOETEN JOUW IP ADRESS ZIJN VAN JE PC ZODRA CLLIENT EN SERVER RUNNEN OP JE LAPTOP/PC
      const data = await response.json();
      // Update the account name state
      setAccountName(data.name);
    } catch (error) {
      console.error('Error fetching account name:', error);
    }
  };

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
  return (
    <View className={`flex-1 bg-main_bg_color`} style={{ paddingTop: insets.top }}>
      <View className="items-center mt-10">
        <Text className="text-wit mx-5 text-3xl">Profile</Text>
      </View>
      <View className="bg-secondary_bg_color flex flex-row my-8 mx-4 h-28 rounded-xl">
        <Image
          source={selectedImage ? { uri: selectedImage } : require('../images/Profile.jpg')}
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
              <Pressable className="rounded-lg p-5">
                <Text className="text-wit text-base">COMMING SOON!</Text>
              </Pressable>
              {selectedImage && (
                <Image source={{ uri: selectedImage }} className="w-28 h-28" />
              )}
              <View className="my-10">
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
      </View>
    </View>
  );
}
