// NOTE: This component is not used in the app and is disabled for now.
// Ignore when marking the project.

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

// FIXME implement rest of component
function ConfirmModal({ message, setMessage, heading, btnText, btnAction }: ModalProps) {
	return (
		<AlertDialog isOpen={showCompleteDialog} onClose={() => setShowCompleteDialog(false)}>
			<AlertDialogBackdrop />
			<AlertDialogContent bgColor='$secondary700' maxHeight='$5/6'>
				<AlertDialogHeader>
					<Heading size='2xl' color='white'>
						Complete Workout
					</Heading>
					<AlertDialogCloseButton>
						<AntDesign name='close' size={24} color='white' />
					</AlertDialogCloseButton>
				</AlertDialogHeader>
				<AlertDialogBody>
					<Text color='white'>Are you sure you want to complete this workout?</Text>
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button variant='outline' action='secondary' mr='$3' onPress={() => setShowCompleteDialog(false)}>
						<ButtonText color='white'>Cancel</ButtonText>
					</Button>
					<Button bgColor='$green600' onPress={() => router.replace('/(tabs)/history')}>
						<ButtonText>Complete</ButtonText>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

// export default ConfirmModal; // disabled until component is fully implemented
