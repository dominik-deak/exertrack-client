import { Box, Button, ButtonText, Heading, Input, InputField, SafeAreaView, Text, VStack, View } from '@gluestack-ui/themed';
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
						<View>
							<Heading color='$green500' size='3xl' alignSelf='center'>
								ExerTrack
							</Heading>
							<Text color='$green800' size='3xl' alignSelf='center'>
								Login
							</Text>
						</View>

						<View>
							<Text size='3xl' color='$white'>
								Email
							</Text>
							<Input variant='rounded' size='xl'>
								<InputField onChangeText={setEmail} placeholder='Enter Email' color='$white' />
							</Input>
						</View>
						<View>
							<Text size='3xl' color='$white'>
								Password
							</Text>
							<Input variant='rounded' size='xl'>
								<InputField
									onChangeText={setPassword}
									placeholder='Enter Password'
									type='password'
									color='$white'
								/>
							</Input>
						</View>

						<View marginTop={50}>
							<Button size='lg' bgColor='$green600' onPress={() => router.replace('/(tabs)/progress')}>
								<ButtonText>Login</ButtonText>
							</Button>
							<Button size='lg' variant='link' onPress={() => router.replace('/auth/register')}>
								<ButtonText color='$green600'>Register</ButtonText>
							</Button>
						</View>
					</VStack>
				</Box>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}
