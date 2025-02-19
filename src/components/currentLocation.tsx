import { ChevronsUpDown, X } from 'lucide-react';
import { Button } from './ui/button';
import { animated, useSpring } from '@react-spring/web';
import { calculateDistance } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import data from '@/lib/dataresized';

interface CurrentLocationProps {
	selectedBox: number | null;
	onClose: () => void;
	onNavigateTo?: (location: (typeof data.locations)[0]) => void;
}

const getNearbyLocations = (currentLocation: (typeof data.locations)[0]) => {
	const currentPositionSum = currentLocation.geometry.coordinates.reduce(
		(acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]],
		[0, 0]
	);
	const currentPosition: [number, number, number] = [
		currentPositionSum[0] / currentLocation.geometry.coordinates.length,
		0,
		currentPositionSum[1] / currentLocation.geometry.coordinates.length,
	];

	return data.locations
		.filter((loc) => loc.id !== currentLocation.id)
		.map((loc) => ({
			...loc,
			distance: calculateDistance(
				currentPosition,
				(() => {
					const locationSum = loc.geometry.coordinates.reduce(
						(acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]],
						[0, 0]
					);
					return [
						locationSum[0] / loc.geometry.coordinates.length,
						0,
						locationSum[1] / loc.geometry.coordinates.length,
					];
				})()
			),
		}))
		.sort((a, b) => a.distance - b.distance)
		.slice(0, 3);
};
const CurrentLocation: React.FC<CurrentLocationProps> = ({
	selectedBox,
	onClose,
	onNavigateTo,
}) => {
	const location = data.locations.find((l) => l.id === selectedBox);

	const springs = useSpring({
		from: { opacity: 0, transform: 'translateY(-20px)' },
		to: {
			opacity: selectedBox ? 1 : 0,
			transform: selectedBox ? 'translateY(0)' : 'translateY(-20px)',
		},
		config: { tension: 280, friction: 20 },
	});

	if (!selectedBox || !location) return null;

	return (
		<div className="fixed right-4 top-4 z-10 flex flex-col gap-2">
			<animated.div style={springs} className="rounded-lg bg-white shadow-md">
				<Collapsible>
					<div className="px-4 py-2">
						<div className="flex items-center gap-2">
							<CollapsibleTrigger asChild>
								<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
									<ChevronsUpDown size={14} />
								</Button>
							</CollapsibleTrigger>
							<div className="flex-1">
								<div className="text-xs text-muted-foreground">Current Location</div>
								<div className="text-sm font-semibold">{location.name.en}</div>
							</div>
							<Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
								<X size={14} />
							</Button>
						</div>
					</div>
					<CollapsibleContent className="px-4 pb-2">
						<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 max-h-[200px] max-w-[300px] space-y-2 overflow-y-auto">
							<p className="text-sm text-muted-foreground">{location.description.en}</p>
							{location.maps_url && (
								<a
									href={location.maps_url}
									target="_blank"
									rel="noopener noreferrer"
									className="block text-xs text-blue-500 hover:underline"
								>
									View on Google Maps
								</a>
							)}
						</div>
					</CollapsibleContent>
				</Collapsible>
			</animated.div>

			{getNearbyLocations(location).map((nearby) => (
				<animated.div key={nearby.id} style={springs} className="rounded-lg bg-white/90 shadow-md">
					<Collapsible>
						<div className="px-4 py-2">
							<div className="flex items-center gap-2">
								<CollapsibleTrigger asChild>
									<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
										<ChevronsUpDown size={14} />
									</Button>
								</CollapsibleTrigger>
								<div className="flex-1">
									<div className="text-xs text-muted-foreground">
										{nearby.distance.toFixed(0)}m away
									</div>
									<div className="text-sm font-medium">{nearby.name.en}</div>
								</div>
							</div>
						</div>
						<CollapsibleContent className="px-4 pb-2">
							<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 max-h-[200px] max-w-[300px] space-y-2 overflow-y-auto">
								<p className="text-sm text-muted-foreground">{nearby.description.en}</p>
								{nearby.maps_url && (
									<a
										href={nearby.maps_url}
										target="_blank"
										rel="noopener noreferrer"
										className="block text-xs text-blue-500 hover:underline"
									>
										View on Google Maps
									</a>
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>
				</animated.div>
			))}
		</div>
	);
};

export default CurrentLocation;
