import {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogBody,
	AlertDialogContent,
	HStack,
	Spinner,
	Text
} from '@gluestack-ui/themed';

type LoadingModalProps = {
	message?: string;
};

/**
 * Renders a loading modal component with a message and a spinner.
 * @param message The message to be displayed in the loading modal. Defaults to 'Loading...'.
 * @return The loading modal component.
 */
function LoadingModal({ message = 'Loading...' }: LoadingModalProps) {
	return (
		<AlertDialog isOpen={true}>
			<AlertDialogBackdrop disabled />
			<AlertDialogContent bgColor='$secondary800'>
				<AlertDialogBody>
					<HStack space='sm'>
						<Spinner color='$green500' size='large' />
						<Text color='$green500' size='4xl'>
							{message}
						</Text>
					</HStack>
				</AlertDialogBody>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default LoadingModal;
