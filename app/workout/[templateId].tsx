import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import { useUnitPreference } from '@/contexts/UnitPreferenceContext';
import useTokens from '@/hooks/useTokens';
import { Predictions, PreviousBestSets } from '@/types/Prediction';
import { Template, TemplateExercise } from '@/types/Template';
import { WorkoutExercise, WorkoutSubmission } from '@/types/Workout';
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
	Divider,
	HStack,
	Heading,
	Input,
	InputField,
	KeyboardAvoidingView,
	SafeAreaView,
	ScrollView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// // mock data
// import workoutTemplates from '@/data/templates.json';

/**
 * The custom template component.
 * Allows the user to create a new workout using a predefined template.
 * @returns The custom template component.
 */
export default function CustomTemplate() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [fetchingPredictions, setFetchingPredictions] = useState(false);
	const [error, setError] = useState('');
	const { unit, poundsToKilos, kilosToPounds } = useUnitPreference();

	const { templateId } = useLocalSearchParams();

	const [template, setTemplate] = useState<Template | null>(null);
	const [exerciseInputs, setExerciseInputs] = useState<WorkoutExercise[]>([]);
	const [showCompleteDialog, setShowCompleteDialog] = useState(false);
	const [showBackDialog, setShowBackDialog] = useState(false);
	const [startTime, setStartTime] = useState<Date | null>(null);

	// const templateIndex = workoutTemplates.findIndex(template => template.id === templateId);
	// const selectedTemplate = workoutTemplates[templateIndex];

	// Initial template load
	useEffect(() => {
		if (isFocused && accessToken) fetchTemplate();
	}, [isFocused, accessToken]);

	// Token errors
	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	/**
	 * For testing purposes.
	 * Comment for production.
	 */
	// useEffect(() => console.log(exerciseInputs), [exerciseInputs]);

	/**
	 * Fetches the template from the server.
	 */
	async function fetchTemplate() {
		setIsLoading(true);

		try {
			if (!accessToken) throw new Error("Can't get access token");

			const templateRes = await axios.get(`${API}/templates/${templateId}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			});

			const template: Template = templateRes.data.template;
			const initialExerciseInputs = template.exercises.map((exercise: TemplateExercise) => ({
				id: exercise.id,
				name: exercise.name,
				bodypart: exercise.bodypart,
				type: exercise.type,
				userId: exercise.userId,
				created: exercise.created,
				updated: exercise.updated,
				sets: Array.from({ length: exercise.sets }, () => ({ weight: 0, reps: 0 }))
			}));
			setExerciseInputs(initialExerciseInputs);

			setFetchingPredictions(true);
			const predictionsRes = await axios.get(`${API}/templates/${templateId}/predictions`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			});

			const predictions: Predictions = predictionsRes.data.predictions;
			const previousBestSets: PreviousBestSets = predictionsRes.data.previousBestSets;
			const updatedExercises: TemplateExercise[] = template.exercises.map((exercise: TemplateExercise) => ({
				...exercise,
				prediction: predictions[exercise.id],
				previousWeight: previousBestSets[exercise.id]?.weight,
				previousReps: previousBestSets[exercise.id]?.reps
			}));

			setTemplate({
				...template,
				exercises: updatedExercises
			});

			setStartTime(new Date());
		} catch (error: any) {
			setError(error.message || 'An unexpected error occurred');
		} finally {
			setFetchingPredictions(false);
			setIsLoading(false);
		}
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
		function isValidNum(value: string): boolean {
			if (value === '') return true;
			const number = parseFloat(value);
			if (!isNaN(number) && number.toString() === value) return true;
			if (value.charAt(value.length - 1) === '.' && !isNaN(parseFloat(value.slice(0, -1)))) return true;
			return false;
		}

		setExerciseInputs(currentExercises =>
			currentExercises.map(exercise => {
				if (exercise.id === exerciseId) {
					const updatedSets = exercise.sets.map((set, index) => {
						if (index === setIndex && isValidNum(value)) {
							return { ...set, [field]: value === '' ? 0 : value };
						}
						return set;
					});
					return { ...exercise, sets: updatedSets };
				}
				return exercise;
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
			templateId: templateId as string,
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
						{'Template: ' + template?.name}
						{/* {selectedTemplate.name} */}
					</Heading>
					<Text bold size='xl' color='white'>
						Start time: {startTime?.toLocaleTimeString()}
					</Text>
				</Box>

				<ScrollView>
					<Box alignItems='center'>
						<VStack space='4xl' w='$5/6'>
							{template?.exercises.map((exercise, exerIndex) => (
								<Box key={exerIndex} bgColor='$secondary800' padding={15} borderRadius={10}>
									<HStack space='sm'>
										<Text bold size='xl' color='$green500'>
											{exercise.name}
										</Text>
										<Text italic size='lg' color='white'>
											{exercise.bodypart}
										</Text>
									</HStack>
									<HStack space='sm'>
										<Text size='md' color='white'>
											Template suggestion:
										</Text>
										<Text color='white'>{`Sets: ${exercise.sets || 'N/A'}`}</Text>
										<Text color='white'>{`Reps: ${exercise.repsMin || '0'}-${exercise.repsMax || '0'}`}</Text>
									</HStack>
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
									<Text size='md' color='white' marginBottom={10}>
										First set suggestion:{' '}
										<Text size='md' color='$green500'>
											{exercise.prediction || 'No prediction available'}
										</Text>
									</Text>

									<VStack space='xl'>
										{/* Array.from source:
											https://stackoverflow.com/questions/27612713/convert-es6-iterable-to-array */}
										{Array.from({ length: exercise.sets }, (_, setIndex) => (
											<HStack key={setIndex} space='sm'>
												<Text size='xl' color='$white'>
													Set {setIndex + 1}:
												</Text>
												<VStack flex={1} space='sm'>
													<Input isDisabled={isLoading} variant='outline' size='md'>
														<InputField
															keyboardType='decimal-pad'
															placeholder={`Enter Weight (${unit === 'kilos' ? 'kg' : 'lbs'})`}
															color='$white'
															value={`${exerciseInputs.find(input => input.id === exercise.id)?.sets[setIndex]?.weight || ''}`}
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
													{/* <Button isDisabled={isLoading} bgColor='$green600'>
												<ButtonText color='white'>Add Set</ButtonText>
											</Button> */}
												</VStack>
											</HStack>
										))}
									</VStack>
								</Box>
							))}

							{/* Code below uses test data, comment for production */}
							{/* {selectedTemplate.exercises.map((exercise, index) => (
						<Box key={index} bgColor='$secondary800' padding={15} borderRadius={10}>
							<HStack space='sm'>
								<Text bold size='xl' color='$green500'>
									{exercise.name}
								</Text>
								<Text italic size='lg' color='white'>
									{exercise.bodypart}
								</Text>
							</HStack>
							<HStack space='sm'>
								<Text color='white'>{`Sets: ~${exercise.sets}`}</Text>
								<Text color='white'>{`Reps: ~${exercise.repsMin}-${exercise.repsMax}`}</Text>
							</HStack>
							<Divider marginVertical={10} />
							<Text size='lg' color='white' marginBottom={10}>
								Top set prediction: {Math.floor(Math.random() * (100 - 1)) + 1} Kg x{' '}
								{Math.floor(Math.random() * (15 - 1)) + 1} reps
							</Text>
							<VStack space='xl'>
								<HStack space='sm'>
									<Text size='xl' color='$white'>
										Set 1:
									</Text>
									<VStack flex={1} space='sm'>
										<Input variant='outline' size='md'>
											<InputField
												keyboardType='decimal-pad'
												placeholder='Enter Weight (Kg)'
												color='$white'
											/>
										</Input>
										<Input variant='outline' size='md'>
											<InputField
												keyboardType='decimal-pad'
												placeholder='Enter Reps'
												color='$white'
											/>
										</Input>
										<Button bgColor='$green600'>
											<ButtonText color='white'>Add Set</ButtonText>
										</Button>
									</VStack>
								</HStack>
							</VStack>
						</Box>
					))} */}
						</VStack>
					</Box>
				</ScrollView>

				<Box alignItems='center'>
					<Button onPress={checkInputs} isDisabled={isLoading} bgColor='$green600' marginTop={20}>
						<ButtonText color='white'>Complete Workout</ButtonText>
					</Button>
				</Box>

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
							<Button variant='outline' action='secondary' mr='$3' onPress={() => setShowCompleteDialog(false)}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
							<Button bgColor='$green600' onPress={completeWorkout}>
								<ButtonText>Complete</ButtonText>
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

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
							<Button variant='outline' action='secondary' mr='$3' onPress={() => setShowBackDialog(false)}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
							<Button bgColor='$green600' onPress={router.back}>
								<ButtonText>Back</ButtonText>
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}
