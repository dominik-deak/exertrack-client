import workoutTemplates from '@/data/templates.json';
import { Button, ButtonText, SafeAreaView, Text } from '@gluestack-ui/themed';
import { router } from 'expo-router';

export default function EditTemplates() {
	return (
		<SafeAreaView flex={1}>
			<Text color='white'>test </Text>
			<Button onPress={router.back}>
				<ButtonText color='white'>asd</ButtonText>
			</Button>
		</SafeAreaView>
	);
}
