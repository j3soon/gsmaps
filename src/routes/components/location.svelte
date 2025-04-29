<script lang="ts">
	import BoundingBox from './boundingbox.svelte';

	let { data, onSelect = () => {} }: { data: any; onSelect: () => void } = $props();
</script>

<BoundingBox
	coordinates={data.geometry.coordinates}
	startHeight={data.geometry.start_height}
	endHeight={data.geometry.height}
	{onSelect}
/>

<!-- <Label
	position={[
		data.geometry.coordinates.reduce((acc: number, curr: [number, number]) => acc + curr[0], 0) /
			data.geometry.coordinates.length,
		data.geometry.start_height + data.geometry.height + 5,
		data.geometry.coordinates.reduce((acc: number, curr: [number, number]) => acc + curr[1], 0) /
			data.geometry.coordinates.length
	]}
	number={data.id}
	imageUrl={data.images ? data.images[0] : ''}
	name={data.name.en}
/> -->
