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
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function settings() {
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showAlertDialog, setShowAlertDialog] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [newFirstName, setNewFirstName] = useState('');
	const [newLastName, setNewLastName] = useState('');
	const [measurement, setMeasurement] = useState('metric');

	return (
		<SafeAreaView flex={1}>
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
										<Radio value='metric'>
											<RadioIndicator mr='$2'>
												<RadioIcon as={() => <FontAwesome name='circle' size={13} color='white' />} />
											</RadioIndicator>
											<RadioLabel size='xl' color='white'>
												Metric
											</RadioLabel>
										</Radio>
										<Radio value='imperial'>
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
							<Button size='lg' bgColor='$green600' onPress={() => setShowProfileModal(true)}>
								<ButtonText>Update Profile</ButtonText>
							</Button>
							<Button size='lg' bgColor='$green600' onPress={() => router.replace('/auth/login')}>
								<ButtonText>Log out</ButtonText>
							</Button>
							<Button action='negative' onPress={() => setShowDeleteDialog(true)}>
								<ButtonText>Delete Account</ButtonText>
							</Button>
						</VStack>
					</Box>
				</Box>
			</TouchableWithoutFeedback>

			<Modal
				isOpen={showProfileModal}
				onClose={() => {
					setNewFirstName('');
					setNewLastName('');
					setShowProfileModal(false);
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
								setShowProfileModal(false);
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
								setShowProfileModal(false);
							}}>
							<ButtonText>Update</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<AlertDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
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
						<Button variant='outline' action='secondary' mr='$3' onPress={() => setShowDeleteDialog(false)}>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button action='negative' borderWidth='$0' onPress={() => setShowAlertDialog(true)}>
							<ButtonText>Delete</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog isOpen={showAlertDialog} onClose={() => setShowAlertDialog(false)}>
				<AlertDialogBackdrop />
				<AlertDialogContent bgColor='$secondary700'>
					<AlertDialogHeader>
						<Heading size='lg' color='white'>
							Account Deleted
						</Heading>
					</AlertDialogHeader>
					<AlertDialogBody>
						<Text color='white'>
							You have successfully deleted your account. If you wish to continue using ExerTrack, please register
							again.
						</Text>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button action='positive' onPress={() => router.replace('/auth/login')}>
							<ButtonText>Okay</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SafeAreaView>
	);
}
