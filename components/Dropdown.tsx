import {
	ChevronDownIcon,
	Select,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectIcon,
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectTrigger
} from '@gluestack-ui/themed';

type DropdownProps = {
	items: string[];
	defaultValue?: string;
	onChange: (arg: string) => void;
	isDisabled: boolean;
};

/**
 * Renders a dropdown component with customisable options.
 * @param items An array of strings representing the dropdown options (Will capitalise items for labels).
 * @param defaultValue The default selected option (Uses first array item as the default value if it's not specified).
 * @param onChange A function to handle the selection change.
 * @param isDisabled Flag to disable the dropdown.
 * @return The dropdown component.
 */
export default function Dropdown({ items, defaultValue, onChange, isDisabled }: DropdownProps) {
	return (
		<Select
			defaultValue={defaultValue || items[0].charAt(0).toUpperCase() + items[0].slice(1)}
			// FIXME right now bgColor is a bright colour because can't seem to change dark text colour
			bgColor='#bbb'
			shadowColor='black'
			onValueChange={onChange}
			isDisabled={isDisabled}
			w='$full'>
			<SelectTrigger variant='outline' size='md'>
				<SelectInput placeholder='Select option' />
				<SelectIcon mr='$3' as={ChevronDownIcon} />
			</SelectTrigger>
			<SelectPortal>
				<SelectBackdrop />
				<SelectContent>
					<SelectDragIndicatorWrapper>
						<SelectDragIndicator />
					</SelectDragIndicatorWrapper>
					{items.map((item, index) => (
						<SelectItem
							key={index}
							label={item.charAt(0).toUpperCase() + item.slice(1)}
							value={item.toLowerCase()}
						/>
					))}
				</SelectContent>
			</SelectPortal>
		</Select>
	);
}
