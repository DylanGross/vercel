import * as React from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground(): React.ReactElement {
    return (
        <BlurView
            tint="systemChromeMaterial"
            intensity={100}
            style={StyleSheet.absoluteFill}
        />
    );
}

export function useBottomTabOverflow(): number {
    return useBottomTabBarHeight();
}
