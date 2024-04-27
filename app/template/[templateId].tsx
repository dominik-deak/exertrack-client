import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import useTokens from '@/hooks/useTokens';
import { Template, TemplateExercise } from '@/types/Template';
import { AntDesign, Feather } from '@expo/vector-icons';
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
	ButtonIcon,
	ButtonText,
	Checkbox,
	CheckboxGroup,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
	CloseIcon,
	Divider,
	HStack,
	Heading,
	Input,
	InputField,
	KeyboardAvoidingView,
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	SafeAreaView,
	ScrollView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * The edit template screen where the user can edit a template.
 * @returns The edit template screen
 */
export default function EditTemplate() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const { templateId } = useLocalSearchParams();
	// Static data
	const [defaultExercises, setDefaultExercises] = useState<TemplateExercise[]>([]);
	const [userExercises, setUserExercises] = useState<TemplateExercise[]>([]);
	const [bodyparts, setBodyparts] = useState<string[]>([]);
	const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
	// Dynamic data
	const [template, setTemplate] = useState<Template | null>(null);
	// Exercise filtering states
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedBodyparts, setSelectedBodyparts] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [filteredExercises, setFilteredExercises] = useState<TemplateExercise[]>([]);
	// Modal state
	const [showExerciseModal, setShowExerciseModal] = useState(false);
	const [showBodypartModal, setShowBodypartModal] = useState(false);
	const [showTypeModal, setShowTypeModal] = useState(false);
	const [showUpdateDialog, setShowUpdateDialog] = useState(false);
	const [showBackDialog, setShowBackDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	// Initial template load
	useEffect(() => {
		if (isFocused && accessToken) fetchTemplate();
	}, [isFocused, accessToken]);

	// When opening exercise modal, initial exercises loaded
	useEffect(() => {
		if (showExerciseModal && !(filteredExercises.length > 0)) {
			fetchExercises();
		}
	}, [showExerciseModal]);

	// Setting initial exercises
	useEffect(() => {
		setFilteredExercises([...defaultExercises, ...userExercises]);
	}, [defaultExercises, userExercises]);

	// When opening bodypart modal
	useEffect(() => {
		if (showBodypartModal) fetchBodyparts();
	}, [showBodypartModal]);

	// When opening type modal
	useEffect(() => {
		if (showTypeModal) fetchEquipmentTypes();
	}, [showTypeModal]);

	// Filtering
	useEffect(() => {
		filterExercises();
	}, [searchTerm, selectedBodyparts, selectedTypes]);

	// Token error
	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	// debugging
	// useEffect(() => {
	// 	console.log(template?.exercises);
	// }, [template?.exercises]);

	/**
	 * Fetches the template with the given id from the server.
	 */
	function fetchTemplate() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/templates/${templateId}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(res => {
				const { template } = res.data;
				setTemplate(template);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting template failed';
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
	 * Fetches all exercises from the server.
	 */
	function fetchExercises() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/exercises`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(res => {
				const { defaultExercises, userExercises } = res.data;
				setDefaultExercises(defaultExercises);
				setUserExercises(userExercises);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting template failed';
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
	 * Fetches all bodyparts from the server.
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
	 * Fetches all equipment types from the server.
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
	 * Filters exercises based on search term, bodyparts, and types
	 */
	function filterExercises() {
		let matchingExercises = [...defaultExercises, ...userExercises];
		if (selectedTypes.length > 0) {
			matchingExercises = matchingExercises.filter(exercise => selectedTypes.includes(exercise.type));
		}
		if (selectedBodyparts.length > 0) {
			matchingExercises = matchingExercises.filter(exercise => selectedBodyparts.includes(exercise.bodypart));
		}
		if (searchTerm.trim() !== '') {
			matchingExercises = matchingExercises.filter(exercise =>
				exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		setFilteredExercises(matchingExercises);
	}

	/**
	 * Resets all filters on the exercise modal
	 */
	function resetFilters() {
		setSelectedTypes([]);
		setSelectedBodyparts([]);
		setSearchTerm('');
	}

	/**
	 * Adds an exercise to the template
	 * @param newExercise exercise to add
	 */
	function addExercise(newExercise: TemplateExercise) {
		if (!template || !template.exercises) {
			setError('Template is not loaded properly.');
			return;
		}

		const isDuplicate = template.exercises.some(exercise => exercise.id === newExercise.id);
		if (isDuplicate) {
			setError('This exercise has already been added to the template.');
			return;
		}

		const updatedExercises = [...template.exercises, newExercise];
		setTemplate({ ...template, exercises: updatedExercises });
		setShowExerciseModal(false);
	}

	/**
	 * Removes an exercise from the template
	 * @param exerciseId The id of the exercise
	 */
	function removeExercise(exerciseId: string) {
		if (template && template.exercises) {
			const updatedExercises = template.exercises.filter(exercise => exercise.id !== exerciseId);
			setTemplate({ ...template, exercises: updatedExercises });
		}
	}

	/**
	 * Handles changes to a set in the template
	 * @param exerciseId The id of the exercise
	 * @param field The field to update
	 * @param value The new value
	 */
	function handleSetChange(exerciseId: string, field: string, value: string) {
		function isValidNum(value: string): boolean {
			if (value === '') return true;
			const num = Number(value);
			return !isNaN(num) && isFinite(num) && num >= 0;
		}

		if (template && template.exercises && isValidNum(value)) {
			const newValue = value === '' ? null : Number(value);
			const updatedExercises = template.exercises.map(exercise => {
				return exercise.id === exerciseId ? { ...exercise, [field]: newValue } : exercise;
			});
			setTemplate({ ...template, exercises: updatedExercises });
		}
	}

	/**
	 * Validates the template by checking that all sets, minimum reps, and maximum reps are set and greater than 0
	 */
	function validateTemplate() {
		setIsLoading(true);

		if (!template || template.exercises.length === 0) {
			setError('The template must contain at least one exercise.');
			setIsLoading(false);
			return;
		}

		for (const exercise of template.exercises) {
			if (exercise.sets <= 0 || exercise.repsMin <= 0 || exercise.repsMax <= 0) {
				setIsLoading(false);
				setError('All sets, minimum reps, and maximum reps must be set, and greater than 0.');
				return;
			}
			if (exercise.repsMin > exercise.repsMax) {
				setIsLoading(false);
				setError('Minimum reps cannot be greater than maximum reps.');
				return;
			}
		}

		setIsLoading(false);
		setShowUpdateDialog(true);
	}

	/**
	 * Updates the template on the server.
	 * On success, redirects to the workout page
	 */
	function updateTemplate() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.patch(`${API}/templates/${templateId}`, { template }, { headers: { Authorization: `Bearer ${accessToken}` } })
			.then(() => {
				router.replace('/(tabs)/workout');
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Updating template failed';
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
	 * Deletes the template on the server.
	 * On success, redirects to the workout page
	 */
	function deleteTemplate() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.delete(`${API}/templates/${templateId}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(() => {
				router.replace('/(tabs)/workout');
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Deleting template failed';
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
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'height'} style={{ flex: 1, zIndex: 999 }}>
			<SafeAreaView flex={1}>
				{isLoading && <LoadingModal />}
				<MessageModal
					message={error}
					setMessage={setError}
					heading='Error'
					btnText='Ok'
					btnAction={() => setError('')}
				/>

				<Box alignItems='center'>
					<Button
						onPress={() => setShowBackDialog(true)}
						isDisabled={isLoading}
						bgColor='$green600'
						marginVertical={20}>
						<ButtonText color='white'>Back to Templates</ButtonText>
					</Button>
				</Box>

				{template && (
					<>
						<ScrollView>
							<Box alignItems='center'>
								<VStack space='4xl' w='$5/6'>
									<Box>
										<Text size='xl' color='$white'>
											Template Name
										</Text>
										<Input isDisabled={isLoading} variant='outline' size='lg' mt={10}>
											<InputField
												value={template.name}
												onChangeText={text => setTemplate({ ...template, name: text })}
												placeholder='Template Name'
												color='$white'
											/>
										</Input>
									</Box>
									{template?.exercises?.map(exercise => (
										<Box key={exercise.id} bgColor='$secondary800' padding={15} borderRadius={10}>
											<Box flexDirection='row' justifyContent='space-between'>
												<VStack space='sm'>
													<Text bold size='xl' color='$green500'>
														{exercise.name}
													</Text>
													<Text italic size='lg' color='white'>
														Target: {exercise.bodypart}
													</Text>
												</VStack>
												<Button
													onPress={() => removeExercise(exercise.id)}
													disabled={isLoading}
													bgColor='gray'>
													<ButtonIcon as={CloseIcon} />
												</Button>
											</Box>
											<Divider marginVertical={10} />
											<VStack space='xl'>
												<Box>
													<Text size='xl' color='$white'>
														Number of Sets (Approximate)
													</Text>
													<Input isDisabled={isLoading} variant='outline' size='lg' mt={10}>
														<InputField
															value={exercise.sets?.toString()}
															onChangeText={text => handleSetChange(exercise.id, 'sets', text)}
															keyboardType='decimal-pad'
															placeholder='Sets'
															color='$white'
														/>
													</Input>
												</Box>
												<Box>
													<Text size='xl' color='$white'>
														Mininum number of Reps per Set (Approximate)
													</Text>
													<Input isDisabled={isLoading} variant='outline' size='lg' mt={10}>
														<InputField
															value={exercise.repsMin?.toString()}
															onChangeText={text => handleSetChange(exercise.id, 'repsMin', text)}
															keyboardType='decimal-pad'
															placeholder='Reps'
															color='$white'
														/>
													</Input>
												</Box>
												<Box>
													<Text size='xl' color='$white'>
														Maximum number of Reps per Set (Approximate)
													</Text>
													<Input isDisabled={isLoading} variant='outline' size='lg' mt={10}>
														<InputField
															value={exercise.repsMax?.toString()}
															onChangeText={text => handleSetChange(exercise.id, 'repsMax', text)}
															keyboardType='decimal-pad'
															placeholder='Reps'
															color='$white'
														/>
													</Input>
												</Box>
											</VStack>
										</Box>
									))}
								</VStack>
							</Box>
							<Box alignItems='center'>
								<Button
									onPress={() => setShowExerciseModal(true)}
									isDisabled={isLoading}
									bgColor='$green600'
									marginVertical={20}>
									<ButtonText color='white'>Add Exercise</ButtonText>
								</Button>
							</Box>
						</ScrollView>

						<Box alignItems='center' pt={10}>
							<Button onPress={validateTemplate} isDisabled={isLoading} bgColor='$green600' w='$2/3'>
								<ButtonText color='white'>Update Template</ButtonText>
							</Button>
							<Button
								action='negative'
								onPress={() => setShowDeleteDialog(true)}
								isDisabled={isLoading}
								w='$2/3'
								mt={20}>
								<ButtonText color='white'>Delete Template</ButtonText>
							</Button>
						</Box>
					</>
				)}

				{/* TODO extract to component */}
				{/* Exercise Modal */}
				<Modal isOpen={showExerciseModal} onClose={() => setShowExerciseModal(false)}>
					<ModalBackdrop />
					<ModalContent bgColor='$secondary700' maxHeight='$5/6'>
						<ModalHeader>
							<Heading size='2xl' color='white'>
								Add Exercise
							</Heading>
							<ModalCloseButton>
								<AntDesign name='close' size={24} color='white' />
							</ModalCloseButton>
						</ModalHeader>
						<ModalBody>
							<Text size='xl' color='$white'>
								Search
							</Text>
							<HStack space='sm'>
								<Input w='$5/6' variant='outline' size='lg'>
									<InputField
										value={searchTerm}
										onChangeText={setSearchTerm}
										placeholder='Enter Exercise Name'
										color='$white'
									/>
								</Input>
								<Button w='$1/6' onPress={() => setSearchTerm('')} disabled={isLoading} bgColor='gray'>
									<ButtonIcon as={CloseIcon} />
								</Button>
							</HStack>
							<HStack space='md' marginTop={10}>
								<Button action='positive' onPress={() => setShowBodypartModal(true)} isDisabled={isLoading}>
									<ButtonText color='white'>
										Bodypart {selectedBodyparts.length == 0 ? '' : `(${selectedBodyparts.length})`}
									</ButtonText>
								</Button>
								<Button action='positive' onPress={() => setShowTypeModal(true)} isDisabled={isLoading}>
									<ButtonText color='white'>
										Type {selectedTypes.length == 0 ? '' : `(${selectedTypes.length})`}
									</ButtonText>
								</Button>
							</HStack>
							<VStack space='xl' marginTop={20}>
								{filteredExercises?.map(exercise => (
									<Box key={`filtered-${exercise.id}`} bgColor='$secondary800' padding={15} borderRadius={10}>
										<VStack>
											<Text bold size='lg' color='$green500'>
												{exercise.name}
											</Text>
											<Text size='lg' color='white'>
												{exercise.bodypart} / {exercise.type}
											</Text>
										</VStack>
										<Button action='positive' onPress={() => addExercise(exercise)} isDisabled={isLoading}>
											<ButtonText>Add</ButtonText>
										</Button>
									</Box>
								))}
							</VStack>
						</ModalBody>
						<ModalFooter>
							<Button mr={20} action='positive' onPress={resetFilters} isDisabled={isLoading}>
								<ButtonText color='white'>Reset Filters</ButtonText>
							</Button>
							<Button
								variant='outline'
								action='secondary'
								onPress={() => setShowExerciseModal(false)}
								isDisabled={isLoading}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

				{/* TODO extract to component */}
				{/* Bodypart Modal */}
				<Modal isOpen={showBodypartModal} onClose={() => setShowBodypartModal(false)}>
					<ModalBackdrop />
					<ModalContent bgColor='$secondary700' maxHeight='$5/6'>
						<ModalHeader>
							<Heading size='2xl' color='white'>
								Select Bodyparts
							</Heading>
							<ModalCloseButton>
								<AntDesign name='close' size={24} color='white' />
							</ModalCloseButton>
						</ModalHeader>
						<ModalBody>
							<CheckboxGroup value={selectedBodyparts} onChange={keys => setSelectedBodyparts(keys)}>
								<VStack space='3xl'>
									{bodyparts?.map(bodypart => (
										<Checkbox key={bodypart} value={bodypart} aria-label={bodypart}>
											<CheckboxIndicator mr='$2'>
												<CheckboxIcon as={() => <Feather name='check' size={16} color='white' />} />
											</CheckboxIndicator>
											<CheckboxLabel color='white'>{bodypart}</CheckboxLabel>
										</Checkbox>
									))}
								</VStack>
							</CheckboxGroup>
						</ModalBody>
						<ModalFooter>
							<Button
								mr='$3'
								variant='outline'
								action='secondary'
								onPress={() => setShowBodypartModal(false)}
								isDisabled={isLoading}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
							<Button action='positive' onPress={() => setShowBodypartModal(false)} isDisabled={isLoading}>
								<ButtonText color='white'>Ok</ButtonText>
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

				{/* TODO extract to component */}
				{/* Types Modal */}
				<Modal isOpen={showTypeModal} onClose={() => setShowTypeModal(false)}>
					<ModalBackdrop />
					<ModalContent bgColor='$secondary700' maxHeight='$5/6'>
						<ModalHeader>
							<Heading size='2xl' color='white'>
								Select Types
							</Heading>
							<ModalCloseButton>
								<AntDesign name='close' size={24} color='white' />
							</ModalCloseButton>
						</ModalHeader>
						<ModalBody>
							<CheckboxGroup value={selectedTypes} onChange={keys => setSelectedTypes(keys)}>
								<VStack space='3xl'>
									{equipmentTypes?.map(type => (
										<Checkbox key={type} value={type} aria-label={type}>
											<CheckboxIndicator mr='$2'>
												<CheckboxIcon as={() => <Feather name='check' size={16} color='white' />} />
											</CheckboxIndicator>
											<CheckboxLabel color='white'>{type}</CheckboxLabel>
										</Checkbox>
									))}
								</VStack>
							</CheckboxGroup>
						</ModalBody>
						<ModalFooter>
							<Button
								mr='$3'
								variant='outline'
								action='secondary'
								onPress={() => setShowTypeModal(false)}
								isDisabled={isLoading}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
							<Button action='positive' onPress={() => setShowTypeModal(false)} isDisabled={isLoading}>
								<ButtonText color='white'>Ok</ButtonText>
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

				{/* Update Confirmation */}
				<AlertDialog isOpen={showUpdateDialog} onClose={() => setShowUpdateDialog(false)}>
					<AlertDialogBackdrop />
					<AlertDialogContent bgColor='$secondary700' maxHeight='$5/6'>
						<AlertDialogHeader>
							<Heading size='2xl' color='white'>
								Update Template
							</Heading>
							<AlertDialogCloseButton>
								<AntDesign name='close' size={24} color='white' />
							</AlertDialogCloseButton>
						</AlertDialogHeader>
						<AlertDialogBody>
							<Text color='white'>Are you sure you want to update this template?</Text>
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
							<Button bgColor='$green600' onPress={updateTemplate} isDisabled={isLoading}>
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
								Delete Template
							</Heading>
							<AlertDialogCloseButton>
								<AntDesign name='close' size={24} color='white' />
							</AlertDialogCloseButton>
						</AlertDialogHeader>
						<AlertDialogBody>
							<Text color='white'>
								Are you sure you want to delete this template? This action cannot be undone.
							</Text>
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
							<Button action='negative' onPress={deleteTemplate} isDisabled={isLoading}>
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
								Back to templates
							</Heading>
							<AlertDialogCloseButton>
								<AntDesign name='close' size={24} color='white' />
							</AlertDialogCloseButton>
						</AlertDialogHeader>
						<AlertDialogBody>
							<Text color='white'>
								Are you sure you want to return to your templates? Your template changes will not be saved.
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
		</KeyboardAvoidingView>
	);
}
