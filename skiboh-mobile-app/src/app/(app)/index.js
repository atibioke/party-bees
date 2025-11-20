import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { API_URL } from '../../constants/Config';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

export default function Dashboard() {
    const { logout, authState } = useAuth();
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${API_URL}/events`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                },
            });
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
            <StyledView className="pt-12 px-6 pb-4 bg-gray-800 rounded-b-3xl shadow-lg">
                <StyledView className="flex-row justify-between items-center">
                    <StyledView>
                        <StyledText className="text-gray-400 text-sm">Welcome back,</StyledText>
                        <StyledText className="text-white text-xl font-bold">
                            {authState.user?.businessName || authState.user?.email || 'User'}
                        </StyledText>
                    </StyledView>
                    <StyledTouchableOpacity
                        onPress={logout}
                        className="bg-gray-700 p-2 rounded-full"
                    >
                        {/* Simple Logout Icon Placeholder */}
                        <StyledView className="w-6 h-6 bg-red-500 rounded-full" />
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledView>

            <StyledScrollView
                className="flex-1 px-6 pt-6"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />
                }
            >
                <StyledText className="text-white text-lg font-bold mb-4">Upcoming Events</StyledText>

                {events.length === 0 ? (
                    <StyledView className="bg-gray-800 p-6 rounded-2xl items-center">
                        <StyledText className="text-gray-400">No events found</StyledText>
                    </StyledView>
                ) : (
                    events.map((event) => (
                        <StyledTouchableOpacity
                            key={event._id}
                            className="bg-gray-800 p-4 rounded-2xl mb-4 border border-gray-700"
                        >
                            <StyledView className="flex-row justify-between items-start mb-2">
                                <StyledText className="text-white font-bold text-lg flex-1 mr-2">
                                    {event.title}
                                </StyledText>
                                <StyledView className="bg-amber-500/20 px-2 py-1 rounded-lg">
                                    <StyledText className="text-amber-500 text-xs font-bold">
                                        {new Date(event.startDateTime).toLocaleDateString()}
                                    </StyledText>
                                </StyledView>
                            </StyledView>

                            <StyledText className="text-gray-400 text-sm mb-3" numberOfLines={2}>
                                {event.description}
                            </StyledText>

                            <StyledView className="flex-row items-center">
                                <StyledView className="bg-gray-700 px-3 py-1 rounded-full mr-2">
                                    <StyledText className="text-gray-300 text-xs">{event.category}</StyledText>
                                </StyledView>
                                <StyledText className="text-gray-500 text-xs">
                                    {event.state}, {event.lga}
                                </StyledText>
                            </StyledView>
                        </StyledTouchableOpacity>
                    ))
                )}

                <StyledView className="h-20" />
            </StyledScrollView>
        </StyledView>
    );
}
