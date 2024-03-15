import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
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

export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	function register() {
		setError('');
		setIsLoading(true);

		if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
			setError('All fields are required.');
			setIsLoading(false);
			return;
		}
		if (password !== confirmPassword) {
			alert('Passwords do not match.');
			setIsLoading(false);
			return;
		}

		axios
			.post(`${API}/auth/register`, { email, password, confirmPassword })
			.then(() => {
				setSuccess(
					'Congratulations! You have successfully set up your ExerTrack account. You may now log in and begin logging your workouts.'
				);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data?.message || 'Registration failed. Please try again.';
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
			<MessageModal
				message={success}
				setMessage={setSuccess}
				heading='Successful Registration'
				btnText='Login'
				btnAction={() => router.replace('/auth/login')}
			/>

			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<Box flex={1} alignItems='center' marginTop={50}>
					<VStack space='4xl' w='$4/5'>
						<Box>
							<Heading color='$green500' size='3xl' alignSelf='center'>
								ExerTrack
							</Heading>
							<Text color='$green800' size='3xl' alignSelf='center'>
								Register
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
						<Box>
							<Text size='3xl' color='$white'>
								Confirm Password
							</Text>
							<Input variant='outline' size='xl' isDisabled={isLoading}>
								<InputField
									onChangeText={setConfirmPassword}
									placeholder='Enter Password'
									type='password'
									color='$white'
								/>
							</Input>
						</Box>

						<Box marginTop={50}>
							<Button size='lg' bgColor='$green600' onPress={register} isDisabled={isLoading}>
								{isLoading && <ButtonSpinner mr='$1' />}
								<ButtonText>{isLoading ? 'Registering...' : 'Register'}</ButtonText>
							</Button>
							<Button
								size='lg'
								variant='link'
								onPress={() => router.replace('/auth/login')}
								isDisabled={isLoading}>
								<ButtonText color='$green600'>Back to Login</ButtonText>
							</Button>
						</Box>
					</VStack>
				</Box>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}
