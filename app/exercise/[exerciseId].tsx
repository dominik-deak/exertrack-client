import Dropdown from '@/components/Dropdown';
import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import useTokens from '@/hooks/useTokens';
import { Exercise } from '@/types/Exercise';
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
	Text,
	VStack
} from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

/**
 * The EditExercise component where the user can edit a custom exercise.
 * @returns The edit exercise screen
 */
export default function EditExercise() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const { exerciseId } = useLocalSearchParams();

	// Static data
	const [bodyparts, setBodyparts] = useState<string[]>([]);
	const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
	// Dynamic data
	const [exercise, setExercise] = useState<Exercise | null>(null);
	// Modal state
	const [showUpdateDialog, setShowUpdateDialog] = useState(false);
	const [showBackDialog, setShowBackDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	// Initial exercise, bodyparts and equipment load
	useEffect(() => {
		if (isFocused && accessToken) {
			fetchExercise();
			fetchBodyparts();
			fetchEquipmentTypes();
		}
	}, [isFocused, accessToken]);

	// Token error
	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	// debug
	// useEffect(() => {
	// 	console.log(exercise?.bodypart);
	// 	console.log(exercise?.type);
	// }, [exercise]);

	/**
	 * Fetches the exercise data from the server
	 */
	function fetchExercise() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/exercises/${exerciseId}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(res => {
				const { exercise } = res.data;
				setExercise(exercise);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting exercise failed';
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
	 * Fetches the bodyparts from the server
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
	 * Fetches the equipment types from the server
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
	 * Updates an exercise field
	 * @param field the field to update
	 * @param value the new value
	 */
	function updateExerciseField(field: string, value: string) {
		setExercise(prevExercise => {
			if (prevExercise) {
				return { ...prevExercise, [field]: value };
			}
			return null;
		});
	}

	/**
	 * Validates an exercise by checking that the name, bodypart, and type are set
	 */
	function validateExercise() {
		setIsLoading(true);

		if (!exercise?.name.trim()) {
			setError('Exercise name cannot be empty.');
			setIsLoading(false);
			return;
		}
		if (!exercise?.bodypart) {
			setError('Please select a body part.');
			setIsLoading(false);
			return;
		}
		if (!exercise?.type) {
			setError('Please select an equipment type.');
			setIsLoading(false);
			return;
		}

		setIsLoading(false);
		setShowUpdateDialog(true);
	}

	/**
	 * Updates an exercise on the server.
	 * On success, redirects to the edit-exercises page
	 */
	function updateExercise() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.patch(`${API}/exercises/${exerciseId}`, { exercise }, { headers: { Authorization: `Bearer ${accessToken}` } })
			.then(() => {
				router.replace('/exercise/edit-exercises');
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Updating exercise failed';
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
	 * Deletes an exercise on the server.
	 * On success, redirects to the edit-exercises page
	 */
	function deleteExercise() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.delete(`${API}/exercises/${exerciseId}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(() => {
				router.replace('/exercise/edit-exercises');
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Deleting exercise failed';
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
					<ButtonText color='white'>Back to Exercises</ButtonText>
				</Button>
			</Box>

			{exercise && (
				<Box alignItems='center' marginBottom={20}>
					<VStack space='2xl' w='$5/6'>
						<Box>
							<Text size='2xl' color='$white' mb={10}>
								Exercise Name
							</Text>
							<Input isDisabled={isLoading} variant='outline' size='md'>
								<InputField
									value={exercise.name}
									onChangeText={val => updateExerciseField('name', val)}
									placeholder='Exercise Name'
									color='$white'
								/>
							</Input>
						</Box>
						<Box>
							<Text size='2xl' color='$white' mb={10}>
								Exercise Bodypart
							</Text>
							<Dropdown
								items={bodyparts}
								defaultValue={exercise.bodypart}
								// for some reason the dropdown item becomes lowercase, need to capitalise it
								onChange={val => updateExerciseField('bodypart', val.charAt(0).toUpperCase() + val.slice(1))}
								isDisabled={isLoading}
							/>
						</Box>
						<Box>
							<Text size='2xl' color='$white' mb={10}>
								Exercise Equipment Type
							</Text>
							<Dropdown
								items={equipmentTypes}
								defaultValue={exercise.type}
								// for some reason the dropdown item becomes lowercase, need to capitalise it
								onChange={val => updateExerciseField('type', val.charAt(0).toUpperCase() + val.slice(1))}
								isDisabled={isLoading}
							/>
						</Box>

						<Button onPress={validateExercise} isDisabled={isLoading} bgColor='$green600' marginTop={20}>
							<ButtonText color='white'>Update Exercise</ButtonText>
						</Button>
						<Button
							action='negative'
							onPress={() => setShowDeleteDialog(true)}
							isDisabled={isLoading}
							marginTop={20}>
							<ButtonText color='white'>Delete Exercise</ButtonText>
						</Button>
					</VStack>
				</Box>
			)}

			{/* Update Confirmation */}
			<AlertDialog isOpen={showUpdateDialog} onClose={() => setShowUpdateDialog(false)}>
				<AlertDialogBackdrop />
				<AlertDialogContent bgColor='$secondary700' maxHeight='$5/6'>
					<AlertDialogHeader>
						<Heading size='2xl' color='white'>
							Update Exercise
						</Heading>
						<AlertDialogCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</AlertDialogCloseButton>
					</AlertDialogHeader>
					<AlertDialogBody>
						<Text color='white'>Are you sure you want to update this exercise?</Text>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button
							onPress={() => setShowUpdateDialog(false)}
							isDisabled={isLoading}
							variant='outline'
							action='secondary'
							mr='$3'>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button bgColor='$green600' onPress={updateExercise} isDisabled={isLoading}>
							<ButtonText>Update</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Confirmation */}
			<AlertDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
				<AlertDialogBackdrop />
				<AlertDialogContent bgColor='$secondary700' maxHeight='$5/6'>
					<AlertDialogHeader>
						<Heading size='2xl' color='white'>
							Delete Exercise
						</Heading>
						<AlertDialogCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</AlertDialogCloseButton>
					</AlertDialogHeader>
					<AlertDialogBody>
						<Text color='white'>Are you sure you want to delete this exercise? This action cannot be undone.</Text>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button
							onPress={() => setShowDeleteDialog(false)}
							isDisabled={isLoading}
							variant='outline'
							action='secondary'
							mr='$3'>
							<ButtonText color='white'>Cancel</ButtonText>
						</Button>
						<Button action='negative' onPress={deleteExercise} isDisabled={isLoading}>
							<ButtonText>Delete</ButtonText>
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
							Are you sure you want to return to your exercises? Your exercise changes will not be saved.
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
