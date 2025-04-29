<script>
	import { Switch } from '$lib/components/ui/switch';
	import data from '$lib/data';
	import { Canvas } from '@threlte/core';
	import CurrentInfo from './components/current-info.svelte';
	import OmniRenderer from './components/omni-renderer.svelte';
	import Scene from './components/scene.svelte';
	import { states } from './states.svelte';

	const currentLocation = $derived(data.locations.find((l) => l.id === states.currentId));
</script>

<div class="fixed left-8 top-8 z-10 flex items-center gap-2">
	<Switch bind:checked={() => states.mode == 'omni', (v) => (states.mode = v ? 'omni' : 'three')} />
	{states.mode}
</div>

<div class="fixed right-8 top-8 z-10">
	{#if states.currentId && currentLocation}
		<CurrentInfo locationData={currentLocation} onClose={() => {}} />
	{/if}
</div>

<div class="absolute h-screen w-full">
	<Canvas renderMode="always">
		<Scene />
	</Canvas>
</div>

<div class="absolute -z-10 h-screen w-full">
	<OmniRenderer hidden={states.mode != 'omni'} />
</div>
