import React, { useEffect } from 'react';
import { Button, View, Text, Pressable, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { faBarChart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-picker-select';
import { IP } from '@env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Modal from '../Modal';
import { ScrollView } from 'react-native-gesture-handler';

function UsersModal({ navigation }) {
    const insets = useSafeAreaInsets();
    const [ users, setUsers ] = useState({});

    const getAllUsers = async () => {
        try {
            const response = await fetch(`http://${IP}:8080/getAllUsers`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            if (!response.ok) {
                return {};
            }

            const json = await response.json(); // Assuming response is JSON, use appropriate method accordingly
            return json;
        } catch (error) {
            return {};
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const usersList = await getAllUsers();
            setUsers(usersList || {});
        };
    
        fetchData();
    }, [DeleteUser]);

    const DeleteUser = async (id) => {
        try {
            console.log(id);
            const response = await fetch(`http://${IP}:8080/deleteUser`, {
                method: "POST",
                body: JSON.stringify({ UserID: id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            if (!response.ok) {
                return false;
            }

            return true;
        } catch (error) {
            // console.error('Error:', error);
            return false;
        }
    };

    const handleDeleteUser = async (id) => {
        const success = await DeleteUser(id);

        if (success) {
            Alert.alert('User Deleted', 'The user has been deleted successfully', [
                {
                    text: 'OK',
                    style: 'cancel',
                }
            ]);
        } else {
            Alert.alert('Error', 'An error occurred while deleting the user', [
                {
                    text: 'OK',
                    style: 'cancel',
                }
            ]);
        }
    };

    const ShowUserActions = (id) =>
        Alert.alert('User Actions', 'This will delete the user completely', [
            {
                text: 'Cancel',
                // onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Delete User',
                onPress: () => handleDeleteUser(id),
                style: 'destructive',
            }
        ]);

    const returnToAdminScreen = () => {
        navigation.navigate('AdminPanelScreen');
    }
    return (
        <Modal>
            <View className="flex-1 bg-main_bg_color items-center p-3 w-full" style={{ paddingTop: insets.top }}>
            <Text className="text-wit text-2xl" style={styles.font_semibold}>Users</Text>
                <ScrollView className="w-full">
                    {Object.entries(users).map(([value, user], index) => {
                        return (
                            <TouchableOpacity key={user.id} className="w-full h-20 flex flex-row p-3 bg-main_box_color rounded-xl items-center mb-1" onPress={() => ShowUserActions(user.id)}>
                                <View className="flex-row items-center">
                                    <View className="">
                                        <Text className="text-schuberg_blue text-lg" style={styles.font_medium}>{user.username}</Text>
                                        <Text className="text-box-information-text text-lg -mt-1" style={styles.font_thin}>{user.email}</Text>
                                    </View>
                                </View>       
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <View className='w-full flex-row'>
                    <View className='w-1/5 basis-[19%]'>
                        <Pressable className="h-14 bg-secondary_box_color rounded-lg justify-center items-center" onPress={returnToAdminScreen}>
                            <FontAwesomeIcon icon={faChevronLeft} size={20} color="#fff" />
                            {/* <Text className="text-wit text-xl" style={styles.font_semibold}></Text> */}
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

export default UsersModal;