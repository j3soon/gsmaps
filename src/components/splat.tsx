// @ts-ignore
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { useEffect, useState } from 'react';
import * as Three from 'three';

interface SplatProps {
	sources: string[];
	setIsSplatsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Splat: React.FC<SplatProps> = ({ sources, setIsSplatsLoaded }) => {
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

		viewer
			.addSplatScenes(addParams, false)
			.then(() => {
				setIsSplatsLoaded(true);
			})
			.catch((err: any) => {
				console.log('Error loading splat scenes:', err);
			});
		setViewer(viewer);
		return () => void viewer.dispose();
	}, []);

	return <primitive object={viewer} />;
};

export default Splat;
