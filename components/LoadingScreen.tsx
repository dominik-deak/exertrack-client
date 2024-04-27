import { Box, HStack, SafeAreaView, Spinner, Text } from '@gluestack-ui/themed';

/**
 * Renders a loading screen with a spinner and text.
 * @returns The loading screen component.
 */
function LoadingScreen() {
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

export default LoadingScreen;
