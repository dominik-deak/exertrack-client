import { Button, ButtonText, SafeAreaView, Text } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import workoutTemplates from '../../data/templates.json';

export default function editTemplates() {
	return (
		<SafeAreaView flex={1}>
			<Text color='white'>test </Text>
			<Button onPress={router.back}>
				<ButtonText color='white'>asd</ButtonText>
			</Button>
		</SafeAreaView>
	);
}
