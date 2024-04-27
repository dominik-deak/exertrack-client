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
 * setState type source: https://stackoverflow.com/a/65824149
 *
 * onPress type source: https://stackoverflow.com/a/59902008
 */
type ModalProps = {
	message: string;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
	heading: string;
	btnText: string;
	btnAction: (event: GestureResponderEvent) => void;
};

/**
 * Renders a modal component with a message, header, and a button.
 * @param message The message to be displayed in the modal.
 * @param setMessage The function to set the message.
 * @param heading The heading of the modal. If not provided, defaults to 'Message'.
 * @param btnText The text to be displayed on the button. If not provided, defaults to 'Ok'.
 * @param btnAction The function to be called when the button is pressed.
 * @return The rendered modal component.
 */
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
