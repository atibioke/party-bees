import { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function Splash() {
    const router = useRouter();

    useEffect(() => {
        // Simulate splash delay
        const timer = setTimeout(() => {
            router.replace('/landing');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <StyledView className="flex-1 bg-gray-900 justify-center items-center">
            <StatusBar style="light" />
            <StyledView className="w-32 h-32 bg-amber-500 rounded-full items-center justify-center mb-6 shadow-lg shadow-amber-500/50">
                <StyledText className="text-6xl font-bold text-white">S</StyledText>
            </StyledView>
            <StyledText className="text-4xl font-bold text-white tracking-wider">SKIBOH</StyledText>
            <StyledText className="text-gray-400 mt-2 text-lg">Party like never before</StyledText>
        </StyledView>
    );
}
