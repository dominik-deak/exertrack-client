import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import { useUnitPreference } from '@/contexts/UnitPreferenceContext';
import useTokens from '@/hooks/useTokens';
import { User } from '@/types/User';
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
	ScrollView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

/**
 * The Settings page.
 * Includes settings for:
 * - switching between metric and imperial units
 * - editing profile
 * - internal password reset
 * - account deletion
 * @returns The Settings page component.
 */
export default function Settings() {
	const isFocused = useIsFocused();
	const { accessToken, refreshToken, tokenError, setAccessToken, setRefreshToken } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const { unit, toggleUnit } = useUnitPreference();

	const [profileModal, setProfileModal] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [newFirstName, setNewFirstName] = useState('');
	const [newLastName, setNewLastName] = useState('');

	const [passwordResetModal, setPasswordResetModal] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newOrConfirmPassword, setNewOrConfirmPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [passwordResetSuccessMsg, setpasswordResetSuccessMsg] = useState('');

	const [deleteAccountModal, setDeleteAccountModal] = useState(false);

	const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
	const [accDeletedMsg, setAccDeletedMsg] = useState('');

	useEffect(() => {
		if (isFocused && accessToken) getUser();
	}, [isFocused, accessToken]);

	useEffect(() => {
		if (tokenError && isFocused) setError(tokenError);
	}, [accessToken, refreshToken, tokenError, isFocused]);

	/**
	 * Fetches the user from the server.
	 */
	function getUser() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/user`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(res => {
				const { user } = res.data;
				setUser(user);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting user profile failed';
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

	/**
	 * Updates the user's profile on the server.
	 * @param firstName new first name
	 * @param lastName new last name
	 */
	async function updateProfile(firstName: string, lastName: string) {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.patch(`${API}/user/name`, { firstName, lastName }, { headers: { Authorization: `Bearer ${accessToken}` } })
			.then(res => {
				const { user }: { user: User } = res.data;
				setUser(user);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Updating profile failed';
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

	/**
	 * Updates the user's password on the server.
	 * Checks if the old password is correct and the new password is not the same as the old.
	 */
	async function updatePassword() {
		setIsLoading(true);

		if (!currentPassword || !newOrConfirmPassword || !confirmNewPassword) {
			setError('Please fill in all fields');
			setIsLoading(false);
			return;
		}
		if (currentPassword === newOrConfirmPassword) {
			setError('New password cannot be the same as current password');
			setIsLoading(false);
			return;
		}
		if (newOrConfirmPassword !== confirmNewPassword) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}
		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.patch(
				`${API}/user/password`,
				{ currentPassword, newPassword: newOrConfirmPassword },
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			)
			.then(() => {
				setpasswordResetSuccessMsg('Password updated successfully');
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Updating password failed';
				} else if (error instanceof Error) {
					message = error.message;
				} else {
					message = 'An unexpected error occurred';
				}
				setError(message);
			})
			.finally(() => {
				setIsLoading(false);
				setNewOrConfirmPassword('');
				setCurrentPassword('');
				setConfirmNewPassword('');
				setPasswordResetModal(false);
			});
	}

	/**
	 * Logs the user out of the application and redirects them to the login page.
	 */
	async function logout() {
		setIsLoading(true);

		if (!accessToken || !refreshToken) {
			setError("Can't access tokens");
			setIsLoading(false);
			return;
		}

		axios
			.delete(`${API}/auth/logout`, {
				data: { refreshToken },
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(async () => {
				await setAccessToken(null);
				await setRefreshToken(null);

				router.replace('/auth/login');
			})
			.catch(error => {
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

	/**
	 * Checks if the user's password is correct and allows them to delete their account.
	 */
	async function checkDeletePassword() {
		setIsLoading(true);

		if (currentPassword === '' || newOrConfirmPassword === '') {
			setError('Please fill in password.');
			setIsLoading(false);
			return;
		}
		if (currentPassword !== newOrConfirmPassword) {
			setError('Passwords do not match.');
			setIsLoading(false);
			return;
		}

		axios
			.post(`${API}/auth/check-password`, { currentPassword }, { headers: { Authorization: `Bearer ${accessToken}` } })
			.then(() => {
				setDeleteAccountModal(false);
				setConfirmDeleteModal(true);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Checking password failed';
				} else if (error instanceof Error) {
					message = error.message;
				} else {
					message = 'An unexpected error occurred';
				}
				setError(message);
			})
			.finally(() => {
				setCurrentPassword('');
				setNewOrConfirmPassword('');
				setIsLoading(false);
			});
	}

	/**
	 * Deletes the user's account on the server and redirects them to the login page.
	 */
	async function deleteAccount() {
		setIsLoading(true);

		if (!accessToken || !refreshToken) {
			setError("Can't access tokens");
			setIsLoading(false);
			return;
		}

		axios
			.delete(`${API}/auth/delete-account`, {
				headers: { Authorization: `Bearer ${accessToken}` },
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
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Deleting account failed';
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
			{isLoading && <LoadingModal />}
			<MessageModal message={error} setMessage={setError} heading='Error' btnText='Ok' btnAction={() => setError('')} />
			<MessageModal
				message={passwordResetSuccessMsg}
				setMessage={setpasswordResetSuccessMsg}
				heading='Password Has Been Reset'
				btnText='Ok'
				btnAction={() => setpasswordResetSuccessMsg('')}
			/>
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

					<ScrollView>
						<Box alignItems='center' mt={30}>
							<VStack space='2xl' w='$5/6' mb={30}>
								<Box bgColor='$secondary800' padding={15} borderRadius={10}>
									<Text color='white' size='2xl'>
										First Name: {user?.firstName || 'Not set'}
									</Text>
								</Box>
								<Box bgColor='$secondary800' padding={15} borderRadius={10}>
									<Text color='white' size='2xl'>
										Last Name: {user?.lastName || 'Not set'}
									</Text>
								</Box>
								<Box bgColor='$secondary800' padding={15} borderRadius={10}>
									<Text color='white' size='2xl'>
										Email: {user?.email || 'Not set'}
									</Text>
								</Box>

								{/* TODO replace FontAwesome icons with gluestack icons */}
								<Box bgColor='$secondary800' padding={15} borderRadius={10}>
									<Text color='white' size='2xl' marginBottom={10}>
										Measurement Units:
									</Text>
									<RadioGroup value={unit} onChange={() => toggleUnit()} marginLeft={30}>
										<VStack space='sm'>
											<Radio value='kilos' isDisabled={isLoading}>
												<RadioIndicator mr='$2'>
													<RadioIcon
														as={() => <FontAwesome name='circle' size={13} color='white' />}
													/>
												</RadioIndicator>
												<RadioLabel size='xl' color='white'>
													Kilos
												</RadioLabel>
											</Radio>
											<Radio value='pounds' isDisabled={isLoading}>
												<RadioIndicator mr='$2'>
													<RadioIcon
														as={() => <FontAwesome name='circle' size={13} color='white' />}
													/>
												</RadioIndicator>
												<RadioLabel size='xl' color='white'>
													Pounds
												</RadioLabel>
											</Radio>
										</VStack>
									</RadioGroup>
								</Box>
							</VStack>

							<VStack space='4xl'>
								<Button
									size='lg'
									bgColor='$green600'
									onPress={() => setProfileModal(true)}
									isDisabled={isLoading}>
									<ButtonText>Update Profile</ButtonText>
								</Button>
								<Button
									size='lg'
									bgColor='$green600'
									onPress={() => setPasswordResetModal(true)}
									isDisabled={isLoading}>
									<ButtonText>Update Password</ButtonText>
								</Button>
								<Button size='lg' bgColor='$green600' onPress={logout} isDisabled={isLoading}>
									<ButtonText>Log out</ButtonText>
								</Button>
								<Button action='negative' onPress={() => setDeleteAccountModal(true)} isDisabled={isLoading}>
									<ButtonText>Delete Account</ButtonText>
								</Button>
							</VStack>
						</Box>
					</ScrollView>
				</Box>
			</TouchableWithoutFeedback>

			{/* Delete account confirmation */}
			<AlertDialog isOpen={confirmDeleteModal} onClose={() => setConfirmDeleteModal(false)}>
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
						<Button variant='outline' action='secondary' mr='$3' onPress={() => setConfirmDeleteModal(false)}>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button action='negative' borderWidth='$0' onPress={deleteAccount}>
							<ButtonText>Delete</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Profile modal */}
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
								<Text size='xl' color='$white'>
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
								<Text size='xl' color='$white'>
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
								updateProfile(newFirstName, newLastName);
								setNewFirstName('');
								setNewLastName('');
								setProfileModal(false);
							}}>
							<ButtonText>Update</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Password reset modal */}
			<Modal
				isOpen={passwordResetModal}
				onClose={() => {
					setNewOrConfirmPassword('');
					setCurrentPassword('');
					setConfirmNewPassword('');
					setPasswordResetModal(false);
				}}>
				<ModalBackdrop />
				<ModalContent bgColor='$secondary700' maxHeight='$5/6'>
					<ModalHeader>
						<Heading size='2xl' color='white'>
							Reset Password
						</Heading>
						<ModalCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</ModalCloseButton>
					</ModalHeader>
					<ModalBody>
						<VStack space='xl'>
							<Box>
								<Text size='xl' color='$white'>
									Current Password
								</Text>
								<Input variant='outline' size='xl'>
									<InputField
										type='password'
										value={currentPassword}
										placeholder='Enter Current Password'
										onChangeText={setCurrentPassword}
										color='white'
									/>
								</Input>
							</Box>
							<Box>
								<Text size='xl' color='$white'>
									New Password
								</Text>
								<Input variant='outline' size='xl'>
									<InputField
										type='password'
										value={newOrConfirmPassword}
										placeholder='Enter New Password'
										onChangeText={setNewOrConfirmPassword}
										color='white'
									/>
								</Input>
							</Box>
							<Box>
								<Text size='xl' color='$white'>
									Confirm New Password
								</Text>
								<Input variant='outline' size='xl'>
									<InputField
										type='password'
										value={confirmNewPassword}
										placeholder='Confirm New Password'
										onChangeText={setConfirmNewPassword}
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
								setNewOrConfirmPassword('');
								setPasswordResetModal(false);
							}}>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button action='positive' borderWidth='$0' onPress={updatePassword}>
							<ButtonText>Update</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Delete account modal */}
			<Modal
				isOpen={deleteAccountModal}
				onClose={() => {
					setCurrentPassword('');
					setNewOrConfirmPassword('');
					setDeleteAccountModal(false);
				}}>
				<ModalBackdrop />
				<ModalContent bgColor='$secondary700' maxHeight='$5/6'>
					<ModalHeader>
						<Heading size='2xl' color='white'>
							Reset Password
						</Heading>
						<ModalCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</ModalCloseButton>
					</ModalHeader>
					<ModalBody>
						<VStack space='xl'>
							<Box>
								<Text size='xl' color='$white'>
									Current Password
								</Text>
								<Input variant='outline' size='xl'>
									<InputField
										type='password'
										value={currentPassword}
										placeholder='Enter Current Password'
										onChangeText={setCurrentPassword}
										color='white'
									/>
								</Input>
							</Box>
							<Box>
								<Text size='xl' color='$white'>
									Confirm Current Password
								</Text>
								<Input variant='outline' size='xl'>
									<InputField
										type='password'
										value={newOrConfirmPassword}
										placeholder='Enter Current Password'
										onChangeText={setNewOrConfirmPassword}
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
								setCurrentPassword('');
								setNewOrConfirmPassword('');
								setDeleteAccountModal(false);
							}}>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button action='negative' borderWidth='$0' onPress={checkDeletePassword}>
							<ButtonText>Delete</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</SafeAreaView>
	);
}
