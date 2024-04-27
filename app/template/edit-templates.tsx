import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import useTokens from '@/hooks/useTokens';
import { Template } from '@/types/Template';
import {
	Box,
	Button,
	ButtonText,
	Divider,
	Heading,
	KeyboardAvoidingView,
	SafeAreaView,
	ScrollView,
	Text,
	VStack
} from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// // mock data
// import workoutTemplates from '@/data/templates.json';

/**
 * The EditUserTemplates component, which allows the user to edit their templates.
 * Renders a list of user templates with options to edit or delete each template.
 * @return The rendered component.
 */
export default function EditUserTemplates() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [userTemplates, setUserTemplates] = useState<Template[]>([]);

	// Initial template data
	useEffect(() => {
		if (isFocused && accessToken) fetchUserTemplates();
	}, [isFocused, accessToken]);

	// Token errors
	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	/**
	 * Fetches the user templates from the server.
	 */
	function fetchUserTemplates() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/templates/user`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(res => {
				const { userTemplates } = res.data;
				setUserTemplates(userTemplates);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting user templates failed';
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
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'height'} style={{ flex: 1, zIndex: 999 }}>
			<SafeAreaView flex={1}>
				{isLoading && <LoadingModal />}
				<MessageModal
					message={error}
					setMessage={setError}
					heading='Error'
					btnText='Ok'
					btnAction={() => setError('')}
				/>

				<Box alignItems='center' marginBottom={20}>
					<Button onPress={router.back} isDisabled={isLoading} bgColor='$green600' marginVertical={20}>
						<ButtonText color='white'>Back to Templates</ButtonText>
					</Button>
					<Heading color='$green500' size='3xl'>
						Your Templates
					</Heading>
					<Text color='$green700' size='xl'>
						Click a template to edit:
					</Text>
				</Box>

				<ScrollView>
					<Box alignItems='center' pb={100}>
						<VStack space='4xl' w='$5/6'>
							<Divider />
							{userTemplates.length > 0 ? (
								<>
									{userTemplates.map(template => (
										<Link
											key={template.id}
											href={{
												pathname: '/template/[templateId]',
												params: { templateId: template.id }
											}}
											asChild>
											<Button size='xl' bgColor='$green600'>
												<ButtonText>{template.name}</ButtonText>
											</Button>
										</Link>
									))}
									<Divider />
								</>
							) : (
								<Box alignItems='center'>
									<Text color='$green700' size='xl'>
										No templates found
									</Text>
								</Box>
							)}

							<Link href='/template/create-template' asChild>
								<Button size='xl' action='secondary'>
									<ButtonText>Create New Template</ButtonText>
								</Button>
							</Link>
						</VStack>
					</Box>
				</ScrollView>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}
