import { useState } from 'react';
import { Button } from './components/ui/button';
import { Canvas, useThree } from '@react-three/fiber';
import { Stats, OrbitControls, Splat, Billboard, Text } from '@react-three/drei';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

// const Scene = () => {
// 	const { scene } = useThree();

// 	const viewer = new GaussianSplats3D.DropInViewer({
// 		gpuAcceleratedSort: true,
// 	});

// 	viewer.addSplatScenes([
// 		{
// 			path: '/2024march-kotofuri.splat',
// 			position: [0, 0, 0],
// 			rotation: [0, 0, 0],
// 		},
// 	]);

// 	scene.add(viewer);

// 	return null;
// };

function App() {
	return (
		<div className="h-screen w-full">
			<Canvas>
				<OrbitControls />
				<Stats />

				<Splat src="/2024march-kotofuri.splat" />

				<Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, 3.5, 1.2]}>
					<Text fontSize={0.5} color={'blue'}>
						I'm a bowtie!
					</Text>
				</Billboard>

				<Billboard
					follow={true}
					lockX={false}
					lockY={false}
					lockZ={false}
					position={[0, -4.8, -1.2]}
				>
					<Text fontSize={0.5} color={'blue'}>
						I'm cool shoes!
					</Text>
				</Billboard>

				<mesh position={[4, 0, 0]}>
					<boxGeometry args={[2, 2, 2]} />
					<meshPhongMaterial />
				</mesh>
				<ambientLight intensity={0.1} color={'white'} />
				<directionalLight position={[1, 0.75, 0.5]} color="red" />
			</Canvas>
		</div>
	);
}

export default App;
