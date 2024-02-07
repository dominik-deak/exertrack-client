import workoutHistory from '@/data/history.json';
import Workout from '@/types/workout';
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
	VStack
} from '@gluestack-ui/themed';
import { useEffect, useState } from 'react';

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
								borderRadius={10}
								key={workout.id}>
								<Text color='$green500'>{workout.template}</Text>
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
						<Heading size='2xl' color='$green500'>
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
							{selected?.exercises.map((exercise, index) => (
								<Box key={index} marginBottom={10}>
									<HStack space='sm'>
										<Text bold size='lg' color='$green500'>
											{exercise.name}
										</Text>
										<Text italic size='lg' color='white'>
											{exercise.bodypart}
										</Text>
									</HStack>
									<VStack space='sm' paddingLeft={10}>
										{exercise.sets.map((set, index) => (
											<Text key={index} color='white'>
												Set {index + 1}: {set.weight} kg x {set.reps} reps
											</Text>
										))}
									</VStack>
								</Box>
							))}
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</SafeAreaView>
	);
}
