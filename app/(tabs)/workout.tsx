import LoadingModal from '@/components/LoadingModal';
import MessageModal from '@/components/MessageModal';
import { API } from '@/constants/config';
import useTokens from '@/hooks/useTokens';
import { Template } from '@/types/Template';
import { Box, Button, ButtonText, Divider, Heading, SafeAreaView, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';

// // mock data
// import workoutTemplates from '@/data/templates.json';

/**
 * The workout page component.
 * Lists the default and user created templates, and the no template option.
 * Includes buttons for editing templates and exercises.
 * @returns The workout page component.
 */
export default function Workout() {
	const isFocused = useIsFocused();
	const { accessToken, tokenError } = useTokens();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [defaultTemplates, setDefaultTemplates] = useState<Template[]>([]);
	const [userTemplates, setUserTemplates] = useState<Template[]>([]);

	useEffect(() => {
		if (isFocused && accessToken) fetchTemplates();
	}, [isFocused, accessToken]);

	useEffect(() => {
		if (tokenError) setError(tokenError);
	}, [accessToken, tokenError, isFocused]);

	/**
	 * Fetches the templates from the server.
	 */
	function fetchTemplates() {
		setIsLoading(true);

		if (!accessToken) {
			setError("Can't get access token");
			setIsLoading(false);
			return;
		}

		axios
			.get(`${API}/templates`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
			.then(async res => {
				const { defaultTemplates, userTemplates } = res.data;
				// console.log(defaultTemplates, userTemplates);
				setDefaultTemplates(defaultTemplates);
				setUserTemplates(userTemplates);
			})
			.catch(error => {
				let message: string;
				if (axios.isAxiosError(error)) {
					message = error.response?.data.error || 'Getting templates failed';
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

			<Box alignItems='center' marginBottom={40}>
				<Heading color='$green500' size='3xl'>
					Templates
				</Heading>
				<Text color='$green700' size='xl'>
					Pick a template to start from:
				</Text>
			</Box>

			<ScrollView>
				<Box alignItems='center' pb={100}>
					<VStack space='4xl' w='$5/6'>
						{/* {workoutTemplates.map(template => (
							<Link
								key={template.id}
								href={{
									pathname: '/workout/[template]',
									params: { template: template.id }
								}}
								asChild>
								<Button size='xl' bgColor='$green600'>
									<ButtonText>{template.name}</ButtonText>
								</Button>
							</Link>
						))}
						<Divider /> */}

						{defaultTemplates.length > 0 && (
							<>
								<Box alignItems='center'>
									<Text color='$green700' size='2xl'>
										Default Templates
									</Text>
								</Box>
								{defaultTemplates.map(template => (
									<Link
										key={template.id}
										href={{
											pathname: '/workout/[templateId]',
											params: { templateId: template.id }
										}}
										asChild>
										<Button size='xl' bgColor='$green600'>
											<ButtonText>{template.name}</ButtonText>
										</Button>
									</Link>
								))}
							</>
						)}

						<Divider />
						<Box alignItems='center'>
							<Text color='$green700' size='2xl'>
								User Templates
							</Text>
						</Box>
						{userTemplates.length > 0 ? (
							<>
								{userTemplates.map(template => (
									<Link
										key={template.id}
										href={{
											pathname: '/workout/[templateId]',
											params: { templateId: template.id }
										}}
										asChild>
										<Button size='xl' bgColor='$green600'>
											<ButtonText>{template.name}</ButtonText>
										</Button>
									</Link>
								))}
							</>
						) : (
							<Box alignItems='center'>
								<Text>No templates yet</Text>
							</Box>
						)}
						<Link href='/template/edit-templates' asChild>
							<Button size='xl' action='secondary'>
								<ButtonText>Edit Your Templates</ButtonText>
							</Button>
						</Link>
						<Link href='/exercise/edit-exercises' asChild>
							<Button size='xl' action='secondary'>
								<ButtonText>Edit Your Exercises</ButtonText>
							</Button>
						</Link>

						<Divider />
						<Box alignItems='center'>
							<Text color='$green700' size='2xl'>
								Start From Scratch
							</Text>
						</Box>
						<Link href='/workout/no-template' asChild>
							<Button size='xl' action='secondary'>
								<ButtonText>No Template</ButtonText>
							</Button>
						</Link>
					</VStack>
				</Box>
			</ScrollView>
		</SafeAreaView>
	);
}
