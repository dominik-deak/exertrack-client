import Dropdown from '@/components/Dropdown';
import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import useTokens from '@/hooks/useTokens';
import { ExerciseSubmission } from '@/types/Exercise';
import { AntDesign } from '@expo/vector-icons';
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
	SafeAreaView,
	ScrollView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

/**
 * The create exercise page where the user can create a custom exercise.
 * @returns The create exercise page
 */
export default function CreateExercise() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// Static data
	const [bodyparts, setBodyparts] = useState<string[]>([]);
	const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
	// Dynamic data
	const [exerciseName, setExerciseName] = useState('');
	const [selectedBodypart, setSelectedBodypart] = useState<string>('');
	const [selectedType, setSelectedType] = useState<string>('');
	// Modal states
	const [showBackDialog, setShowBackDialog] = useState(false);
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	// Initial bodyparts and equipment data
	useEffect(() => {
		if (isFocused && accessToken) {
			fetchBodyparts();
			fetchEquipmentTypes();
		}
	}, [accessToken, isFocused]);

	// Token errors
	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	// debug
	// useEffect(() => {
	// 	console.log(selectedBodypart);
	// 	console.log(selectedType);
	// }, [selectedBodypart, selectedType]);

	/**
	 * Fetches the bodyparts from the server.
	 */
	function fetchBodyparts() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/exercises/bodyparts`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(res => {
				const { bodyparts } = res.data;
				setBodyparts(bodyparts);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting bodyparts failed';
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
	 * Fetches the equipment types from the server.
	 */
	function fetchEquipmentTypes() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/exercises/equipmentTypes`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(res => {
				const { equipmentTypes } = res.data;
				setEquipmentTypes(equipmentTypes);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting equipment types failed';
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
	 * Validates the exercise data by checking that the name, bodypart, and type are set
	 */
	function validateExercise() {
		setIsLoading(true);

		if (!exerciseName.trim()) {
			setError('Exercise name cannot be empty.');
			setIsLoading(false);
			return;
		}
		if (!selectedBodypart) {
			setError('Please select a body part.');
			setIsLoading(false);
			return;
		}
		if (!selectedType) {
			setError('Please select an equipment type.');
			setIsLoading(false);
			return;
		}

		setIsLoading(false);
		setShowCreateDialog(true);
	}

	/**
	 * Creates the exercise by sending a POST request to the server.
	 * On success, navigates to the edit exercises screen.
	 */
	function createExercise() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		const exerciseSubmission: ExerciseSubmission = {
			name: exerciseName,
			bodypart: selectedBodypart,
			type: selectedType
		};

		axios
			.post(`${API}/exercises`, { exerciseSubmission }, { headers: { Authorization: `Bearer ${accessToken}` } })
			.then(() => {
				router.replace('/exercise/edit-exercises');
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Creating exercise failed';
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

			<Box alignItems='center'>
				<Button onPress={() => setShowBackDialog(true)} isDisabled={isLoading} bgColor='$green600' marginVertical={20}>
					<ButtonText color='white'>Back to Your Exercises</ButtonText>
				</Button>
			</Box>

			<ScrollView>
				<Box alignItems='center'>
					<VStack w='$5/6'>
						<Text size='3xl' color='$white' mb={10}>
							Exercise Name
						</Text>
						<Input isDisabled={isLoading} variant='outline' size='lg' mb={20}>
							<InputField
								value={exerciseName}
								onChangeText={setExerciseName}
								placeholder='Exercise Name'
								color='$white'
							/>
						</Input>
						<Text size='3xl' color='$white' mb={10}>
							Exercise Bodypart
						</Text>
						<Dropdown
							items={bodyparts}
							// for some reason the dropdown item becomes lowercase, need to capitalise it
							onChange={val => setSelectedBodypart(val.charAt(0).toUpperCase() + val.slice(1))}
							isDisabled={isLoading}
						/>
						<Text size='3xl' color='$white' mb={10} mt={20}>
							Exercise Equipment Type
						</Text>
						<Dropdown
							items={equipmentTypes}
							// for some reason the dropdown item becomes lowercase, need to capitalise it
							onChange={val => setSelectedType(val.charAt(0).toUpperCase() + val.slice(1))}
							isDisabled={isLoading}
						/>

						<Button onPress={validateExercise} isDisabled={isLoading} bgColor='$green600' marginTop={40}>
							<ButtonText color='white'>Create Exercise</ButtonText>
						</Button>
					</VStack>
				</Box>
			</ScrollView>

			{/* Create Confirmation */}
			<AlertDialog isOpen={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
				<AlertDialogBackdrop />
				<AlertDialogContent bgColor='$secondary700' maxHeight='$5/6'>
					<AlertDialogHeader>
						<Heading size='2xl' color='white'>
							Create Exercise
						</Heading>
						<AlertDialogCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</AlertDialogCloseButton>
					</AlertDialogHeader>
					<AlertDialogBody>
						<Text color='white'>Are you sure you want to create this exercise?</Text>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button
							onPress={() => setShowCreateDialog(false)}
							isDisabled={isLoading}
							variant='outline'
							action='secondary'
							mr='$3'>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button bgColor='$green600' onPress={createExercise} isDisabled={isLoading}>
							<ButtonText>Create</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Back confirmation */}
			<AlertDialog isOpen={showBackDialog} onClose={() => setShowBackDialog(false)}>
				<AlertDialogBackdrop />
				<AlertDialogContent bgColor='$secondary700' maxHeight='$5/6'>
					<AlertDialogHeader>
						<Heading size='2xl' color='white'>
							Back to exercises
						</Heading>
						<AlertDialogCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</AlertDialogCloseButton>
					</AlertDialogHeader>
					<AlertDialogBody>
						<Text color='white'>
							Are you sure you want to return to your exercises? Your new exercises will not be saved.
						</Text>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button
							variant='outline'
							action='secondary'
							mr='$3'
							onPress={() => setShowBackDialog(false)}
							isDisabled={isLoading}>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button bgColor='$green600' onPress={router.back} isDisabled={isLoading}>
							<ButtonText>Back</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SafeAreaView>
	);
}
