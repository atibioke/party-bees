import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";

const InitialLayout = () => {
    const { authState } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return <Slot />;
};

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <InitialLayout />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
