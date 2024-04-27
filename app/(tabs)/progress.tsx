import Dropdown from '@/components/Dropdown';
import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import { useUnitPreference } from '@/contexts/UnitPreferenceContext';
import useTokens from '@/hooks/useTokens';
import { SplitUsageData, SplitUsageItem, VolumeData, VolumeItem } from '@/types/Charts';
import { Box, Heading, SafeAreaView, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const volumeFrequencies = ['weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly'];
const generatedColors = new Set<string>();

/**
 * Formats a date in the format dd/mm/yyyy.
 * Source: https://www.freecodecamp.org/news/javascript-date-format-how-to-format-a-date-in-js/
 * @param date The date to format
 * @returns The formatted date
 */
function formatDate(date: Date) {
	const d = new Date(date);
	return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

/**
 * Generates a unique random color.
 *
 * Sources:
 * - https://stackoverflow.com/a/2629608
 * - https://css-tricks.com/snippets/javascript/random-hex-color/
 * @param generatedColors The set of generated colors to prevent duplicates
 * @returns The unique random color
 */
function generateUniqueRandomColor(generatedColors: Set<string>) {
	let attempts = 0;
	// setting max attempts prevents an infinite loop
	// realistically, this is very unlikely to happen
	const max = 1000;
	while (attempts < max) {
		const color = `#${Math.floor(Math.random() * 16777215)
			.toString(16)
			.padStart(6, '0')}`;
		if (!generatedColors.has(color)) {
			generatedColors.add(color);
			return color;
		}
		attempts++;
	}
	throw new Error(`Unable to generate a unique color after ${max} attempts`);
}

/**
 * Renders the Progress component, which displays the most used routines and volume frequency data.
 * @return The rendered Progress component.
 */
export default function Progress() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const { unit } = useUnitPreference();

	const [splitUsageData, setSplitUsageData] = useState<SplitUsageData>([]);
	const [volumeFrequency, setVolumeFrequency] = useState(volumeFrequencies[0]);
	const [volumeData, setVolumeData] = useState<VolumeData | null>(null);
	const [dateRange, setDateRange] = useState('');

	useEffect(() => {
		if (isFocused && accessToken) fetchSplitUsages();
	}, [isFocused, accessToken]);

	useEffect(() => {
		if (isFocused && accessToken) fetchVolume(volumeFrequency);
	}, [volumeFrequency, isFocused, accessToken]);

	useEffect(() => {
		if (isFocused && tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	// useEffect(() => {
	// 	console.log(splitUsageData);
	// }, [splitUsageData]);

	/**
	 * Handles the change in the selected volume frequency by updating the state.
	 * @param selectedFreq The selected volume frequency
	 */
	function handleVolumeChange(selectedFreq: string) {
		setVolumeFrequency(selectedFreq);
	}

	/**
	 * Fetches the volume data for the selected frequency.
	 * @param frequency The volume frequency
	 * @returns The volume data
	 */
	function fetchVolume(frequency: string) {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/workout/volume/${frequency}/${unit}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(async res => {
				const volume: VolumeItem[] = res.data.volume;
				if (volume.length > 0) {
					const formattedStartDate = formatDate(volume[0].date);
					const formattedEndDate = formatDate(volume[volume.length - 1].date);
					setDateRange(`Date Range: ${formattedStartDate} - ${formattedEndDate}`);

					const volumeData: VolumeData = {
						labels: [],
						datasets: [
							{
								data: volume?.map((item: VolumeItem) => item.volume)
							}
						]
					};
					setVolumeData(volumeData);
				} else {
					setVolumeData(null);
				}
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting volume failed';
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
	 * Fetches the split usages data for the selected frequency,
	 * formats it, and sets it in the state.
	 */
	function fetchSplitUsages() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/workout/split-usage`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(async res => {
				const splitUsagesWithNames: SplitUsageItem[] = res.data.splitUsages;
				const formattedData = splitUsagesWithNames.map((item: SplitUsageItem) => ({
					name: item.templateName || 'No Template',
					used: item.count,
					color: generateUniqueRandomColor(generatedColors),
					legendFontColor: 'white',
					legendFontSize: 15
				}));
				setSplitUsageData(formattedData);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting routine usages failed';
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

			<ScrollView>
				<VStack space='md'>
					<Box>
						<Box alignItems='center'>
							<Heading color='$green500' size='xl'>
								Most Used Routines
							</Heading>
						</Box>
						{splitUsageData.length > 0 ? (
							<>
								<PieChart
									data={splitUsageData}
									width={screenWidth}
									height={300}
									chartConfig={{
										color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
									}}
									accessor={'used'}
									backgroundColor={'transparent'}
									paddingLeft={'15'}
								/>
							</>
						) : (
							<Box alignItems='center' mt={20}>
								<Text color='white' size='2xl'>
									No routines used
								</Text>
							</Box>
						)}
					</Box>

					<Box>
						<Box alignItems='center'>
							<Heading color='$green500' size='xl'>
								Volume Frequency: {volumeFrequency.charAt(0).toUpperCase() + volumeFrequency.slice(1)}
							</Heading>
							<Text color='white' size='md'>
								Volume = Sets x Reps x Weight
							</Text>
							<Box w='$1/2' my={15}>
								<Dropdown items={volumeFrequencies} onChange={handleVolumeChange} isDisabled={isLoading} />
							</Box>
						</Box>
						{volumeData ? (
							<>
								<Text italic color='white' textAlign='center' mb={-30} mt={10}>
									{dateRange}
								</Text>
								<LineChart
									data={volumeData}
									width={Dimensions.get('window').width}
									height={300}
									bezier
									chartConfig={{
										backgroundGradientFrom: '#002800',
										backgroundGradientTo: '#00c413',
										decimalPlaces: 0,
										color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
									}}
									style={{
										borderRadius: 20,
										paddingTop: 40
									}}
								/>
							</>
						) : (
							<Box alignItems='center' mt={20}>
								<Text color='white' size='2xl'>
									No volume data
								</Text>
							</Box>
						)}
					</Box>
				</VStack>
			</ScrollView>
		</SafeAreaView>
	);
}
