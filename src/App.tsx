import { Canvas } from '@react-three/fiber';
import { Bounds, Environment, useBounds } from '@react-three/drei';
import Splat from './components/splat';
import Camera from './components/camera';
import BoundingBox, { BoundedBoxOutlineRef } from './components/boundingbox';
import { Footprints, LocateFixed } from 'lucide-react';
import { Button } from './components/ui/button';
import { useEffect, useRef, useState } from 'react';
import Label from './components/label';
import { LocationSearch } from './components/locationSearch';
import CurrentLocation from './components/currentLocation';
import data from '@/lib/dataresized';

interface BoundedBoxesProps {
	isCameraMove: boolean;
	setIsCameraMove: React.Dispatch<React.SetStateAction<boolean>>;
	handleBoxSelect: (boxNumber: number) => void;
	isSplatsLoaded: boolean;
	isCameraReturn: boolean;
	setIsCameraReturn: React.Dispatch<React.SetStateAction<boolean>>;
	boxRefs: React.MutableRefObject<(BoundedBoxOutlineRef | null)[]>;
}

const BoundedBoxes: React.FC<BoundedBoxesProps> = ({
	isCameraMove,
	isSplatsLoaded,
	setIsCameraMove,
	handleBoxSelect,
	isCameraReturn,
	setIsCameraReturn,
	boxRefs,
}) => {
	const bounds = useBounds();

	useEffect(() => {
		if (isSplatsLoaded) {
			bounds.moveTo([0, 20, 0]).lookAt({ target: [-10, 0, 0] });
			setIsCameraReturn(false);
		}
	}, [isSplatsLoaded, bounds]);

	useEffect(() => {
		if (isCameraReturn) {
			bounds.refresh().reset().clip().fit();
			setIsCameraReturn(false);
			setIsCameraMove(true);
		}
	}, [bounds, isCameraReturn]);

	return (
		<>
			{data.locations.map((location, index) => (
				<BoundingBox
					ref={(el) => (boxRefs.current[index] = el)}
					key={location.id}
					coordinates={location.geometry.coordinates}
					startHeight={location.geometry.start_height}
					endHeight={location.geometry.height}
					isCameraMove={isCameraMove}
					setIsCameraMove={setIsCameraMove}
					boxNumber={location.id}
					onSelect={handleBoxSelect}
				/>
			))}
		</>
	);
};

const App = () => {
	const [isCameraMove, setIsCameraMove] = useState(false);
	const [selectedBox, setSelectedBox] = useState<number | null>(null);
	const [isSplatsLoaded, setIsSplatsLoaded] = useState(false);
	const [isCameraReturn, setIsCameraReturn] = useState(false);
	const boxRefs = useRef<(BoundedBoxOutlineRef | null)[]>([]);

	// Initialize refs array
	useEffect(() => {
		boxRefs.current = boxRefs.current.slice(0, data.locations.length);
	}, []);

	const handleBoxSelect = (boxNumber: number) => {
		setSelectedBox(boxNumber);
	};

	const handleClose = () => {
		setSelectedBox(null);
		setIsCameraReturn(true);
	};

	const handleLocationSelect = (locationId: number) => {
		const index = data.locations.findIndex((loc) => loc.id === locationId);
		if (index !== -1 && boxRefs.current[index]) {
			boxRefs.current[index]?.boundBox();
			setSelectedBox(locationId);
		}
	};

	const interpolateFunc = (t: number) => {
		const value = 1 - Math.exp(-5 * t) + 0.007 * t;

		if (1 - value < 0.01) {
			setTimeout(() => setIsCameraMove(false), 500);
		}

		return value;
	};

	return (
		<>
			<div className="fixed left-4 top-4 z-10">
				<LocationSearch setIsCameraMove={setIsCameraMove} onLocationSelect={handleLocationSelect} />
			</div>

			<CurrentLocation
				selectedBox={selectedBox}
				onClose={handleClose}
				onNavigateTo={(location) => {
					const index = data.locations.findIndex((loc) => loc.id === location.id);
					if (index !== -1 && boxRefs.current[index]) {
						boxRefs.current[index]?.boundBox();
						setSelectedBox(location.id);
					}
				}}
			/>

			<div className="fixed bottom-4 right-4 z-10 flex flex-col gap-4">
				<Button size="icon" variant="ghost" className="h-16 w-16">
					<LocateFixed className="!h-6 !w-6" />
				</Button>
				<Button size="icon" variant="ghost" className="h-16 w-16">
					<Footprints className="!h-6 !w-6" />
				</Button>
			</div>

			<div className="h-screen w-full">
				<Canvas>
					<Camera isCameraMove={isCameraMove} />

					<Environment
						background={true}
						files={'evening_road_01_puresky_1k.hdr'}
						backgroundIntensity={1}
					/>

					<group rotation={[-Math.PI / 2, 0, 0]} scale={[20, 20, 20]}>
						<Splat
							sources={['nthu_campus_part.compressed.ply']}
							setIsSplatsLoaded={setIsSplatsLoaded}
						/>
					</group>

					{data.locations.map((location) => (
						<Label
							key={location.id}
							position={(() => {
								const sum = location.geometry.coordinates.reduce(
									(acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]],
									[0, 0]
								);
								return [
									sum[0] / location.geometry.coordinates.length,
									location.geometry.start_height + location.geometry.height + 2,
									sum[1] / location.geometry.coordinates.length,
								];
							})()}
							number={location.id}
							isCameraMove={isCameraMove}
							isSelected={selectedBox === location.id}
							onClose={handleClose}
						/>
					))}

					<Bounds margin={1.2} maxDuration={1} interpolateFunc={interpolateFunc}>
						<BoundedBoxes
							isCameraMove={isCameraMove}
							setIsCameraMove={setIsCameraMove}
							handleBoxSelect={handleBoxSelect}
							isSplatsLoaded={isSplatsLoaded}
							isCameraReturn={isCameraReturn}
							setIsCameraReturn={setIsCameraReturn}
							boxRefs={boxRefs}
						/>
					</Bounds>

					<hemisphereLight args={[0xffeeb1, 0x080820, 1]} />
				</Canvas>
			</div>
		</>
	);
};

export default App;
