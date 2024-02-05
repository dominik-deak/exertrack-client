import { Box, Button, ButtonText, Heading, Input, InputField, SafeAreaView, Text, VStack } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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
								Login
							</Text>
						</Box>

						<Box>
							<Text size='3xl' color='$white'>
								Email
							</Text>
							<Input variant='outline' size='xl'>
								<InputField onChangeText={setEmail} placeholder='Enter Email' color='$white' />
							</Input>
						</Box>
						<Box>
							<Text size='3xl' color='$white'>
								Password
							</Text>
							<Input variant='outline' size='xl'>
								<InputField
									onChangeText={setPassword}
									placeholder='Enter Password'
									type='password'
									color='$white'
								/>
							</Input>
						</Box>

						<Box marginTop={50}>
							<Button size='lg' bgColor='$green600' onPress={() => router.replace('/(tabs)/progress')}>
								<ButtonText>Log In</ButtonText>
							</Button>
							<Button size='lg' variant='link' onPress={() => router.replace('/auth/register')}>
								<ButtonText color='$green600'>Register</ButtonText>
							</Button>
						</Box>
					</VStack>
				</Box>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}
