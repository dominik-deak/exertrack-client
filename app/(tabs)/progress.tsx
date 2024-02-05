import { Box, Heading, SafeAreaView, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import lineData from '../../data/lineChart.json';
import pieData from '../../data/pieChart.json';

const screenWidth = Dimensions.get('window').width;

export default function progress() {
	return (
		<SafeAreaView flex={1}>
			<ScrollView>
				<VStack space='lg'>
					<Box>
						<Box alignItems='center'>
							<Heading color='$green500' size='xl'>
								Most Used Routines
							</Heading>
						</Box>
						<PieChart
							data={pieData}
							width={screenWidth}
							height={300}
							chartConfig={{
								color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
							}}
							accessor={'used'}
							backgroundColor={'transparent'}
							paddingLeft={'15'}
						/>
					</Box>

					<Box>
						<Box alignItems='center'>
							<Heading color='$green500' size='xl'>
								Volume Over Last 2 Weeks
							</Heading>
							<Text color='white' size='md'>
								Volume = Sets x Reps x Weight
							</Text>
						</Box>
						<LineChart
							data={lineData}
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
								paddingTop: 30
							}}
						/>
					</Box>
				</VStack>
			</ScrollView>
		</SafeAreaView>
	);
}
