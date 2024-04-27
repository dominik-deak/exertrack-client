// import { useColorScheme } from '@/components/useColorScheme';
import UnitPreferenceProvider from '@/contexts/UnitPreferenceContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { config } from '@gluestack-ui/config'; // Default theme from Gluestack
import { GluestackUIProvider } from '@gluestack-ui/themed';
import {
	DarkTheme,
	// DefaultTheme,
	ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)'
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

/**
 * The root layout navigator.
 *
 * Applies:
 * - the Gluestack UI provider with the default config
 * - the unit preference provider
 * - the theme provider with the dark theme.
 *
 * Defaults to the index screen.
 * @returns The root layout navigator component.
 */
function RootLayoutNav() {
	// const colorScheme = useColorScheme();

	return (
		<GluestackUIProvider config={config}>
			{/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
			<ThemeProvider value={DarkTheme}>
				<UnitPreferenceProvider>
					<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
						<Stack.Screen name='index' />
					</Stack>
				</UnitPreferenceProvider>
			</ThemeProvider>
		</GluestackUIProvider>
	);
}
