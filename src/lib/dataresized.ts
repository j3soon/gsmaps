import data from './data.json';

const scale = 0.2;
const translation = [0, 0, 0];

export default {
	...data,
	locations: data.locations.map((location) => {
		const coordinates = location.geometry.coordinates.map(([x, y, z]) => [
			x * scale + translation[0],
			y * scale + translation[1],
			z * scale + translation[2],
		]);
		const start_height = location.geometry.start_height * scale + translation[1];
		const height = location.geometry.height * scale + translation[1];
		return { ...location, geometry: { coordinates, start_height, height } };
	}),
};
