import Dropdown from '@/components/Dropdown';
import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import { useUnitPreference } from '@/contexts/UnitPreferenceContext';
import useTokens from '@/hooks/useTokens';
import { Workout } from '@/types/Workout';
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
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';

// // mock data
// import workoutHistory from '@/data/history.json';

const filters = ['weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly'];

/**
 * The workout history component.
 * Displays the workout history for the current user.
 * Allows the user to filter the history by date range.
 * Clicking on a history item will display the details of the selected workout.
 * @returns The History component.
 */
export default function History() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const { unit, kilosToPounds } = useUnitPreference();

	const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
	const [filteredHistory, setFilteredHistory] = useState<Workout[]>([]);
	const [selectedFilter, setSelectedFilter] = useState(filters[0]);

	const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
	const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
	const [showInfoModal, setShowInfoModal] = useState(false);

	useEffect(() => {
		if (isFocused && accessToken) {
			fetchHistory(selectedFilter);
		}
	}, [isFocused, accessToken]);

	useEffect(() => {
		if (isFocused && selectedWorkoutId) fetchHistoryItem(selectedWorkoutId);
	}, [selectedWorkoutId, isFocused]);

	useEffect(() => {
		if (selectedFilter) filterHistory(workoutHistory, selectedFilter);
	}, [selectedFilter]);

	useEffect(() => {
		if (selectedWorkout) setShowInfoModal(true);
	}, [selectedWorkout, isFocused]);

	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	/**
	 * Fetches the workout history from the server.
	 * Sets the filtered history based on the selected filter.
	 * @param selectedFilter The selected filter
	 */
	function fetchHistory(selectedFilter: string) {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/workout/history`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(async res => {
				const { workoutHistory } = res.data;

				const workoutHistoryWithDate: Workout[] = workoutHistory.map((workout: Workout) => ({
					...workout,
					created: new Date(workout.created)
				}));
				// TODO sort on server
				workoutHistoryWithDate.sort((a, b) => b.created.getTime() - a.created.getTime());

				setWorkoutHistory(workoutHistoryWithDate);
				filterHistory(workoutHistoryWithDate, selectedFilter);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting history failed';
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
	 * Filters the workout history based on the selected filter.
	 * @param workoutHistory The workout history
	 * @param selectedFilter The selected filter
	 */
	function filterHistory(workoutHistory: Workout[], selectedFilter: string) {
		const now = new Date();
		let dateThreshold = new Date();

		switch (selectedFilter) {
			case 'weekly':
				dateThreshold.setDate(now.getDate() - 7);
				break;
			case 'fortnightly':
				dateThreshold.setDate(now.getDate() - 14);
				break;
			case 'monthly':
				dateThreshold.setMonth(now.getMonth() - 1);
				break;
			case 'quarterly':
				dateThreshold.setMonth(now.getMonth() - 3);
				break;
			case 'yearly':
				dateThreshold.setFullYear(now.getFullYear() - 1);
				break;
			default:
				setWorkoutHistory([]);
				return;
		}

		const filteredHistory = workoutHistory.filter(workout => new Date(workout.created) > dateThreshold);
		setFilteredHistory(filteredHistory);
	}

	/**
	 * Handles the filter change by updating the state.
	 * @param selectedFilter The selected filter
	 */
	function handleFilterChange(selectedFilter: string) {
		setSelectedFilter(selectedFilter);
	}

	/**
	 * Fetches the workout history item from the server.
	 * @param selectedWorkoutId The id of the selected workout
	 */
	function fetchHistoryItem(selectedWorkoutId: string) {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/workout/history-item/${selectedWorkoutId}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(async res => {
				const workoutHistoryItem: Workout = res.data.workoutHistoryItem;
				const workoutHistoryItemWithDate: Workout = {
					...workoutHistoryItem,
					created: new Date(workoutHistoryItem.created)
				};
				setSelectedWorkout(workoutHistoryItemWithDate);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting workout failed';
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
				<Heading color='$green500' size='3xl'>
					Workout History
				</Heading>
				<Box w='$1/2' my={20}>
					<Dropdown items={filters} onChange={handleFilterChange} isDisabled={isLoading} />
				</Box>
			</Box>
			<ScrollView>
				<Box alignItems='center'>
					<VStack space='2xl' w='$5/6'>
						{filteredHistory.length > 0 ? (
							filteredHistory.map(workout => (
								<Pressable
									onPress={() => setSelectedWorkoutId(workout.id)}
									bgColor='$secondary800'
									padding={15}
									borderRadius={10}
									key={workout.id}>
									<Text color='$green500'>{workout.templateName || 'No Template'}</Text>
									<Text color='white'>Date: {workout.created.toLocaleDateString()}</Text>
									<Text color='white'>Duration: {workout.duration} minutes</Text>
								</Pressable>
							))
						) : (
							<Box alignItems='center'>
								<Text color='white' size='2xl'>
									No workout history
								</Text>
							</Box>
						)}
					</VStack>
				</Box>
			</ScrollView>

			<Modal
				isOpen={showInfoModal}
				onClose={() => {
					setSelectedWorkout(null);
					setSelectedWorkoutId(null);
					setShowInfoModal(false);
				}}>
				<ModalBackdrop />
				<ModalContent bgColor='$secondary700' maxHeight='$5/6'>
					<ModalHeader>
						<Heading size='2xl' color='$green500'>
							Template: {selectedWorkout?.templateName}
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
							<Text color='white'>{selectedWorkout?.created.toLocaleDateString()}</Text>
						</HStack>
						<HStack space='md'>
							<Text color='white' bold>
								Duration:
							</Text>
							<Text color='white'>{selectedWorkout?.duration} minutes</Text>
						</HStack>
						<Divider my='$1' />
						<VStack space='md' paddingBottom={20}>
							{selectedWorkout?.exercises.map((exercise, index) => (
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
												Set {index + 1}: {unit === 'kilos' ? set.weight : kilosToPounds(set.weight)}{' '}
												{unit === 'kilos' ? 'kg' : 'lbs'} x {set.reps} reps
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
