import { Box, Button, ButtonText, Divider, Heading, SafeAreaView, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { Link } from 'expo-router';
import workoutTemplates from '../../data/templates.json';

export default function workout() {
	return (
		<SafeAreaView flex={1}>
			<Box alignItems='center' marginBottom={40}>
				<Heading color='$green500' size='3xl'>
					Templates
				</Heading>
				<Text color='$green700' size='xl'>
					Pick a template to start from:
				</Text>
			</Box>
			<ScrollView>
				<Box alignItems='center'>
					<VStack space='4xl' w='$5/6'>
						{workoutTemplates.map(template => (
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
						<Divider />
						<Link
							// href={{
							// 	pathname: '/workout/[template]',
							// 	params: { template: 'none' }
							// }}
							href='/workout/noTemplate'
							asChild>
							<Button size='xl' action='secondary'>
								<ButtonText>No Template</ButtonText>
							</Button>
						</Link>
						{/* <Link href='/workout/editTemplates' asChild>
							<Button size='xl' action='secondary'>
								<ButtonText>Edit Templates</ButtonText>
							</Button>
						</Link> */}
					</VStack>
				</Box>
			</ScrollView>
		</SafeAreaView>
	);
}
