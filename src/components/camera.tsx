import { MapControls } from '@react-three/drei';

interface CameraProps {
	isCameraMove: boolean;
}

const Camera: React.FC<CameraProps> = ({ isCameraMove }) => {
	return (
		<MapControls
			makeDefault
			maxPolarAngle={Math.PI / 2}
			maxDistance={100}
			minDistance={5}
			enabled={!isCameraMove}
		/>
	);
};

export default Camera;
