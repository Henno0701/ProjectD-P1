import { Button, Text, View, Pressable, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet } from 'react-native';


export default function StationsQuickReserveScreen() {
    return (
      <View className="flex-1 bg-main_bg_color items-center">
        <ScrollView>
            <View className="p-3">
                <View className="flex-row w-full items-center mb-3">
                    <View className="bg-main_box_color w-full rounded-lg p-2.5">
                        <View className="flex flex-row items-center justify-between">
                            <Text className="text-lg text-[#fff]" style={styles.font_semibold}>Available Slot</Text>
                            <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                        </View>
                        <View className="flex-row w-full items-center justify-between mt-2">
                            <View className="flex-row items-center justify-between w-3/5 rounded-lg">
                                <Text className="text-lg text-profile-grijs" style={styles.font_thin}>Today</Text>
                                <Text className="text-lg text-[#fff]" style={styles.font_semibold}>9:00 - 10:00</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="flex-row w-full items-center mb-3">
                    <View className="bg-main_box_color w-full rounded-lg p-2.5">
                        <View className="flex flex-row items-center justify-between">
                            <Text className="text-lg text-[#fff]" style={styles.font_semibold}>Available Slot</Text>
                            <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                        </View>
                        <View className="flex-row w-full items-center justify-between mt-2">
                            <View className="flex-row items-center justify-between w-3/5 rounded-lg">
                                <Text className="text-lg text-profile-grijs" style={styles.font_thin}>Today</Text>
                                <Text className="text-lg text-[#fff]" style={styles.font_semibold}>15:00 - 16:00</Text>
                            </View>
                        </View>
                    </View>
                </View>
                
                <View className="flex-row w-full items-center mb-3">
                    <View className="bg-main_box_color w-full rounded-lg p-2.5">
                        <View className="flex flex-row items-center justify-between">
                            <Text className="text-lg text-[#fff]" style={styles.font_semibold}>Available Slot</Text>
                            <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                        </View>
                        <View className="flex-row w-full items-center justify-between mt-2">
                            <View className="flex-row items-center justify-between w-3/5 rounded-lg">
                                <Text className="text-lg text-profile-grijs" style={styles.font_thin}>Today</Text>
                                <Text className="text-lg text-[#fff]" style={styles.font_semibold}>17:00 - 18:00</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>

        <View className='w-full p-3'>
            <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center">
                <Text className="text-wit text-xl" style={styles.font_semibold}>Book</Text>
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