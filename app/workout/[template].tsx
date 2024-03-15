import workoutTemplates from '@/data/templates.json';
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
	SafeAreaView,
	ScrollView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function Template() {
	const { template: id } = useLocalSearchParams();
	const templateIndex = workoutTemplates.findIndex(template => template.id === id);
	const selectedTemplate = workoutTemplates[templateIndex];

	const [showCompleteDialog, setShowCompleteDialog] = useState(false);

	return (
		<SafeAreaView flex={1}>
			<Box alignItems='center' marginBottom={10}>
				<Button onPress={router.back} bgColor='$green600' marginVertical={20}>
					<ButtonText color='white'>Back to Templates</ButtonText>
				</Button>
				<Heading color='$green500' size='3xl'>
					{selectedTemplate.name}
				</Heading>
			</Box>

			<ScrollView>
				<Box alignItems='center'>
					<VStack space='4xl' w='$5/6'>
						{selectedTemplate.exercises.map((exercise, index) => (
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
						))}
					</VStack>
				</Box>
			</ScrollView>

			<Box alignItems='center'>
				<Button onPress={() => setShowCompleteDialog(true)} bgColor='$green600' marginTop={20}>
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
						<Button bgColor='$green600' onPress={() => router.replace('/(tabs)/history')}>
							<ButtonText>Complete</ButtonText>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SafeAreaView>
	);
}
