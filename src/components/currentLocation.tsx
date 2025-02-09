import { ChevronsUpDown, X } from 'lucide-react';
import { locations } from '@/lib/locations';
import { Button } from './ui/button';
import { animated, useSpring } from '@react-spring/web';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface CurrentLocationProps {
	selectedBox: number | null;
	onClose: () => void;
}

const CurrentLocation: React.FC<CurrentLocationProps> = ({ selectedBox, onClose }) => {
	const location = locations.find((l) => l.id === selectedBox);

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
		<animated.div
			style={springs}
			className="fixed right-4 top-4 z-10 rounded-lg bg-white shadow-md"
		>
			<Collapsible>
				<div className="flex items-center gap-2 px-4 py-2">
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
							<ChevronsUpDown size={14} />
						</Button>
					</CollapsibleTrigger>
					<span className="text-sm font-semibold">{location.name}</span>
					<Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
						<X size={14} />
					</Button>
				</div>
				<CollapsibleContent className="px-4 pb-2">
					<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 max-h-[200px] max-w-[300px] space-y-2 overflow-y-auto">
						<p className="text-sm text-muted-foreground">{location.description}</p>
						<a
							href={location.gmapsUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="block text-xs text-blue-500 hover:underline"
						>
							View on Google Maps
						</a>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</animated.div>
	);
};

export default CurrentLocation;
