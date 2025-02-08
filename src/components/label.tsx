import { Html } from '@react-three/drei';
import { ChevronsUpDown, Utensils, X } from 'lucide-react';
import { animated, useSpring } from '@react-spring/web';
import { useEffect } from 'react';
import { locations } from '@/lib/locations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface LabelProps {
	position: [number, number, number];
	number: number;
	isCameraMove: boolean;
	isSelected: boolean;
	onClose?: () => void;
}

const Label = ({ position, number, isCameraMove, isSelected, onClose }: LabelProps) => {
	const [springs, api] = useSpring(() => ({
		from: { opacity: 1 },
		to: { opacity: isCameraMove ? 0 : 1 },
		config: {
			tension: 400,
			friction: 40,
			duration: isCameraMove ? 0 : undefined,
		},
	}));

	useEffect(() => {
		api.start({
			opacity: isCameraMove ? 0 : 1,
			config: {
				tension: 400,
				friction: 40,
				duration: isCameraMove ? 0 : undefined,
			},
		});
	}, [isCameraMove, api]);

	const location = locations.find((l) => l.id === number);

	return (
		<Html center position={position}>
			<animated.div
				style={springs}
				className="flex items-center gap-4 rounded-xl bg-white py-1 text-xl"
			>
				{isSelected ? (
					<Collapsible>
						<div className="flex items-center justify-between space-x-4 px-1">
							<CollapsibleTrigger asChild>
								<button className="rounded-full p-1 hover:bg-gray-100">
									<ChevronsUpDown size="16" />
									<span className="sr-only">Toggle</span>
								</button>
							</CollapsibleTrigger>
							<h4 className="text-nowrap text-sm font-semibold">{location?.name}</h4>
							<button
								onClick={(e) => {
									e.stopPropagation();
									onClose?.();
								}}
								className="rounded-full p-1 hover:bg-gray-100"
							>
								<X size={16} />
							</button>
						</div>
						<CollapsibleContent className="w-96 space-y-2 p-2">
							<div className="text-sm text-muted-foreground">{location?.description}</div>
							<a
								target="_blank"
								href={location?.gmapsUrl}
								className="pb-1 text-xs text-blue-500 text-muted-foreground underline"
							>
								{location?.gmapsUrl}
							</a>
						</CollapsibleContent>
					</Collapsible>
				) : (
					<div className="flex items-center justify-between gap-2 px-2">
						<Utensils size={12} />
						<span className="text-sm font-semibold">{number}</span>
					</div>
				)}
			</animated.div>
		</Html>
	);
};

export default Label;
