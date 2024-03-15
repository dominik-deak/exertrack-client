import {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	Box,
	Button,
	ButtonText,
	Heading,
	Text
} from '@gluestack-ui/themed';
import { GestureResponderEvent } from 'react-native';

/**
 * setState type source:
 * https://stackoverflow.com/a/65824149
 *
 * onPress type source:
 * https://stackoverflow.com/a/59902008
 */
type ModalProps = {
	message: string;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
	heading: string;
	btnText: string;
	btnAction: (event: GestureResponderEvent) => void;
};

function MessageModal({ message, setMessage, heading, btnText, btnAction }: ModalProps) {
	return (
		<AlertDialog isOpen={message ? true : false} onClose={() => setMessage('')}>
			<AlertDialogBackdrop disabled />
			<AlertDialogContent bgColor='$secondary800'>
				<AlertDialogHeader>
					<Heading size='2xl' color='$white'>
						{heading || 'Message'}
					</Heading>
				</AlertDialogHeader>
				<AlertDialogBody>
					<Text size='lg' color='$white'>
						{message}
					</Text>
				</AlertDialogBody>
				<AlertDialogFooter>
					<Box alignItems='center'>
						<Button size='lg' bgColor='$green600' onPress={btnAction}>
							<ButtonText>{btnText || 'Ok'}</ButtonText>
						</Button>
					</Box>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default MessageModal;
