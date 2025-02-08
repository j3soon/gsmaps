import { Bounds, useBounds } from '@react-three/drei';
import { useState, useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

interface BoxOutlineProps {
	position: [number, number, number];
	rotation: [number, number, number];
	boxargs: [number, number, number];
	viewPosition?: [number, number, number];
	isCameraMove: boolean;
	setIsCameraMove: React.Dispatch<React.SetStateAction<boolean>>;
	boxNumber: number;
	onSelect: (boxNumber: number) => void;
}

// Add a ref type for the exposed methods
export interface BoundedBoxOutlineRef {
	boundBox: () => void;
}

const BoundedBoxOutline = forwardRef<BoundedBoxOutlineRef, BoxOutlineProps>(
	(
		{
			position,
			rotation,
			boxargs,
			viewPosition,
			isCameraMove,
			setIsCameraMove,
			boxNumber,
			onSelect,
		},
		ref
	) => {
		const interpolateFunc = (t: number) => {
			const value = 1 - Math.exp(-5 * t) + 0.007 * t;

			if (1 - value < 0.01) {
				setTimeout(() => setIsCameraMove(false), 500);
			}

			return value;
		};

		// Create a ref to the BoxOutline component
		const boxOutlineRef = useRef<BoxOutlineRef>(null);

		// Expose the boundBox method through the ref
		useImperativeHandle(ref, () => ({
			boundBox: () => {
				boxOutlineRef.current?.boundBox();
			},
		}));

		return (
			<Bounds margin={1.2} maxDuration={1} interpolateFunc={interpolateFunc}>
				<BoxOutline
					ref={boxOutlineRef}
					position={position}
					rotation={rotation}
					boxargs={boxargs}
					viewPosition={viewPosition}
					isCameraMove={isCameraMove}
					setIsCameraMove={setIsCameraMove}
					onSelect={onSelect}
					boxNumber={boxNumber}
				/>
			</Bounds>
		);
	}
);

// Add a ref type for the BoxOutline component
interface BoxOutlineRef {
	boundBox: () => void;
}

const BoxOutline = forwardRef<BoxOutlineRef, BoxOutlineProps>(
	({ position, rotation, boxargs, viewPosition, setIsCameraMove, boxNumber, onSelect }, ref) => {
		const [hovered, setHovered] = useState(false);
		const meshRef = useRef<THREE.Mesh>(null);
		const bounds = useBounds();

		const edgePoints = useMemo(() => {
			const boxGeometry = new THREE.BoxGeometry(...boxargs);
			const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
			const positions = edgesGeometry.attributes.position.array;
			const points: THREE.Vector3[] = [];

			for (let i = 0; i < positions.length; i += 3) {
				points.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
			}

			return points;
		}, [boxargs]);

		const boundBox = () => {
			if (meshRef.current) {
				setIsCameraMove(true);
				onSelect(boxNumber);

				if (viewPosition) {
					bounds.refresh(meshRef.current).moveTo(viewPosition).lookAt({ target: position });
					return;
				}

				bounds.refresh(meshRef.current).fit();
			}
		};

		// Expose the boundBox method through the ref
		useImperativeHandle(ref, () => ({
			boundBox,
		}));

		return (
			<group position={position} rotation={rotation}>
				{edgePoints.map(
					(_, i) =>
						i % 2 === 0 && (
							<mesh key={i}>
								<tubeGeometry
									args={[
										new THREE.LineCurve3(edgePoints[i], edgePoints[i + 1]),
										1,
										hovered ? 0.2 : 0.05,
										8,
										false,
									]}
								/>
								<meshBasicMaterial color={hovered ? 'white' : 'white'} />
							</mesh>
						)
				)}
				<mesh
					ref={meshRef}
					onPointerOver={() => setHovered(true)}
					onPointerOut={() => setHovered(false)}
					onClick={(e) => {
						e.stopPropagation();
						boundBox();
					}}
				>
					<boxGeometry args={boxargs} />
					<meshBasicMaterial visible={false} />
				</mesh>
			</group>
		);
	}
);

export default BoundedBoxOutline;
