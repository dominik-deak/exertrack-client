import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import useTokens from '@/hooks/useTokens';
import { Exercise } from '@/types/Exercise';
import { Box, Button, ButtonText, Divider, Heading, SafeAreaView, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';

/**
 * The EditUserExercises component where the user can edit their custom exercises.
 * @returns The EditUserExercises component.
 */
export default function EditUserExercises() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [userExercises, setUserExercises] = useState<Exercise[]>([]);

	// Initial exercise data
	useEffect(() => {
		if (isFocused && accessToken) fetchUserExercises();
	}, [isFocused, accessToken]);

	// Token errors
	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	/**
	 * Fetches the user exercises from the server.
	 */
	function fetchUserExercises() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/exercises/user`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(res => {
				const { userExercises } = res.data;
				setUserExercises(userExercises);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting user exercises failed';
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

			<Box alignItems='center' marginBottom={20}>
				<Button onPress={router.back} isDisabled={isLoading} bgColor='$green600' marginVertical={20}>
					<ButtonText color='white'>Back to Templates</ButtonText>
				</Button>
				<Heading color='$green500' size='3xl'>
					Your Exercises
				</Heading>
				<Text color='$green700' size='xl'>
					Click an exercise to edit:
				</Text>
			</Box>

			<ScrollView>
				<Box alignItems='center' pb={100}>
					<VStack space='4xl' w='$5/6'>
						<Divider />
						{userExercises.length > 0 ? (
							<>
								{userExercises.map(exercise => (
									<Link
										key={exercise.id}
										href={{
											pathname: '/exercise/[exerciseId]',
											params: { exerciseId: exercise.id }
										}}
										asChild>
										<Button size='xl' bgColor='$green600'>
											<ButtonText>{exercise.name}</ButtonText>
										</Button>
									</Link>
								))}
							</>
						) : (
							<Box alignItems='center'>
								<Text color='$green700' size='xl'>
									No exercises found
								</Text>
							</Box>
						)}

						<Divider />
						<Link href='/exercise/create-exercise' asChild>
							<Button size='xl' action='secondary'>
								<ButtonText>Create New Exercise</ButtonText>
							</Button>
						</Link>
					</VStack>
				</Box>
			</ScrollView>
		</SafeAreaView>
	);
}
