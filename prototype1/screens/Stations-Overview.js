import { Button, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBolt, faCalendarTimes, faCalendarWeek, faCar, faChargingStation, faChevronRight, faExclamation, faPlugCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import ButtonList from '../components/Button-List';

export default function StationsOverviewScreen() {
    return (
      <View className="flex-1 bg-main_bg_color items-center">
        <ScrollView>
            <View className="flex p-3">
                <View className='flex-row w-full'>
                    <View className="bg-main_box_color w-full basis-[48] p-2.5 rounded-lg">
                        <Text className="text-sm text-box-information-text font-light" style={styles.font_thin}>Available Stations</Text>
                        <View className="flex flex-row items-center justify-center p-2">
                            <View className="w-12 h-12 bg-main_bg_color justify-center items-center rounded-full mr-2">
                                <FontAwesomeIcon icon={faBolt} size={24} color="#1E80ED" />
                            </View>
                            <Text className="text-3xl text-[#fff]" style={styles.font_regular}>13</Text>
                        </View>
                    </View>
                    
                    {/* This part is for the gap between the 2 cards */}
                    <View className="basis-[4]"></View>

                    <View className="bg-main_box_color w-full basis-[48] p-2.5 rounded-lg">
                        <Text className="text-sm text-box-information-text font-light" style={styles.font_thin}>Defect Stations</Text>
                        <View className="flex flex-row items-center justify-center p-2">
                            <View className="w-12 h-12 bg-main_bg_color justify-center items-center rounded-full mr-2">
                                <FontAwesomeIcon icon={faPlugCircleExclamation} size={24} color="#db2525"/>
                            </View>
                            <Text className="text-3xl text-[#fff]" style={styles.font_regular}>2</Text>
                        </View>
                    </View>
                </View>

            
                <View className="w-full mt-3">
                    <Text className="text-sm text-box-information-text font-light mb-1" style={styles.font_thin}>Quick Access</Text>
                    <ButtonList className="">
                        <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4">
                            <View className="flex flex-row items-center">
                                <FontAwesomeIcon icon={faCar} size={20} color="#FFFFFF"/>
                                <Text className="ml-2 text-base text-[#fff] font-medium" style={styles.font_regular}>Occupied charging space</Text>
                            </View>
                            <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4">
                            <View className="flex flex-row items-center">
                                <FontAwesomeIcon icon={faChargingStation} size={20} color="#FFFFFF"/>
                                <Text className="ml-2 text-base text-[#fff] font-medium" style={styles.font_regular}>I have got a defect Station</Text>
                            </View>
                            <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex flex-row justify-between items-center w-full py-4">
                            <View className="flex flex-row items-center">
                                <FontAwesomeIcon icon={faCalendarTimes} size={20} color="#FFFFFF"/>
                                <Text className="ml-2 text-base text-[#fff] font-medium" style={styles.font_regular}>Cancel Reservation</Text>
                            </View>
                            <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </ButtonList>
                </View>
            </View>
        </ScrollView>
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