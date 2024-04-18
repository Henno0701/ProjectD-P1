import { Image, Text, View, Pressable, Modal, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function ProfileOverviewScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [accountName, setAccountName] = useState("Henno Passchier");
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  const [editedAccountName, setEditedAccountName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  
  // Fetch account name from server when component mounts
  useEffect(() => {
    fetchAccountName();
  }, []);

  // Function to fetch account name from server
  const fetchAccountName = async () => {
    try {
      const response = await fetch('http://192.168.1.39:8080/getName'); // ONTHOUD DE NUMMERS MOETEN JOUW IP ADRESS ZIJN VAN JE PC ZODRA CLLIENT EN SERVER RUNNEN OP JE LAPTOP/PC
      const data = await response.json();
      // Update the account name state
      setAccountName(data.name);
    } catch (error) {
      console.error('Error fetching account name:', error);
    }
  };

  return (
    <View className={`flex-1 bg-main_bg_color`} style={{ paddingTop: insets.top }}>
      <View className="items-center mt-10">
        <Text className="text-wit mx-5 text-3xl" style={styles.font_medium}>Profile</Text>
      </View>
      <View className="bg-secondary_bg_color flex flex-row my-8 mx-4 h-28 rounded-xl">
        <Image
          source={selectedImage ? { uri: selectedImage } : require('../images/Profile.jpg')}
          className="m-3 w-20 h-20 rounded-full"
        />
        <Text className="text-wit m-5 text-base flex-2" style={styles.font_regular}>{accountName}</Text>
      </View>
      <Text className="text-profile-grijs mx-5 text-base -my-7" style={styles.font_thin}>Account settings</Text>
      <View className="bg-secondary_bg_color my-8 mx-4 h-58 rounded-xl">

        {/*!--- Button voor Account Modal ---!*/}
        <Pressable onPress={() => navigation.navigate('Account')} className="rounded-lg p-5">
          <Text className="text-wit text-base" style={styles.font_regular}>Account</Text>
        </Pressable>
      
        {/*!--- Button voor Contact Details Modal ---!*/}
        <Pressable onPress={() => navigation.navigate('Contact Details')} className="rounded-lg p-5">
          <Text className="text-wit text-base" style={styles.font_regular}>Contact details</Text>
        </Pressable>

        {/*!--- Button voor Security Modal ---!*/}
        <Pressable onPress={() => navigation.navigate('Security')} className="rounded-lg p-5">
          <Text className="text-wit text-base" style={styles.font_regular}>Security</Text>
        </Pressable>

      </View>
    </View>
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
