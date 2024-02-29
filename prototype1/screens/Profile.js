import { Image, Text, View, Pressable, StyleSheet, Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ProfileScreen() {

  // deze data moet wel uit de backend komen
  var secondary_bg_color = "#232323";
  const [isModalVisible, setModalVisible] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedImageURL, setEditedImageURL] = useState("");
  const [Name, setName] = useState("Maruf Rodjan");
  const [foto, setFoto] = useState("https://imgur.com/4OxZys5.jpg");

  const handlePress = () => {
    // Show the modal
    setModalVisible(true);
  };

  const closeModal = () => {
    // Close the modal
    setModalVisible(false);
  };
  const handleSave = () => {
    // Update the state variables or variables holding your data
    setName(editedName);
    setFoto(editedImageURL);

    // Save the edited details to AsyncStorage (if needed)
    saveData();

    // Close the modal after saving
    closeModal();
  };

  useEffect(() => {
    // Load data from AsyncStorage when the component mounts
    loadData();
  }, []);

  const saveData = async () => {
    try {
      // Save the edited data to AsyncStorage
      await AsyncStorage.setItem('name', editedName);
      await AsyncStorage.setItem('imageURL', editedImageURL);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadData = async () => {
    try {
      // Load data from AsyncStorage
      const savedName = await AsyncStorage.getItem('name');
      const savedImageURL = await AsyncStorage.getItem('imageURL');

      // Set the loaded data to state
      if (savedName !== null) {
        setName(savedName);
      }

      if (savedImageURL !== null) {
        setFoto(savedImageURL);
      }
    } catch (error) {
      console.error('Error loading data:', error);
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
            uri: foto,
          }}
        />
        <Text className="text-wit m-5 text-base flex-2">{Name}</Text>
      </View>
      <Text className="text-profile-grijs mx-5 text-base -my-7">Account settings</Text>
      {/* zogenaamde div met account settings komt hieronder met zn eigen view*/}
      <View className="bg-secondary_bg_color my-8 mx-4 h-44 rounded-xl">
        <Pressable onPress={handlePress} style={styles.wrapperCustom}>
          <Text style={styles.text}>Account</Text>
        </Pressable>
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.container}>
            <Text>Edit Details</Text>
            <TextInput
              placeholder="Enter Name"
              value={editedName}
              onChangeText={(text) => setEditedName(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter Image URL"
              value={editedImageURL}
              onChangeText={(text) => setEditedImageURL(text)}
              style={styles.input}
            />
            <Pressable onPress={handleSave} style={styles.wrapperCustom}>
              <Text style={styles.text}>Save</Text>
            </Pressable>
            <Pressable onPress={closeModal} style={styles.wrapperCustom}>
              <Text style={styles.text}>Close</Text>
            </Pressable>
          </View>
        </Modal>
        <Pressable
          style={[styles.wrapperCustom,]}>
          <Text style={styles.text}>Contact details</Text>
        </Pressable>
        <Pressable
          style={[styles.wrapperCustom,]}>
          <Text style={styles.text}>Security</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'white',
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 18,
    backgroundColor: '#232323',
  },
});