<script>
	import data from '$lib/data';
	import { T } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { states } from '../states.svelte';
	import Camera from './camera.svelte';
	import Location from './location.svelte';
	import SplatRenderer from './splat-renderer.svelte';

	interactivity();

	// type Edge = { id: string; a: [number, number, number]; b: [number, number, number] };

	// const edges: Edge[] = Object.entries(data.navigation.edges).map(
	// 	([
	// 		edgeId,
	// 		{
	// 			node: [nid1, nid2]
	// 		}
	// 	]) => {
	// 		const a = data.navigation.nodes[nid1].coordinates as [number, number, number];
	// 		const b = data.navigation.nodes[nid2].coordinates as [number, number, number];
	// 		return { id: edgeId, a, b };
	// 	}
	// );
</script>

{#if states.mode == 'three'}
	<T.Group rotation={[-Math.PI / 2, 0, 0]} scale={[20, 20, 20]} position={[1.5, -6, -1]}>
		<SplatRenderer />
	</T.Group>
{/if}

{#each data.locations as location}
	<Location
		data={location}
		onSelect={() => {
			states.currentId = location.id;
		}}
	/>
{/each}

<T.Group>
	{#each Object.values(data.navigation.nodes) as node}
		<T.Mesh position={[node.coordinates[0], node.coordinates[2] - 7, node.coordinates[1]]}>
			<T.SphereGeometry args={[0.5, 4, 4]} />
			<T.MeshBasicMaterial />
		</T.Mesh>
	{/each}
</T.Group>

<Camera bind:controls={states.controls} />
