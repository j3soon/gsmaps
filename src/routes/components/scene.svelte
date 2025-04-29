<script>
	import data from '$lib/data';
	import { T } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { states } from '../states.svelte';
	import Camera from './camera.svelte';
	import Location from './location.svelte';
	import SplatRenderer from './splat-renderer.svelte';

	interactivity();
</script>

{#if states.mode == 'three'}
	<T.Group rotation={[-Math.PI / 2, 0, 0]} scale={[20, 20, 20]}>
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

<Camera bind:controls={states.controls} />
