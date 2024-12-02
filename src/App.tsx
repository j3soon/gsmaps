import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
	Stats,
	OrbitControls,
	Billboard,
	Text,
	Environment,
	Gltf,
	Html,
	CameraControls,
} from '@react-three/drei';
import * as Three from 'three';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetOverlay,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

// @ts-ignore
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

const Splat = ({ sources }: { sources: string[] }) => {
	const [viewer, setViewer] = useState(new Three.Group());

	useEffect(() => {
		const viewer = new GaussianSplats3D.DropInViewer({
			freeIntermediateSplatData: true,
			sharedMemoryForWorkers: false,
			showLoadingUI: true,
		});
		const addParams = sources.map((source: string) => ({
			path: source,
		}));

		viewer.addSplatScenes(addParams, false).catch((err: any) => {
			console.log('Error loading splat scenes:', err);
		});
		setViewer(viewer);
		return () => void viewer.dispose();
	}, [sources]);

	return <primitive object={viewer} />;
};

const LocationInfo = ({
	open,
	setOpen,
	name,
	description,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	name: string;
	description: string;
}) => {
	return (
		<Sheet open={open} onOpenChange={setOpen} modal={false}>
			<SheetContent
				side="left"
				className="absolute z-20"
				onInteractOutside={(event) => event.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle>{name}</SheetTitle>
					<SheetDescription>{description}</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};

const Location = ({
	open,
	setOpen,
	name,
	setName,
	description,
	setDescription,
	position,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	name: string;
	setName: (name: string) => void;
	description: string;
	setDescription: (description: string) => void;
	position: [number, number, number];
}) => {
	return (
		<>
			<Html center distanceFactor={50} position={position}>
				<Button
					variant="outline"
					onClick={() => {
						setOpen(true);
						setName(name);
						setDescription(description);
					}}
				>
					{name}
				</Button>
			</Html>
		</>
	);
};

const Camera = ({
	name,
	godViewRef,
}: {
	name: string;
	godViewRef: React.MutableRefObject<(() => void) | null>;
}) => {
	const ref = useRef<CameraControls>(null);
	const [isRotate, setIsRotate] = useState(false);

	useEffect(() => {
		if (name == 'Town Hall') {
			ref.current?.moveTo(-3.5, 13, 7, true);
			setIsRotate(true);
		} else if (name == 'Coffee') {
			ref.current?.moveTo(11, 11, -55, true);
			setIsRotate(true);
		}
	}, [name]);

	useFrame(() => {
		if (isRotate) {
			ref.current?.rotate(0.001, 0);
		}
	});

	useEffect(() => {
		// Initial camera setup
		ref.current?.setPosition(15, 15, 15);
		ref.current?.setTarget(0, 0, 0);
		setIsRotate(true);
		ref.current?.addEventListener('controlstart', () => {
			setIsRotate(false);
		});

		godViewRef.current = () => {
			// Get current position and target
			let currentPosition: Three.Vector3 = new Three.Vector3();
			ref.current?.getPosition(currentPosition);
			let currentTarget: Three.Vector3 = new Three.Vector3();
			ref.current?.getTarget(currentTarget);

			if (currentPosition && currentTarget) {
				ref.current?.lerpLookAt(
					currentPosition.x,
					currentPosition.y,
					currentPosition.z,
					currentTarget.x,
					currentTarget.y,
					currentTarget.z,
					0,
					75,
					0,
					0,
					0,
					0,
					0.5,
					true
				);
			}
			setIsRotate(true);
		};
	}, []);

	return <CameraControls ref={ref} />;
};
const App = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const godViewRef = useRef<(() => void) | null>(null);

	return (
		<>
			<div className="absolute right-6 top-6 z-10 space-y-1 rounded-xl bg-muted p-2">
				<Input placeholder="Search..." className="bg-white px-4 !text-lg" />
				<Button
					variant="outline"
					onClick={() => {
						setOpen(true);
						setName('Coffee');
						setDescription(
							'The coffee shop is a place where you can buy coffee. Coffee? COFFEE?? COFFEE!!! WOOOOOOOOOO :DDDDDDDD'
						);
					}}
				>
					Coffee
				</Button>
				<Button
					variant="outline"
					onClick={() => {
						setOpen(true);
						setName('Town Hall');
						setDescription(
							'The town hall is a place where you can find information about the town.'
						);
					}}
				>
					Town Hall
				</Button>
			</div>

			<div className="absolute bottom-6 right-6 z-10 flex flex-col gap-1 rounded-xl bg-muted p-2">
				<Button variant="outline">Default View</Button>
				<Button
					variant="outline"
					onClick={() => {
						godViewRef.current?.();
					}}
				>
					God View
				</Button>
			</div>

			<LocationInfo open={open} setOpen={setOpen} name={name} description={description} />

			<div className="h-screen w-full">
				<Canvas>
					<Stats className="hidden" />
					<Camera name={name} godViewRef={godViewRef} />

					<Environment
						background={true}
						files={'evening_road_01_puresky_1k.hdr'}
						backgroundIntensity={1}
					/>

					{/* <group rotation={[-Math.PI / 2, 0, 0]} scale={[10, 10, 10]}>
						<Splat sources={['nthu_campus_part.ply']} />
					</group> */}

					<Gltf src="low_poly_city/scene.gltf" scale={[0.01, 0.01, 0.01]} />

					<Location
						open={open}
						setOpen={setOpen}
						name="Town Hall"
						setName={setName}
						description="The town hall is a place where you can find information about the town."
						setDescription={setDescription}
						position={[-3.5, 13, 7]}
					/>

					<Location
						open={open}
						setOpen={setOpen}
						name="Coffee"
						setName={setName}
						description="The coffee shop is a place where you can buy coffee. Coffee? COFFEE?? COFFEE!!! WOOOOOOOOOO :DDDDDDDDDDDDDD"
						setDescription={setDescription}
						position={[11, 11, -55]}
					/>

					<hemisphereLight args={[0xffeeb1, 0x080820, 1]} />
				</Canvas>
			</div>
		</>
	);
};

export default App;
