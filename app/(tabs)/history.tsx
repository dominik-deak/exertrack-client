import { AntDesign } from '@expo/vector-icons';
import {
	Box,
	Divider,
	HStack,
	Heading,
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	Pressable,
	SafeAreaView,
	ScrollView,
	Text,
	VStack,
	View
} from '@gluestack-ui/themed';
import { useEffect, useState } from 'react';
import workoutHistory from '../../data/history.json';

interface ExerciseSet {
	reps: number;
	weight: number;
}

interface Exercise {
	bodypart: string;
	sets: ExerciseSet[];
}

interface Workout {
	id: string;
	template: string;
	duration: number;
	date: string;
	exercises: {
		[exerciseName: string]: Exercise;
	};
}

export default function history() {
	const [selected, setSelected] = useState<Workout | null>(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (selected) setShowModal(true);
	}, [selected]);

	return (
		<SafeAreaView flex={1}>
			<Box alignItems='center'>
				<Heading color='$green500' size='3xl' marginBottom={40}>
					Workout History
				</Heading>
			</Box>
			<ScrollView>
				<Box alignItems='center'>
					<VStack space='2xl' w='$5/6'>
						{workoutHistory.map(workout => (
							<Pressable
								onPress={() => setSelected(workout)}
								bgColor='$secondary800'
								padding={15}
								borderRadius={20}
								key={workout.id}>
								<Text color='white'>{workout.template}</Text>
								<Text color='white'>Date: {workout.date}</Text>
								<Text color='white'>Duration: {workout.duration} minutes</Text>
							</Pressable>
						))}
					</VStack>
				</Box>
			</ScrollView>

			<Modal
				isOpen={showModal}
				onClose={() => {
					setSelected(null);
					setShowModal(false);
				}}>
				<ModalBackdrop />
				<ModalContent bgColor='$secondary700' maxHeight='$5/6'>
					<ModalHeader>
						<Heading size='2xl' color='white'>
							Template: {selected?.template}
						</Heading>
						<ModalCloseButton>
							<AntDesign name='close' size={24} color='white' />
						</ModalCloseButton>
					</ModalHeader>
					<ModalBody>
						<HStack space='md'>
							<Text color='white' bold>
								Date:
							</Text>
							<Text color='white'>{selected?.date}</Text>
						</HStack>
						<HStack space='md'>
							<Text color='white' bold>
								Duration:
							</Text>
							<Text color='white'>{selected?.duration} minutes</Text>
						</HStack>
						<Divider my='$1' />
						<VStack space='md' paddingBottom={20}>
							{Object.keys(selected?.exercises || {}).map(exerciseName => {
								const exercise = selected?.exercises[exerciseName];
								return (
									<Box key={exerciseName} marginBottom={10}>
										<HStack space='sm'>
											<Text bold size='lg' color='white'>
												{exerciseName}
											</Text>
											<Text italic size='lg' color='white'>
												{exercise?.bodypart}
											</Text>
										</HStack>
										<VStack space='sm' paddingLeft={10}>
											{exercise?.sets.map((set, index) => (
												<Text key={index} color='white'>
													Set {index + 1}: {set.reps} reps, {set.weight} kg
												</Text>
											))}
										</VStack>
									</Box>
								);
							})}
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</SafeAreaView>
	);
}
