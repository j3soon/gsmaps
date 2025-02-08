import * as React from 'react';
import { Building, ForkKnife, Search } from 'lucide-react';

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
import { locations } from '@/lib/locations';

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
					{[...new Set(locations.map((l) => l.category))].map((category) => (
						<React.Fragment key={category}>
							<CommandGroup heading={category}>
								{locations
									.filter((l) => l.category === category)
									.map((l) => (
										<CommandItem key={l.id} onSelect={() => handleLocationClick(l.id)}>
											{l.category === 'Campus Canteen' ? (
												<ForkKnife className="mr-2 h-4 w-4" />
											) : (
												<Building className="mr-2 h-4 w-4" />
											)}
											<span className="font-semibold">{l.name}</span>
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
