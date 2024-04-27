import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

/**
 * The tab layout component that renders the bottom tab navigation for the app.
 * @returns The tab layout component.
 */
export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false
			}}>
			<Tabs.Screen
				name='progress'
				options={{
					title: 'Progress',
					tabBarIcon: () => <AntDesign name='linechart' size={24} color='white' />
				}}
			/>
			<Tabs.Screen
				name='history'
				options={{
					title: 'Workout History',
					tabBarIcon: () => <FontAwesome name='history' size={24} color='white' />
				}}
			/>
			<Tabs.Screen
				name='workout'
				options={{
					title: 'New Workout',
					tabBarIcon: () => <MaterialCommunityIcons name='weight-lifter' size={24} color='white' />
				}}
			/>
			<Tabs.Screen
				name='settings'
				options={{
					title: 'Settings',
					tabBarIcon: () => <Feather name='settings' size={24} color='white' />
				}}
			/>
		</Tabs>
	);
}
