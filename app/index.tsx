import LoadingScreen from '@/components/LoadingScreen';
import useTokens from '@/hooks/useTokens';
import { Redirect } from 'expo-router';

/**
 * The index page of the app.
 * Checks if the user is logged in or not using the `useTokens` hook.
 * If they are, redirects to the progress page. Otherwise, redirects to the login page.
 * @returns The index page component.
 */
export default function Index() {
	const { accessToken, refreshToken, isLoading } = useTokens();

	if (isLoading) {
		return <LoadingScreen />;
	}

	const isLoggedIn = accessToken !== null && refreshToken !== null;

	if (isLoggedIn) {
		return <Redirect href='/(tabs)/progress' />;
	} else {
		return <Redirect href='/auth/login' />;
	}
}
