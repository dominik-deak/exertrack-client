import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import { useUnitPreference } from '@/contexts/UnitPreferenceContext';
import useTokens from '@/hooks/useTokens';
import { Predictions, PreviousBestSets } from '@/types/Prediction';
import { WorkoutExercise, WorkoutSubmission } from '@/types/Workout';
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
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// // mock data
// import bodyparts from '@/data/bodyparts.json';
// import equipmentTypes from '@/data/equipmentTypes.json';
// import exercisesData from '@/data/exercises.json';

/**
 * The no template screen component.
 * Allows the user to create a new workout from scratch,
 * by selecting exercises to add to the workout.
 * @returns The no template screen component.
 */
export default function NoTemplate() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [fetchingPredictions, setFetchingPredictions] = useState(false);
	const [error, setError] = useState('');
	const { unit, poundsToKilos, kilosToPounds } = useUnitPreference();

	// Static data
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [defaultExercises, setDefaultExercises] = useState<WorkoutExercise[]>([]);
	const [userExercises, setUserExercises] = useState<WorkoutExercise[]>([]);
	const [bodyparts, setBodyparts] = useState<string[]>([]);
	const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
	// Dynamic data
	// FIXME may not need two arrays with current implementation, confirm and refactor if needed
	const [exerciseInputs, setExerciseInputs] = useState<WorkoutExercise[]>([]);
	const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
	// Exercise filtering states
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedBodyparts, setSelectedBodyparts] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [filteredExercises, setFilteredExercises] = useState<WorkoutExercise[]>([]);
	// Modal states
	const [showExerciseModal, setShowExerciseModal] = useState(false);
	const [showBodypartModal, setShowBodypartModal] = useState(false);
	const [showTypeModal, setShowTypeModal] = useState(false);
	const [showCompleteDialog, setShowCompleteDialog] = useState(false);
	const [showBackDialog, setShowBackDialog] = useState(false);

	// Starts timer when component is focused
	useEffect(() => {
		if (isFocused) {
			setStartTime(new Date());
		}
	}, [isFocused]);

	// Getting initial exercises
	useEffect(() => {
		if (showExerciseModal && !(filteredExercises.length > 0)) {
			fetchExercises();
		}
	}, [showExerciseModal]);

	// Setting initial exercises
	useEffect(() => {
		setFilteredExercises([...defaultExercises, ...userExercises]);
	}, [defaultExercises, userExercises]);

	// Getting bodyparts
	useEffect(() => {
		if (showBodypartModal) fetchBodyparts();
	}, [showBodypartModal]);

	// Getting equipment types
	useEffect(() => {
		if (showTypeModal) fetchEquipmentTypes();
	}, [showTypeModal]);

	// Filtering
	useEffect(() => {
		filterExercises();
	}, [searchTerm, selectedBodyparts, selectedTypes]);

	// Handling token errors
	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	// useEffect(() => {
	// 	if (selectedExercises.length > 0) {
	// 		setExerciseInputs(
	// 			selectedExercises.map(exercise => ({
	// 				id: exercise.id,
	// 				name: exercise.name,
	// 				bodypart: exercise.bodypart,
	// 				type: exercise.type,
	// 				userId: exercise.userId,
	// 				created: exercise.created,
	// 				updated: exercise.updated,
	// 				sets: exercise.sets || Array.from({ length: exercise.sets }, () => ({ weight: 0, reps: 0 }))
	// 			}))
	// 		);
	// 	} else {
	// 		setExerciseInputs([]);
	// 	}
	// }, [selectedExercises]);

	// for debugging
	// useEffect(() => {
	// 	console.log(exerciseInputs);
	// }, [exerciseInputs]);
	// useEffect(() => {
	// 	console.log(selectedExercises);
	// }, [ selectedExercises]);

	/**
	 * Retrieves exercises from the server
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
	 * Retrieves bodyparts from the server
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
	 * Retrieves equipment types from the server
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
	 * Adds an exercise to the workout
	 * @param exercise The exercise to add
	 */
	function addExercise(exercise: WorkoutExercise) {
		setShowExerciseModal(false);
		setFetchingPredictions(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/exercises/${exercise.id}/predictions`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(response => {
				const predictions: Predictions = response.data.predictions;
				const previousBestSets: PreviousBestSets = response.data.previousBestSets;
				const exerciseWithInitialSet = {
					...exercise,
					prediction: predictions[exercise.id],
					sets: [{ weight: 0, reps: 0 }],
					previousWeight: previousBestSets[exercise.id]?.weight,
					previousReps: previousBestSets[exercise.id]?.reps
				};

				setSelectedExercises(prevExercises => {
					const isExerciseAlreadyAdded = prevExercises.some(prev => prev.id === exercise.id);
					if (isExerciseAlreadyAdded) {
						setError('Exercise already added to workout');
						return prevExercises;
					}
					return [...prevExercises, exerciseWithInitialSet];
				});

				setExerciseInputs(currentInputs => {
					const isExerciseInInputs = currentInputs.some(input => input.id === exercise.id);
					if (isExerciseInInputs) {
						return currentInputs;
					}
					return [...currentInputs, exerciseWithInitialSet];
				});
			})
			.catch(error => {
				if (axios.isCancel(error)) {
					console.log('Request canceled:', error.message);
				} else {
					setError(error.response?.data.error || error.message || 'Failed to fetch exercise predictions');
				}
			})
			.finally(() => {
				setFetchingPredictions(false);
			});
	}

	/**
	 * Removes an exercise from the workout
	 * @param exerciseId The id of the exercise
	 */
	function removeExercise(exerciseId: string) {
		setSelectedExercises(prevExercises => prevExercises.filter(prevExercise => prevExercise.id !== exerciseId));
		setExerciseInputs(currentInputs => currentInputs.filter(input => input.id !== exerciseId));
	}

	/**
	 * Adds a set to an exercise
	 * @param exerciseId The id of the exercise
	 */
	function addSet(exerciseId: string) {
		setSelectedExercises(prevExercises => {
			return prevExercises.map(prevExercise => {
				if (prevExercise.id === exerciseId) {
					return {
						...prevExercise,
						sets: [...prevExercise.sets, { weight: 0, reps: 0 }]
					};
				}
				return prevExercise;
			});
		});

		setExerciseInputs(currentInputs => {
			return currentInputs.map(input => {
				if (input.id === exerciseId) {
					return {
						...input,
						sets: [...input.sets, { weight: 0, reps: 0 }]
					};
				}
				return input;
			});
		});
	}

	/**
	 * Removes a set from an exercise
	 * @param exerciseId The id of the exercise
	 * @param setIndex The index of the set
	 */
	function removeSet(exerciseId: string, setIndex: number) {
		setSelectedExercises(prevExercises => {
			return prevExercises.map(prevExercise => {
				if (prevExercise.id === exerciseId) {
					return {
						...prevExercise,
						sets: prevExercise.sets.filter((_, index) => index !== setIndex)
					};
				}
				return prevExercise;
			});
		});

		setExerciseInputs(currentInputs => {
			return currentInputs.map(input => {
				if (input.id === exerciseId) {
					return {
						...input,
						sets: input.sets.filter((_, index) => index !== setIndex)
					};
				}
				return input;
			});
		});
	}

	/**
	 * Handles changes to the exercise inputs.
	 *
	 * `exerciseInputs` deals with nested state so the setter callback
	 * produces a new state based on the old one, instead of directly mutating it.
	 *
	 * Using useCallback to avoid unnecessary re-creations of this function,
	 * because of the deep component tree.
	 *
	 * Number validation methods source: https://stackoverflow.com/a/21807809
	 */
	const handleInputChange = useCallback((exerciseId: string, setIndex: number, field: string, value: string) => {
		function isValidPositiveNumber(value: string): boolean {
			const num = Number(value);
			return !isNaN(num) && isFinite(num) && num >= 0;
		}

		setExerciseInputs(currentExercises =>
			currentExercises.map(exercise => {
				if (exercise.id !== exerciseId) {
					return exercise;
				}
				const updatedSets = exercise.sets.map((set, index) => {
					if (index !== setIndex) {
						return set;
					}
					return { ...set, [field]: isValidPositiveNumber(value) ? Number(value) : 0 };
				});
				return { ...exercise, sets: updatedSets };
			})
		);
	}, []);

	/**
	 * Validate inputs by checking if either weight or reps is 0, excluding sets where both are 0.
	 */
	function checkInputs() {
		setIsLoading(true);

		let invalidInputFound = false;
		let blankSetsCount = 0;
		let totalSetsCount = 0;

		for (const exerciseInput of exerciseInputs) {
			totalSetsCount += exerciseInput.sets.length; // fewer computations when incrementing like this
			for (const set of exerciseInput.sets) {
				if ((set.weight === 0 || set.reps === 0) && !(set.weight === 0 && set.reps === 0)) {
					invalidInputFound = true;
					break;
				}
				if (set.weight === 0 && set.reps === 0) {
					blankSetsCount++;
				}
			}
			if (invalidInputFound) break;
		}

		if (blankSetsCount === totalSetsCount) {
			setIsLoading(false);
			setError('Please complete at least one set for the workout.');
			return;
		}

		if (invalidInputFound) {
			setIsLoading(false);
			setError('Please ensure all sets have either: both weight and reps entered OR both left at 0 to be skipped.');
			return;
		}

		setIsLoading(false);
		setShowCompleteDialog(true);
	}

	/**
	 * Completes the workout submission process by calculating the duration,
	 * preparing workout data based on the current state and making a POST request to submit the workout.
	 * On successful completion, the user is redirected to the history page.
	 */
	function completeWorkout() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		// convert duration to minutes
		// source: https://stackoverflow.com/a/15437397
		// TODO pass unix time to server & handle logic there
		const endTime = new Date();
		const durationInMinutes = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 60000) : 0;

		let submissionExercises = exerciseInputs;

		if (unit === 'pounds') {
			submissionExercises = submissionExercises.map(exercise => ({
				...exercise,
				sets: exercise.sets.map(set => ({
					...set,
					weight: set.weight ? poundsToKilos(set.weight) : 0
				}))
			}));
		}

		const workoutSubmission: WorkoutSubmission = {
			templateId: null,
			duration: durationInMinutes,
			exercises: submissionExercises
		};

		axios
			.post(`${API}/workout/complete`, { workoutSubmission }, { headers: { Authorization: `Bearer ${accessToken}` } })
			.then(() => {
				router.replace('/(tabs)/history');
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Failed to submit workout';
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
				{fetchingPredictions && <LoadingModal message='Fetching exercise performance predictions...' />}
				<MessageModal
					message={error}
					setMessage={setError}
					heading='Error'
					btnText='Ok'
					btnAction={() => setError('')}
				/>

				<Box alignItems='center' marginBottom={10}>
					<Button
						onPress={() => setShowBackDialog(true)}
						isDisabled={isLoading}
						bgColor='$green600'
						marginVertical={20}>
						<ButtonText color='white'>Back to Templates</ButtonText>
					</Button>
					<Heading color='$green500' size='3xl'>
						No Template
					</Heading>
					<Text bold size='xl' color='white'>
						Start time: {startTime?.toLocaleTimeString()}
					</Text>
				</Box>

				<ScrollView>
					<Box alignItems='center'>
						<VStack space='4xl' w='$5/6'>
							{selectedExercises.map(exercise => (
								<Box key={`selected-${exercise.id}`} bgColor='$secondary800' padding={15} borderRadius={10}>
									<Box flexDirection='row' justifyContent='space-between'>
										<VStack space='xs'>
											<Text bold size='xl' color='$green500'>
												{exercise.name}
											</Text>
											<Text italic size='md' color='white'>
												{exercise.bodypart}
											</Text>
										</VStack>
										<Button onPress={() => removeExercise(exercise.id)} disabled={isLoading} bgColor='gray'>
											<ButtonIcon as={CloseIcon} />
										</Button>
									</Box>
									<Divider marginVertical={10} />

									{exercise.previousWeight !== undefined &&
										exercise.previousWeight !== null &&
										exercise.previousReps !== undefined && (
											<HStack space='sm'>
												<Text size='md' color='white'>
													Previous best set:
												</Text>
												<Text size='md' color='white'>
													{`${unit === 'kilos' ? exercise.previousWeight : kilosToPounds(exercise.previousWeight)} ${
														unit === 'kilos' ? 'kg' : 'lbs'
													} x ${exercise.previousReps} reps`}
												</Text>
											</HStack>
										)}
									{exercise.prediction !== null && (
										<Text size='md' color='white' marginBottom={10}>
											First set suggestion:{' '}
											<Text size='md' color='$green500'>
												{exercise.prediction}
											</Text>
										</Text>
									)}

									<VStack space='xl'>
										{/* Array.from source:
											https://stackoverflow.com/questions/27612713/convert-es6-iterable-to-array */}
										{Array.from({ length: exercise.sets.length }, (_, setIndex) => (
											<HStack key={`${exercise.id}-${setIndex}`} space='sm'>
												<Text size='xl' color='$white'>
													Set {setIndex + 1}:
												</Text>
												<VStack flex={1} space='sm'>
													<Input isDisabled={isLoading} variant='outline' size='md'>
														<InputField
															keyboardType='decimal-pad'
															placeholder={`Enter Weight (${unit === 'kilos' ? 'kg' : 'lbs'})`}
															color='$white'
															value={`${
																exerciseInputs.find(input => input.id === exercise.id)?.sets[
																	setIndex
																]?.weight || ''
															}`}
															onChangeText={value =>
																handleInputChange(exercise.id, setIndex, 'weight', value)
															}
														/>
													</Input>
													<Input isDisabled={isLoading} variant='outline' size='md'>
														<InputField
															keyboardType='decimal-pad'
															placeholder='Enter Reps'
															color='$white'
															value={`${exerciseInputs.find(input => input.id === exercise.id)?.sets[setIndex]?.reps || ''}`}
															onChangeText={value =>
																handleInputChange(exercise.id, setIndex, 'reps', value)
															}
														/>
													</Input>
												</VStack>
												{/* prevent removal of single set */}
												{exercise.sets.length > 1 && (
													<Box w='$10'>
														<Button
															onPress={() => removeSet(exercise.id, setIndex)}
															disabled={isLoading}
															bgColor='gray'>
															<ButtonIcon as={CloseIcon} />
														</Button>
													</Box>
												)}
											</HStack>
										))}
										<Button onPress={() => addSet(exercise.id)} isDisabled={isLoading} bgColor='$green600'>
											<ButtonText color='white'>Add Set</ButtonText>
										</Button>
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

				<Box alignItems='center'>
					<Button onPress={checkInputs} isDisabled={isLoading} bgColor='$green600' marginTop={20}>
						<ButtonText color='white'>Complete Workout</ButtonText>
					</Button>
				</Box>

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
								<Input w='$5/6' variant='outline' size='md'>
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
								{filteredExercises.map(exercise => (
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
									{bodyparts.map(bodypart => (
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
									{equipmentTypes.map(type => (
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

				{/* Complete Confirmation */}
				<AlertDialog isOpen={showCompleteDialog} onClose={() => setShowCompleteDialog(false)}>
					<AlertDialogBackdrop />
					<AlertDialogContent bgColor='$secondary700' maxHeight='$5/6'>
						<AlertDialogHeader>
							<Heading size='2xl' color='white'>
								Complete Workout
							</Heading>
							<AlertDialogCloseButton>
								<AntDesign name='close' size={24} color='white' />
							</AlertDialogCloseButton>
						</AlertDialogHeader>
						<AlertDialogBody>
							<Text color='white'>Are you sure you want to complete this workout?</Text>
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button
								variant='outline'
								action='secondary'
								mr='$3'
								onPress={() => setShowCompleteDialog(false)}
								isDisabled={isLoading}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
							<Button bgColor='$green600' onPress={completeWorkout} isDisabled={isLoading}>
								<ButtonText>Complete</ButtonText>
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
								Are you sure you want to return to your templates? Your workout will not be saved.
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
