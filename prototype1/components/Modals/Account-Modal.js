import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import Modal from '../Modal';

function AccountModalScreen({ navigation }) {
  const [AccountName, setAccountName] = useState("");
  const [AccountPassword, setAccountPassword] = useState("");
  const [ID, setID] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async (key) => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setID(value);
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };

    getData('ID');
  }, []);

  const handleAccountSave = async () => {
    if (!AccountName && !AccountPassword) {
      Alert.alert('Error', 'You must provide either a username or password to update.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://${IP}:8080/Updateuserself`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ID.toString(), name: AccountName || undefined, password: ConvertPassword(AccountPassword) || undefined }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      if (AccountName) await AsyncStorage.setItem('Name', AccountName);
      console.log('User updated successfully');
      Alert.alert('Success', 'User updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating account:', error);
      Alert.alert('Error', 'Failed to update user. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const ConvertPassword = (password) => {
    const hash = CryptoJS.SHA1(password).toString();
    console.log('Hash:', hash);
    return hash
  }
  return (
    <Modal>
      <Text style={{ fontSize: 20, color: 'white' }}>Gebruikersnaam:</Text>
      <TextInput
        placeholder="Naam..."
        placeholderTextColor="grey"
        value={AccountName}
        onChangeText={(text) => setAccountName(text)}
        style={{ fontSize: 16, color: 'white' }}
      />
      <Text style={{ fontSize: 20, color: 'white' }}>Wachtwoord:</Text>
      <TextInput
        placeholder="Wachtwoord..."
        placeholderTextColor="grey"
        value={AccountPassword}
        onChangeText={(text) => setAccountPassword(text)}
        style={{ fontSize: 16, color: 'white' }}
        secureTextEntry={true}
      />
      <Text style={{ fontSize: 20, color: 'white' }}>Foto:</Text>
      <Pressable style={{ borderRadius: 10, padding: 10 }}>
        <Text style={{ fontSize: 16, color: 'white' }}>COMMING SOON!</Text>
      </Pressable>
      <View style={{ marginTop: 20 }}>
        <Pressable onPress={handleAccountSave}>
          <Text style={{ fontSize: 20, color: 'white' }}>Save</Text>
        </Pressable>
      </View>
      {isLoading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </Modal>
  );
}

export default AccountModalScreen;
