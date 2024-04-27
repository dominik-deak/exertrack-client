import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import useTokens from '@/hooks/useTokens';
import {
	Box,
	Button,
	ButtonSpinner,
	ButtonText,
	Heading,
	Input,
	InputField,
	SafeAreaView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

/**
 * Renders the Login component, which allows users to log in to the application.
 * @return The Login component.
 */
export default function Login() {
	const { setAccessToken, setRefreshToken } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	/**
	 * Handles the login process by sending a POST request
	 * to the server with the user's email and password.
	 * On success, it sets the access token and refresh token
	 * in local storage and redirects the user to the progress page.
	 */
	async function onLogin() {
		setIsLoading(true);

		if (!email.trim() || !password.trim()) {
			setError('All fields are required.');
			setIsLoading(false);
			return;
		}

		axios
			.post(`${API}/auth/login`, { email, password })
			.then(async res => {
				const { accessToken, refreshToken } = res.data;

				await setAccessToken(accessToken);
				await setRefreshToken(refreshToken);

				router.replace('/(tabs)/progress');
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Login failed. Please try again.';
				} else if (error instanceof Error) {
					message = error.message;
				} else {
					message = 'An unexpected error occurred.';
				}
				setError(message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	return (
		<SafeAreaView flex={1}>
			<MessageModal message={error} setMessage={setError} heading='Error' btnText='Ok' btnAction={() => setError('')} />

			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<Box flex={1} alignItems='center' marginTop={50}>
					<VStack space='4xl' w='$4/5'>
						<Box>
							<Heading color='$green500' size='3xl' alignSelf='center'>
								ExerTrack
							</Heading>
							<Text color='$green800' size='3xl' alignSelf='center'>
								Login
							</Text>
						</Box>

						<Box>
							<Text size='3xl' color='$white'>
								Email
							</Text>
							<Input variant='outline' size='xl' isDisabled={isLoading}>
								<InputField onChangeText={setEmail} placeholder='Enter Email' color='$white' />
							</Input>
						</Box>
						<Box>
							<Text size='3xl' color='$white'>
								Password
							</Text>
							<Input variant='outline' size='xl' isDisabled={isLoading}>
								<InputField
									onChangeText={setPassword}
									placeholder='Enter Password'
									type='password'
									color='$white'
								/>
							</Input>
						</Box>

						<Box marginTop={50}>
							<Button size='lg' bgColor='$green600' onPress={onLogin} isDisabled={isLoading}>
								{isLoading && <ButtonSpinner mr='$1' />}
								<ButtonText>{isLoading ? 'Logging in...' : 'Log In'}</ButtonText>
							</Button>
							<Button
								size='lg'
								variant='link'
								onPress={() => router.replace('/auth/register')}
								isDisabled={isLoading}>
								<ButtonText color='$green600'>Register</ButtonText>
							</Button>
							{/* <Button
								size='lg'
								variant='link'
								onPress={() => router.replace('/auth/reset-pass')}
								isDisabled={isLoading}>
								<ButtonText color='$green600'>Forgot Password</ButtonText>
							</Button> */}
						</Box>
					</VStack>
				</Box>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}
