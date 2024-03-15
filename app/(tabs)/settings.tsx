import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import useTokens from '@/hooks/useTokens';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogBody,
	AlertDialogCloseButton,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	Box,
	Button,
	ButtonText,
	Heading,
	Input,
	InputField,
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Radio,
	RadioGroup,
	RadioIcon,
	RadioIndicator,
	RadioLabel,
	SafeAreaView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function Settings() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [newFirstName, setNewFirstName] = useState('');
	const [newLastName, setNewLastName] = useState('');
	const [measurement, setMeasurement] = useState('metric');

	const [profileModal, setProfileModal] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [accDeletedMsg, setAccDeletedMsg] = useState('');

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const { accessToken, refreshToken, tokenError, setAccessToken, setRefreshToken } = useTokens();

	useEffect(() => {
		if (tokenError) {
			setError(tokenError);
		}
	}, [accessToken, refreshToken, tokenError]);

	async function logout() {
		setError('');
		setIsLoading(true);

		if (!accessToken || !refreshToken) {
			setError("Can't access tokens");
			setIsLoading(false);
			return;
		}

		axios
			.delete(`${API}/auth/logout`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				data: { refreshToken: refreshToken }
			})
			.then(async () => {
				await setAccessToken(null);
				await setRefreshToken(null);

				router.replace('/auth/login');
			})
			.catch(error => {
				// console.error(error);
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Logout failed';
				} else if (error instanceof Error) {
					message = error.message;
				} else {
					message = 'An unexpected error occurred';
				}
				setError(message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	async function deleteAccount() {
		setError('');
		setIsLoading(true);

		if (!accessToken || !refreshToken) {
			setError("Can't access tokens");
			setIsLoading(false);
			return;
		}

		axios
			.delete(`${API}/auth/delete-account`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				data: { refreshToken: refreshToken }
			})
			.then(async () => {
				await setAccessToken(null);
				await setRefreshToken(null);

				setAccDeletedMsg(
					'You have successfully deleted your account. If you wish to continue using ExerTrack, please register again.'
				);
			})
			.catch(error => {
				// console.error(error);
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Logout failed';
				} else if (error instanceof Error) {
					message = error.message;
				} else {
					message = 'An unexpected error occurred';
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
				message={accDeletedMsg}
				setMessage={setAccDeletedMsg}
				heading='Account Deleted'
				btnText='Ok'
				btnAction={() => router.replace('/auth/login')}
			/>

			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<Box flex={1}>
					<Box alignItems='center'>
						<Heading color='$green500' size='3xl'>
							Settings
						</Heading>
					</Box>

					<Box alignItems='center' flex={1} justifyContent='space-between' marginBottom={20} marginTop={30}>
						<VStack space='2xl' w='$5/6'>
							<Box bgColor='$secondary800' padding={15} borderRadius={10}>
								<Text color='white' size='2xl'>
									First Name: {firstName || 'Not set'}
								</Text>
							</Box>
							<Box bgColor='$secondary800' padding={15} borderRadius={10}>
								<Text color='white' size='2xl'>
									Last Name: {lastName || 'Not set'}
								</Text>
							</Box>
							<Box bgColor='$secondary800' padding={15} borderRadius={10}>
								<Text color='white' size='2xl'>
									Email: john@example.com
								</Text>
							</Box>
							<Box bgColor='$secondary800' padding={15} borderRadius={10}>
								<Text color='white' size='2xl'>
									Password: ****
								</Text>
							</Box>
							<Box bgColor='$secondary800' padding={15} borderRadius={10}>
								<Text color='white' size='2xl' marginBottom={10}>
									Measurement Units:
								</Text>
								<RadioGroup value={measurement} onChange={setMeasurement} marginLeft={30}>
									<VStack space='sm'>
										<Radio value='metric' isDisabled={isLoading}>
											<RadioIndicator mr='$2'>
												<RadioIcon as={() => <FontAwesome name='circle' size={13} color='white' />} />
											</RadioIndicator>
											<RadioLabel size='xl' color='white'>
												Metric
											</RadioLabel>
										</Radio>
										<Radio value='imperial' isDisabled={isLoading}>
											<RadioIndicator mr='$2'>
												<RadioIcon as={() => <FontAwesome name='circle' size={13} color='white' />} />
											</RadioIndicator>
											<RadioLabel size='xl' color='white'>
												Imperial
											</RadioLabel>
										</Radio>
									</VStack>
								</RadioGroup>
							</Box>
						</VStack>

						<VStack space='4xl'>
							<Button size='lg' bgColor='$green600' onPress={() => setProfileModal(true)} isDisabled={isLoading}>
								<ButtonText>Update Profile</ButtonText>
							</Button>
							<Button size='lg' bgColor='$green600' onPress={logout} isDisabled={isLoading}>
								<ButtonText>Log out</ButtonText>
							</Button>
							<Button action='negative' onPress={() => setConfirmDelete(true)} isDisabled={isLoading}>
								<ButtonText>Delete Account</ButtonText>
							</Button>
						</VStack>
					</Box>
				</Box>
			</TouchableWithoutFeedback>

			<AlertDialog isOpen={confirmDelete} onClose={() => setConfirmDelete(false)}>
				<AlertDialogBackdrop />
				<AlertDialogContent bgColor='$secondary700' maxHeight='$5/6'>
					<AlertDialogHeader>
						<Heading size='2xl' color='white'>
							Delete Account
						</Heading>
						<AlertDialogCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</AlertDialogCloseButton>
					</AlertDialogHeader>
					<AlertDialogBody>
						<Text color='white'>Are you sure you want to delete your account? This actions is not reversible!</Text>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button variant='outline' action='secondary' mr='$3' onPress={() => setConfirmDelete(false)}>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button action='negative' borderWidth='$0' onPress={deleteAccount}>
							<ButtonText>Delete</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Modal
				isOpen={profileModal}
				onClose={() => {
					setNewFirstName('');
					setNewLastName('');
					setProfileModal(false);
				}}>
				<ModalBackdrop />
				<ModalContent bgColor='$secondary700' maxHeight='$5/6'>
					<ModalHeader>
						<Heading size='2xl' color='white'>
							Update Profile
						</Heading>
						<ModalCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</ModalCloseButton>
					</ModalHeader>
					<ModalBody>
						<VStack space='xl'>
							<Box>
								<Text size='3xl' color='$white'>
									First Name:
								</Text>
								<Input variant='outline' size='xl'>
									<InputField
										value={newFirstName}
										placeholder='Enter New First Name'
										onChangeText={setNewFirstName}
										color='white'
									/>
								</Input>
							</Box>
							<Box>
								<Text size='3xl' color='$white'>
									Last Name:
								</Text>
								<Input variant='outline' size='xl'>
									<InputField
										value={newLastName}
										placeholder='Enter New Last Name'
										onChangeText={setNewLastName}
										color='white'
									/>
								</Input>
							</Box>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button
							variant='outline'
							action='secondary'
							mr='$3'
							onPress={() => {
								setNewFirstName('');
								setNewLastName('');
								setProfileModal(false);
							}}>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button
							action='positive'
							borderWidth='$0'
							onPress={() => {
								setFirstName(newFirstName);
								setLastName(newLastName);
								setNewFirstName('');
								setNewLastName('');
								setProfileModal(false);
							}}>
							<ButtonText>Update</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</SafeAreaView>
	);
}
