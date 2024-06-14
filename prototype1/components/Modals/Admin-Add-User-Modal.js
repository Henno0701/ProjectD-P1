import React from 'react';
import { Button, View, Text, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { faBarChart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-picker-select';
import { IP } from '@env';

import Modal from '../Modal';
import { ScrollView } from 'react-native-gesture-handler';

function AddUserModal({ navigation }) {

    const returnToAdminScreen = () => {
        navigation.navigate('AdminPanelScreen');
    }
    return (
        <Modal>
            <View className="flex-1 bg-main_bg_color items-center p-3 w-full">
                <ScrollView>

                </ScrollView>
                <View className='w-full flex-row'>
                    <View className='w-1/5 basis-[19%]'>
                        <Pressable className="h-14 bg-secondary_box_color rounded-lg justify-center items-center" onPress={returnToAdminScreen}>
                            <FontAwesomeIcon icon={faChevronLeft} size={20} color="#fff" />
                            {/* <Text className="text-wit text-xl" style={styles.font_semibold}></Text> */}
                        </Pressable>
                    </View>
                    <View className="basis-[2%]"></View>
                    <View className='w-4/5 basis-[79%]'>
                        <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center" onPress={() => handleSubmit()}>
                            <Text className="text-wit text-xl" style={styles.font_semibold}>Send</Text>
                        </Pressable>
                    </View>
                </View>
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

export default AddUserModal;