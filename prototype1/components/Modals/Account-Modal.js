import React from 'react';
import { Button, View, Text, Pressable, TextInput } from 'react-native';
import { useState } from 'react';

import Modal from '../Modal';

function AccountModalScreen({}) {
    const [ AccountName, setAccountName ] = useState("");

    // Function to save the name to the server
    const handleAccountSave = async () => {
        try {
          const response = await fetch('http://192.168.1.39:8080/setName', { // ONTHOUD DE NUMMERS MOETEN JOUW IP ADRESS ZIJN VAN JE PC ZODRA CLLIENT EN SERVER RUNNEN OP JE LAPTOP/PC
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: AccountName }),
          });
        } catch (error) {
          console.error('Error setting account name:', error);
        }
    };

    return (
        <Modal>
            <Text className="text-wit text-xl">Gebruikersnaam:</Text>
              <TextInput
                placeholder="Naam..."
                placeholderTextColor="grey"
                value={AccountName}
                onChangeText={(text) => setAccountName(text)}
                className="text-wit text-base"
              />
              <Text className="text-wit text-xl">Foto:</Text>
              <Pressable className="rounded-lg p-5">
                <Text className="text-wit text-base">COMMING SOON!</Text>
              </Pressable>
              <View className="my-10">
                <Pressable onPress={handleAccountSave}>
                  <Text className="text-wit text-xl">Save</Text>
                </Pressable>
              </View>
        </Modal>
    );
}

export default AccountModalScreen;