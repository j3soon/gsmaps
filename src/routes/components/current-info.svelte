<script lang="ts">
	import data from '$lib/data';
	import { X } from '@lucide/svelte';

	type LocationData = (typeof data.locations)[number];

	let {
		locationData,
		onClose = () => {}
	}: {
		locationData: LocationData;
		onClose: () => void;
	} = $props();
</script>

<div class="fixed right-4 top-4 z-10 flex flex-col gap-2">
	<div class="rounded-lg bg-white shadow-md">
		<div class="px-4 py-2">
			<div class="flex items-center gap-2">
				<button class="rounded-full p-1 hover:bg-gray-100" onclick={onClose}>
					<X size={14} />
				</button>
				<div class="flex-1">
					<div class="text-xs text-muted-foreground">Current Location</div>
					<div class="text-sm font-semibold">{locationData.name.en}</div>
				</div>
			</div>
		</div>
		<div class="px-4 pb-2">
			<div
				class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 max-h-[200px] max-w-[300px] space-y-2 overflow-y-auto"
			>
				<p class="text-sm text-muted-foreground">{locationData.description.en}</p>
				{#if locationData.maps_url}
					<a
						href={locationData.maps_url}
						target="_blank"
						rel="noopener noreferrer"
						class="block text-xs text-blue-500 hover:underline"
					>
						View on Google Maps
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>
