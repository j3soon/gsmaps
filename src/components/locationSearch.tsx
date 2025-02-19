import * as React from 'react';
import { Search } from 'lucide-react';
import { locationTypeIcons } from '@/lib/icons';

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { Button } from './ui/button';
import data from '@/lib/dataresized';

interface LocationSearchProps {
	setIsCameraMove: React.Dispatch<React.SetStateAction<boolean>>;
	onLocationSelect: (locationId: number) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
	setIsCameraMove,
	onLocationSelect,
}) => {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const handleLocationClick = (locationId: number) => {
		onLocationSelect(locationId);
		setOpen(false);
	};

	return (
		<>
			<Button
				size="icon"
				variant="ghost"
				className="h-16 w-16"
				onClick={() => {
					setOpen(true);
					setIsCameraMove(true);
				}}
			>
				<Search className="!h-6 !w-6" />
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={(v) => {
					setOpen(v);
					setIsCameraMove(false);
				}}
			>
				<CommandInput placeholder="Search a location..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{[...new Set(data.locations.map((l) => l.type))].map((category) => (
						<React.Fragment key={category}>
							<CommandGroup heading={category}>
								{data.locations
									.filter((l) => l.type === category)
									.map((l) => (
										<CommandItem key={l.id} onSelect={() => handleLocationClick(l.id)}>
											{React.createElement(locationTypeIcons[l.type], {
												className: 'mr-2 h-4 w-4',
											})}
											<span className="font-semibold">{l.name.en}</span>
										</CommandItem>
									))}
							</CommandGroup>
							<CommandSeparator />
						</React.Fragment>
					))}
				</CommandList>
			</CommandDialog>
		</>
	);
};
