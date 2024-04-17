import { Button, Text, View, Pressable, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const StyledView = styled(View)
const StyledText = styled(Text)

export default function StationsQuickReserveScreen() {
    return (
      <StyledView className="flex-1 bg-main_bg_color items-center p-2.5">
        <ScrollView>
            <StyledView className="flex-row w-full items-center mb-3">
                <StyledView className="bg-main_box_color w-full rounded-lg p-2.5">
                    <StyledView className="flex flex-row items-center justify-between">
                        <Text className="text-lg text-[#fff] font-semibold">Available Slot</Text>
                        <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                    </StyledView>
                    <StyledView className="flex-row w-full items-center justify-between mt-2">
                        <StyledView className="flex-row items-center justify-between w-3/5 rounded-lg">
                            <Text className="text-lg text-profile-grijs font-light">Today</Text>
                            <Text className="text-lg text-[#fff] font-semibold">9:00 - 10:00</Text>
                        </StyledView>
                    </StyledView>
                </StyledView>
            </StyledView>

            <StyledView className="flex-row w-full items-center mb-3">
                <StyledView className="bg-main_box_color w-full rounded-lg p-2.5">
                    <StyledView className="flex flex-row items-center justify-between">
                        <Text className="text-lg text-[#fff] font-semibold">Available Slot</Text>
                        <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                    </StyledView>
                    <StyledView className="flex-row w-full items-center justify-between mt-2">
                        <StyledView className="flex-row items-center justify-between w-3/5 rounded-lg">
                            <Text className="text-lg text-profile-grijs font-light">Today</Text>
                            <Text className="text-lg text-[#fff] font-semibold">15:00 - 16:00</Text>
                        </StyledView>
                    </StyledView>
                </StyledView>
            </StyledView>
            
            <StyledView className="flex-row w-full items-center mb-3">
                <StyledView className="bg-main_box_color w-full rounded-lg p-2.5">
                    <StyledView className="flex flex-row items-center justify-between">
                        <Text className="text-lg text-[#fff] font-semibold">Available Slot</Text>
                        <FontAwesomeIcon icon={faCalendarDays} size={20} color="#fff" />
                    </StyledView>
                    <StyledView className="flex-row w-full items-center justify-between mt-2">
                        <StyledView className="flex-row items-center justify-between w-3/5 rounded-lg">
                            <Text className="text-lg text-profile-grijs font-light">Today</Text>
                            <Text className="text-lg text-[#fff] font-semibold">17:00 - 18:00</Text>
                        </StyledView>
                    </StyledView>
                </StyledView>
            </StyledView>
        </ScrollView>

        <StyledView className='w-full'>
            <Pressable className="h-14 bg-schuberg_blue rounded-lg justify-center items-center">
                <StyledText className="text-wit text-xl font-semibold">Book</StyledText>
            </Pressable>
        </StyledView>
      </StyledView>
    );
  }