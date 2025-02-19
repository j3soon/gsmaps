import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Html } from '@react-three/drei';
import { ChevronsUpDown, X } from 'lucide-react';
import { locationTypeIcons } from '../lib/icons';
import { animated, useSpring } from '@react-spring/web';
import { createElement, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import data from '@/lib/dataresized';

interface LabelProps {
	position: [number, number, number];
	number: number;
	isCameraMove: boolean;
	isSelected: boolean;
	onClose?: () => void;
}

interface ImageCarouselProps {
	images?: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	if (!images || images.length === 0) return null;

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	return (
		<div className="relative h-[200px] w-full overflow-hidden">
			<img
				crossOrigin="anonymous"
				src={images[currentImageIndex]}
				alt="Location preview"
				className="h-full w-full object-cover"
			/>
			{images.length > 1 && (
				<>
					<button
						onClick={prevImage}
						className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/75"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						onClick={nextImage}
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/75"
					>
						<ChevronRight size={20} />
					</button>
					<div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
						{images.map((_, idx) => (
							<div
								key={idx}
								className={`h-1.5 w-1.5 rounded-full ${
									idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
								}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};
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

	const location = data.locations.find((l) => l.id === number);
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<Html center position={position}>
			<animated.div
				style={springs}
				className="flex items-center gap-4 overflow-hidden rounded-xl bg-white pb-1 text-xl"
			>
				{isSelected ? (
					<div className="flex flex-col gap-1">
						{!isExpanded && location?.images?.[0] && (
							<img
								crossOrigin="anonymous"
								src={location?.images?.[0]}
								alt="Location preview"
								className="h-16 w-full object-cover"
							/>
						)}
						<Collapsible onOpenChange={setIsExpanded}>
							<div className="flex items-center justify-between space-x-4 px-1">
								<CollapsibleTrigger asChild>
									<button className="rounded-full p-1 hover:bg-gray-100">
										<ChevronsUpDown size="16" />
										<span className="sr-only">Toggle</span>
									</button>
								</CollapsibleTrigger>
								<h4 className="text-nowrap text-sm font-semibold">{location?.name.en}</h4>
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
							<CollapsibleContent className="w-96 space-y-2">
								<ImageCarousel images={location?.images} />
								<div className="space-y-2 p-2">
									<div className="text-sm text-muted-foreground">{location?.description.en}</div>
									<a
										target="_blank"
										href={location?.maps_url}
										className="block text-xs text-blue-500 hover:underline"
									>
										View on Google Maps
									</a>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				) : (
					<div className="flex items-center justify-between gap-2 px-2">
						{createElement(locationTypeIcons[location?.type ?? 'General Buildings'], {
							size: 12,
						})}
						<span className="text-sm font-semibold">{number}</span>
					</div>
				)}
			</animated.div>
		</Html>
	);
};

export default Label;
