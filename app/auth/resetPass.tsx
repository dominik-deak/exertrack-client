import {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	Box,
	Button,
	ButtonText,
	Heading,
	Input,
	InputField,
	SafeAreaView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function ResetPass() {
	const [showAlertDialog, setShowAlertDialog] = useState(false);

	return (
		<SafeAreaView flex={1}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<Box flex={1} alignItems='center' marginTop={50}>
					<VStack space='4xl' w='$4/5'>
						<Box>
							<Heading color='$green500' size='3xl' alignSelf='center'>
								ExerTrack
							</Heading>
							<Text color='$green800' size='3xl' alignSelf='center'>
								Reset Password
							</Text>
						</Box>

						<Box>
							<Text size='3xl' color='$white'>
								Email
							</Text>
							<Input variant='outline' size='xl'>
								<InputField placeholder='Enter Email' color='$white' />
							</Input>
						</Box>

						<Box marginTop={50}>
							<Button size='lg' bgColor='$green600' onPress={() => setShowAlertDialog(true)}>
								<ButtonText>Send Reset Email</ButtonText>
							</Button>
							<Button size='lg' variant='link' onPress={() => router.replace('/auth/login')}>
								<ButtonText color='$green600'>Back to Login</ButtonText>
							</Button>
						</Box>
					</VStack>
				</Box>
			</TouchableWithoutFeedback>

			<AlertDialog isOpen={showAlertDialog} onClose={() => setShowAlertDialog(false)}>
				<AlertDialogBackdrop disabled />
				<AlertDialogContent bgColor='$secondary800'>
					<AlertDialogHeader>
						<Heading size='2xl' color='$white'>
							Reset Email Sent
						</Heading>
					</AlertDialogHeader>
					<AlertDialogBody>
						<Text size='lg' color='$white'>
							Successfully sent password reset email. Please check your inbox for further instructions.
						</Text>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Box alignItems='center'>
							<Button size='lg' bgColor='$green600' onPress={() => router.replace('/auth/login')}>
								<ButtonText>Ok</ButtonText>
							</Button>
						</Box>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SafeAreaView>
	);
}
