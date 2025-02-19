import { Bounds, useBounds } from '@react-three/drei';
import { useState, useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

interface BoxOutlineProps {
	coordinates: number[][];
	startHeight: number;
	endHeight: number;
	isCameraMove: boolean;
	setIsCameraMove: React.Dispatch<React.SetStateAction<boolean>>;
	boxNumber: number;
	onSelect: (boxNumber: number) => void;
}

export interface BoundedBoxOutlineRef {
	boundBox: () => void;
}

const BoundedBoxOutline = forwardRef<BoundedBoxOutlineRef, BoxOutlineProps>(
	(
		{ coordinates, startHeight, endHeight, isCameraMove, setIsCameraMove, boxNumber, onSelect },
		ref
	) => {
		const interpolateFunc = (t: number) => {
			const value = 1 - Math.exp(-5 * t) + 0.007 * t;
			if (1 - value < 0.01) {
				setTimeout(() => setIsCameraMove(false), 500);
			}
			return value;
		};

		const boxOutlineRef = useRef<BoxOutlineRef>(null);

		useImperativeHandle(ref, () => ({
			boundBox: () => {
				boxOutlineRef.current?.boundBox();
			},
		}));

		return (
			<Bounds margin={1.2} maxDuration={1} interpolateFunc={interpolateFunc}>
				<BoxOutline
					ref={boxOutlineRef}
					coordinates={coordinates}
					startHeight={startHeight}
					endHeight={endHeight}
					isCameraMove={isCameraMove}
					setIsCameraMove={setIsCameraMove}
					onSelect={onSelect}
					boxNumber={boxNumber}
				/>
			</Bounds>
		);
	}
);

interface BoxOutlineRef {
	boundBox: () => void;
}

const BoxOutline = forwardRef<BoxOutlineRef, BoxOutlineProps>(
	({ coordinates, startHeight, endHeight, setIsCameraMove, boxNumber, onSelect }, ref) => {
		const [hovered, setHovered] = useState(false);
		const meshRef = useRef<THREE.Group>(null);
		const bounds = useBounds();

		const geometry = useMemo(() => {
			// Create lines for vertical edges
			const verticalLines: [THREE.Vector3, THREE.Vector3][] = coordinates.map(([x, z]) => [
				new THREE.Vector3(x, startHeight, z),
				new THREE.Vector3(x, startHeight + endHeight, z),
			]);

			// Create lines for top and bottom edges
			const horizontalLines: [THREE.Vector3, THREE.Vector3][] = [];
			for (let i = 0; i < coordinates.length; i++) {
				const [x1, z1] = coordinates[i];
				const [x2, z2] = coordinates[(i + 1) % coordinates.length];

				// Bottom edges
				horizontalLines.push([
					new THREE.Vector3(x1, startHeight, z1),
					new THREE.Vector3(x2, startHeight, z2),
				]);

				// Top edges
				horizontalLines.push([
					new THREE.Vector3(x1, startHeight + endHeight, z1),
					new THREE.Vector3(x2, startHeight + endHeight, z2),
				]);
			}

			return [...verticalLines, ...horizontalLines];
		}, [coordinates, startHeight, endHeight]);

		const shapeGeometry = useMemo(() => {
			const shape = new THREE.Shape();
			coordinates.forEach(([x, z], i) => {
				if (i === 0) {
					shape.moveTo(x, z);
				} else {
					shape.lineTo(x, z);
				}
			});
			shape.closePath();

			const extrudeSettings = {
				steps: 1,
				depth: endHeight,
				bevelEnabled: false,
			};

			return new THREE.ExtrudeGeometry(shape, extrudeSettings);
		}, [coordinates, startHeight, endHeight]);

		const boundBox = () => {
			if (meshRef.current) {
				setIsCameraMove(true);
				onSelect(boxNumber);
				bounds.refresh(meshRef.current).fit();
			}
		};

		useImperativeHandle(ref, () => ({
			boundBox,
		}));

		return (
			<group
				ref={meshRef}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
				onClick={(e) => {
					e.stopPropagation();
					boundBox();
				}}
			>
				{geometry.map((line, i) => (
					<mesh key={i}>
						<tubeGeometry
							args={[new THREE.LineCurve3(line[0], line[1]), 1, hovered ? 0.2 : 0.05, 8, false]}
						/>
						<meshBasicMaterial color={hovered ? 'white' : 'white'} />
					</mesh>
				))}
				<mesh
					geometry={shapeGeometry}
					position={[0, endHeight + startHeight, 0]}
					rotation={[Math.PI / 2, 0, 0]}
				>
					<meshBasicMaterial visible={false} />
				</mesh>
			</group>
		);
	}
);

export default BoundedBoxOutline;
