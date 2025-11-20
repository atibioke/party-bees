import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { API_URL } from '../constants/Config';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);

export default function Landing() {
    const router = useRouter();
    const { authState } = useAuth();
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEvents = async () => {
        try {
            // Fetch public events (we might need to update backend to allow public access or use a public endpoint)
            // For now, assuming /api/events allows GET without token for public events or we need to adjust backend
            // Actually, the backend currently requires token for GET /api/events. 
            // We should probably update backend to allow public GET, or just handle the error gracefully.

            // Temporary: If not logged in, we might not get events if backend is strict.
            // Let's try to fetch.
            const response = await fetch(`${API_URL}/events`);
            const data = await response.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEvents();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <StyledView className="flex-1 bg-gray-900">
            <StatusBar style="light" />
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <StyledView className="px-6 py-4 flex-row justify-between items-center bg-gray-900/90 blur-md z-10">
                    <StyledView className="flex-row items-center">
                        <StyledView className="w-10 h-10 bg-amber-500 rounded-full items-center justify-center mr-3">
                            <StyledText className="text-xl font-bold text-white">S</StyledText>
                        </StyledView>
                        <StyledText className="text-2xl font-bold text-white">Skiboh</StyledText>
                    </StyledView>

                    {authState.authenticated ? (
                        <StyledTouchableOpacity
                            onPress={() => router.push('/(app)')}
                            className="bg-gray-800 px-4 py-2 rounded-full border border-gray-700"
                        >
                            <StyledText className="text-white font-bold">Dashboard</StyledText>
                        </StyledTouchableOpacity>
                    ) : (
                        <StyledTouchableOpacity
                            onPress={() => router.push('/(auth)/login')}
                            className="bg-amber-500 px-6 py-2 rounded-full shadow-lg shadow-amber-500/20"
                        >
                            <StyledText className="text-white font-bold">Sign In</StyledText>
                        </StyledTouchableOpacity>
                    )}
                </StyledView>

                <StyledScrollView
                    className="flex-1 px-4"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />
                    }
                >
                    {/* Hero Section */}
                    <StyledView className="mt-4 mb-8">
                        <StyledText className="text-4xl font-bold text-white mb-2">
                            Discover <StyledText className="text-amber-500">Amazing</StyledText>
                        </StyledText>
                        <StyledText className="text-4xl font-bold text-white mb-4">
                            Events Near You
                        </StyledText>
                        <StyledText className="text-gray-400 text-lg">
                            Book tickets for the hottest parties, concerts, and shows in town.
                        </StyledText>
                    </StyledView>

                    {/* Events List */}
                    <StyledText className="text-xl font-bold text-white mb-4 ml-2">Upcoming Events</StyledText>

                    {events.length === 0 ? (
                        <StyledView className="bg-gray-800 p-8 rounded-3xl items-center border border-gray-700 border-dashed">
                            <StyledText className="text-gray-400 text-center mb-4">No events found right now.</StyledText>
                            <StyledTouchableOpacity onPress={fetchEvents} className="bg-gray-700 px-4 py-2 rounded-full">
                                <StyledText className="text-white">Retry</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    ) : (
                        events.map((event) => (
                            <StyledTouchableOpacity
                                key={event._id}
                                className="bg-gray-800 rounded-3xl mb-6 overflow-hidden shadow-xl border border-gray-700"
                                activeOpacity={0.9}
                            >
                                {/* Placeholder Image Area */}
                                <StyledView className="h-48 bg-gray-700 items-center justify-center relative">
                                    {/* If we had images, we'd show them here. For now, a gradient-like placeholder */}
                                    <StyledView className="absolute inset-0 bg-gray-600 opacity-50" />
                                    <StyledText className="text-6xl opacity-20">🎉</StyledText>

                                    <StyledView className="absolute top-4 right-4 bg-gray-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                                        <StyledText className="text-amber-500 font-bold text-xs">
                                            {event.category || 'Event'}
                                        </StyledText>
                                    </StyledView>
                                </StyledView>

                                <StyledView className="p-5">
                                    <StyledView className="flex-row justify-between items-start mb-2">
                                        <StyledText className="text-white font-bold text-xl flex-1 mr-2 leading-tight">
                                            {event.title}
                                        </StyledText>
                                    </StyledView>

                                    <StyledView className="flex-row items-center mb-4">
                                        <StyledText className="text-amber-500 font-bold mr-4">
                                            {new Date(event.startDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </StyledText>
                                        <StyledText className="text-gray-400 text-sm">
                                            •  {new Date(event.startDateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </StyledText>
                                    </StyledView>

                                    <StyledText className="text-gray-400 text-sm mb-4 leading-relaxed" numberOfLines={2}>
                                        {event.description}
                                    </StyledText>

                                    <StyledView className="flex-row justify-between items-center pt-4 border-t border-gray-700">
                                        <StyledView className="flex-row items-center">
                                            <StyledView className="w-4 h-4 rounded-full bg-gray-600 mr-2" />
                                            <StyledText className="text-gray-400 text-xs">
                                                {event.state}, {event.lga}
                                            </StyledText>
                                        </StyledView>
                                        <StyledView className="bg-white px-4 py-2 rounded-full">
                                            <StyledText className="text-black font-bold text-xs">View Details</StyledText>
                                        </StyledView>
                                    </StyledView>
                                </StyledView>
                            </StyledTouchableOpacity>
                        ))
                    )}

                    <StyledView className="h-20" />
                </StyledScrollView>
            </SafeAreaView>
        </StyledView>
    );
}
