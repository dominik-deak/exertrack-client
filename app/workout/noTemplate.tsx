import bodyparts from '@/data/bodyparts.json';
import equipmentTypes from '@/data/equipmentTypes.json';
import exercisesData from '@/data/exercises.json';
import Exercise from '@/types/exercise';
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
	ButtonText,
	Checkbox,
	CheckboxGroup,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
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
import { useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function exercises() {
	const [searchTerm, setSearchTerm] = useState('');

	const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exercisesData);
	const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
	const [showExerciseModal, setShowExerciseModal] = useState(false);

	const [selectedBodyparts, setSelectedBodyparts] = useState<string[]>([]);
	const [showBodypartModal, setShowBodypartModal] = useState(false);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [showTypeModal, setShowTypeModal] = useState(false);

	const [showCompleteDialog, setShowCompleteDialog] = useState(false);

	useEffect(() => {
		filterExercises();
	}, [searchTerm, selectedBodyparts, selectedTypes]);

	function filterExercises() {
		// Start with all exercises
		let matchingExercises = [...exercisesData];
		// Filter based on types
		if (selectedTypes.length > 0) {
			matchingExercises = matchingExercises.filter(exercise => selectedTypes.includes(exercise.type));
		}
		// Filter based on bodyparts
		if (selectedBodyparts.length > 0) {
			matchingExercises = matchingExercises.filter(exercise => selectedBodyparts.includes(exercise.bodypart));
		}
		// Filter based on search term
		if (searchTerm.trim() !== '') {
			matchingExercises = matchingExercises.filter(exercise =>
				exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		setFilteredExercises(matchingExercises);
	}

	function resetFilters() {
		setSelectedTypes([]);
		setSelectedBodyparts([]);
		setSearchTerm('');
	}

	function addExercise(exercise: Exercise) {
		setSelectedExercises(prevState => {
			return [...prevState, exercise];
		});
		setShowExerciseModal(false);
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
								<Box key={exercise.id} bgColor='$secondary800' padding={15} borderRadius={10}>
									<HStack space='sm'>
										<Text bold size='xl' color='$green500'>
											{exercise.name}
										</Text>
										<Text italic size='lg' color='white'>
											{exercise.bodypart}
										</Text>
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
							<Input variant='outline' size='md'>
								<InputField
									value={searchTerm}
									onChangeText={setSearchTerm}
									placeholder='Enter Exercise Name'
									color='$white'
								/>
							</Input>
							<HStack space='md' marginTop={10}>
								<Button action='positive' onPress={() => setShowBodypartModal(true)}>
									<ButtonText color='white'>
										Bodypart {selectedBodyparts.length == 0 ? '' : `(${selectedBodyparts.length})`}
									</ButtonText>
								</Button>
								<Button action='positive' onPress={() => setShowTypeModal(true)}>
									<ButtonText color='white'>
										Type {selectedTypes.length == 0 ? '' : `(${selectedTypes.length})`}
									</ButtonText>
								</Button>
							</HStack>
							<VStack space='xl' marginTop={20}>
								{filteredExercises.map(exercise => (
									<Box key={exercise.id} bgColor='$secondary800' padding={15} borderRadius={10}>
										<VStack>
											<Text bold size='lg' color='$green500'>
												{exercise.name}
											</Text>
											<Text size='lg' color='white'>
												{exercise.bodypart} / {exercise.type}
											</Text>
										</VStack>
										<Button action='positive' onPress={() => addExercise(exercise)}>
											<ButtonText>Add</ButtonText>
										</Button>
									</Box>
								))}
							</VStack>
						</ModalBody>
						<ModalFooter>
							<Button mr={20} action='positive' onPress={resetFilters}>
								<ButtonText color='white'>Reset Filters</ButtonText>
							</Button>
							<Button variant='outline' action='secondary' onPress={() => setShowExerciseModal(false)}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

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
							<Button mr='$3' variant='outline' action='secondary' onPress={() => setShowBodypartModal(false)}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
							<Button action='positive' onPress={() => setShowBodypartModal(false)}>
								<ButtonText color='white'>Ok</ButtonText>
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

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
							<Button mr='$3' variant='outline' action='secondary' onPress={() => setShowTypeModal(false)}>
								<ButtonText color='white'>Cancel</ButtonText>
							</Button>
							<Button action='positive' onPress={() => setShowTypeModal(false)}>
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
