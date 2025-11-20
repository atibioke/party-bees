import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Login Failed', result.error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <StyledView className="flex-1 bg-gray-900 justify-center px-8">
                <StatusBar style="light" />

                <StyledView className="items-center mb-12">
                    {/* Placeholder for Logo */}
                    <StyledView className="w-20 h-20 bg-amber-500 rounded-full items-center justify-center mb-4">
                        <StyledText className="text-3xl font-bold text-white">S</StyledText>
                    </StyledView>
                    <StyledText className="text-3xl font-bold text-white">Welcome Back</StyledText>
                    <StyledText className="text-gray-400 mt-2">Sign in to continue</StyledText>
                </StyledView>

                <StyledView className="space-y-4">
                    <StyledView>
                        <StyledText className="text-gray-400 mb-2 ml-1">Email Address</StyledText>
                        <StyledTextInput
                            className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-amber-500"
                            placeholder="Enter your email"
                            placeholderTextColor="#6B7280"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </StyledView>

                    <StyledView>
                        <StyledText className="text-gray-400 mb-2 ml-1">Password</StyledText>
                        <StyledTextInput
                            className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-amber-500"
                            placeholder="Enter your password"
                            placeholderTextColor="#6B7280"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </StyledView>

                    <StyledTouchableOpacity
                        className="bg-amber-500 p-4 rounded-xl items-center mt-4"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <StyledText className="text-white font-bold text-lg">Sign In</StyledText>
                        )}
                    </StyledTouchableOpacity>
                </StyledView>

                <StyledView className="flex-row justify-center mt-8">
                    <StyledText className="text-gray-400">Don't have an account? </StyledText>
                    <StyledTouchableOpacity>
                        <StyledText className="text-amber-500 font-bold">Sign Up</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledView>
        </KeyboardAvoidingView>
    );
}
