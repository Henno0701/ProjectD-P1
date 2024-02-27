import { Button, Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

export default function StationsOverviewScreen() {
    return (
      <StyledView className="flex-1 bg-main_bg_color items-center p-2.5">

        <StyledView className='flex-row w-full items-center'>
            <StyledView className="bg-main_box_color w-1/2 basis-[48] p-2.5 rounded-lg">
                <Text className="text-sm text-[#7C7C7C] font-light">Available Stations</Text>
                <StyledView className="flex flex-row items-center justify-center p-2">
                    <Text className="text-[30px] text-[#fff] font-semibold">13</Text>
                </StyledView>
            </StyledView>
            
            {/* This part is for the gap between the 2 cards */}
            <StyledView className="basis-[4]"></StyledView>

            <StyledView className="bg-main_box_color w-1/2 basis-[48] p-2.5 rounded-lg">
                <Text className="text-sm text-[#7C7C7C] font-light">Defect Stations</Text>
                <StyledView className="flex flex-row items-center justify-center p-2">
                    <Text className="text-[30px] text-[#fff] font-semibold">2</Text>
                </StyledView>
            </StyledView>
        </StyledView>

        <StyledView className="flex-row w-full items-center mt-2.5">
            <StyledView className="bg-main_box_color w-full rounded-lg p-2.5">
                <Text className="text-sm text-[#7C7C7C] font-light">Defect Charging Stations</Text>
                <StyledView className="">
                    <Text className="text-lg text-[#fff] font-medium">I have got a defect Station</Text>
                </StyledView>
            </StyledView>
        </StyledView>
      </StyledView>
    );
  }