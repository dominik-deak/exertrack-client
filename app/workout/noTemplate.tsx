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
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import exercisesData from '../../data/exercises.json';

interface Exercise {
	id: string;
	name: string;
	bodypart: string;
	type: string;
	user: null;
	created: string;
	updated: string;
}

export default function exercises() {
	const [filteredExercises, setFilteredExercises] = useState(exercisesData);
	const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
	const [showExerciseModal, setShowExerciseModal] = useState(false);
	const [showCompleteDialog, setShowCompleteDialog] = useState(false);

	function filterExercises(name: string) {
		const matchingExercises = exercisesData.filter(exercise => exercise.name.toLowerCase().includes(name.toLowerCase()));
		setFilteredExercises(matchingExercises);
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<SafeAreaView flex={1}>
				<Box alignItems='center' marginBottom={10}>
					<Button onPress={router.back} bgColor='$green600' marginVertical={20}>
						<ButtonText color='white'>Back to Templates</ButtonText>
					</Button>
					<Heading color='$green500' size='3xl'>
						No Template
					</Heading>
				</Box>

				<ScrollView>
					<Box alignItems='center'>
						<VStack space='4xl' w='$5/6'>
							{selectedExercises.map(exercise => (
								<Box key={exercise.name} bgColor='$secondary800' padding={15} borderRadius={10}>
									<HStack space='sm'>
										<Text bold size='xl' color='$green500'>
											{exercise.name}
										</Text>
										<Text italic size='lg' color='white'>
											{exercise.bodypart}
										</Text>
									</HStack>
									<Divider marginVertical={10} />
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
							))}
						</VStack>
					</Box>
					<Box alignItems='center'>
						<Button onPress={() => setShowExerciseModal(true)} bgColor='$green600' marginVertical={20}>
							<ButtonText color='white'>Add Exercise</ButtonText>
						</Button>
					</Box>
				</ScrollView>

				<Box alignItems='center'>
					<Button onPress={() => setShowCompleteDialog(true)} bgColor='$green600' marginTop={20}>
						<ButtonText color='white'>Complete Workout</ButtonText>
					</Button>
				</Box>

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
							<Input variant='outline' size='md'>
								<InputField onChangeText={filterExercises} placeholder='Enter Exercise Name' color='$white' />
							</Input>
							<VStack space='xl' marginTop={20}>
								{filteredExercises.map(exercise => (
									<Box bgColor='$secondary800' padding={15} borderRadius={10}>
										<VStack>
											<Text bold size='lg' color='$green500'>
												{exercise.name}
											</Text>
											<Text size='lg' color='white'>
												{exercise.bodypart} / {exercise.type}
											</Text>
										</VStack>
										<Button
											action='positive'
											onPress={() => {
												setSelectedExercises(prevState => {
													return [...prevState, exercise];
												});
												setShowExerciseModal(false);
											}}>
											<ButtonText>Add</ButtonText>
										</Button>
									</Box>
								))}
							</VStack>
						</ModalBody>
						<ModalFooter>
							<Button variant='outline' action='secondary' onPress={() => setShowExerciseModal(false)}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

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
							<Button bgColor='$green600' onPress={() => router.replace('/(tabs)/history')}>
								<ButtonText>Complete</ButtonText>
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}
