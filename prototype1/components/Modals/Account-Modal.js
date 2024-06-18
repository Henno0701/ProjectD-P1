import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import Modal from '../Modal';
import { StyleSheet } from 'react-native';

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
    console.log('ID:', ID);
    console.log('Name:', AccountName);
    if (AccountPassword == "") {
      try {
        const response = await fetch(`http://${IP}:8080/Updateuserself`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: ID.toString(), name: AccountName || undefined, password: "" || undefined }),
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
    }
    else if (AccountName == "") {
      try {
        const response = await fetch(`http://${IP}:8080/Updateuserself`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: ID.toString(), name: AccountName, password: ConvertPassword(AccountPassword) }),
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
    }
    else {

      try {
        const response = await fetch(`http://${IP}:8080/Updateuserself`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: ID.toString(), name: AccountName, password: ConvertPassword(AccountPassword) }),
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
  }


  const ConvertPassword = (password) => {
    const hash = CryptoJS.SHA1(password).toString();
    console.log('Hash:', hash);
    return hash
  }
  return (
    <Modal>
      <View className="flex-1 bg-main_bg_color items-center p-3 w-full">
        <View className="w-full mt-3 mb-3">
          <Text className="text-wit text-sm" style={styles.font_semibold}>Username</Text>
          <TextInput
            placeholder="Name..."
            className="w-full h-10 bg-main_box_color rounded-lg justify-center items-center text-wit p-2"
            placeholderTextColor="grey"
            value={AccountName}
            style={styles.font_thin}
            onChangeText={(text) => setAccountName(text)}
          />
        </View>

        <View className="w-full mb-3">
          <Text className="text-wit text-sm" style={styles.font_semibold}>Password</Text>
          <TextInput
            placeholder="Password..."
            placeholderTextColor="grey"
            value={AccountPassword}
            style={styles.font_thin}
            onChangeText={(text) => setAccountPassword(text)}
            className="w-full h-10 bg-main_box_color rounded-lg justify-center items-center text-wit p-2"
            secureTextEntry={true}
          />
        </View>

        <Text className="text-lg text-wit" style={styles.font_semibold}>Foto:</Text>
        <Pressable style={{ borderRadius: 10, padding: 10 }}>
          <Text className="text-sm text-wit" style={styles.font_thin}>COMMING SOON!</Text>
        </Pressable>
        <View className="w-full mt-3">
          <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center flex-row" onPress={handleAccountSave}>
            <Text className="text-wit text-xl" style={styles.font_semibold}>Save</Text>
          </Pressable>
        </View>
        {isLoading && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  font_regular: {
    fontFamily: 'Montserrat_400Regular',
  },
  font_thin: {
    fontFamily: 'Montserrat_300Light',
  },
  font_medium: {
    fontFamily: 'Montserrat_500Medium',
  },
  font_semibold: {
    fontFamily: 'Montserrat_600SemiBold',
  },
  font_bold: {
    fontFamily: 'Montserrat_700Bold',
  }
});

export default AccountModalScreen;
