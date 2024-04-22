import React from 'react';
import { View } from 'react-native';

export default function ButtonList({ children }) {
    return (
        <View className="flex-col w-full items-center bg-main_box_color rounded-lg px-5 divide-y-[1px] divide-[#363636]">
            {children}
        </View>
    );
}