import useTokens from '@/hooks/useTokens';
import { Box, HStack, SafeAreaView, Spinner, Text } from '@gluestack-ui/themed';
import { Redirect } from 'expo-router';

/**
 * Expo Secure Store source:
 * https://docs.expo.dev/versions/latest/sdk/securestore/
 */
export default function Index() {
	const { accessToken, refreshToken, isLoading } = useTokens();

	if (isLoading) {
		return (
			<SafeAreaView flex={1}>
				<Box flex={1} alignItems='center' justifyContent='center'>
					<HStack space='sm'>
						<Spinner color='$green500' size='large' />
						<Text color='$green500' size='4xl'>
							Loading...
						</Text>
					</HStack>
				</Box>
			</SafeAreaView>
		);
	}

	const isLoggedIn = accessToken !== null && refreshToken !== null;

	if (isLoggedIn) {
		return <Redirect href='/(tabs)/progress' />;
	} else {
		return <Redirect href='/auth/login' />;
	}
}
