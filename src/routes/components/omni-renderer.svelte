<script lang="ts">
	import { omniverseConfig } from '$lib/omni';
	import { AppStreamer } from '@nvidia/omniverse-webrtc-streaming-library';
	import { onMount } from 'svelte';
	import { Spherical, Vector3 } from 'three';
	import { states } from '../states.svelte';
	import { checkKitReadiness, loadScene, teleportCamera } from './omni-methods';

	let { hidden }: { hidden: boolean } = $props();

	let videoRef: HTMLVideoElement | undefined = $state();
	let audioRef: HTMLAudioElement | undefined = $state();
	let isConnected = $state(false);
	let isLoading = $state(true);
	let isSetupDone = $state(false);

	const setupStream = async () => {
		isLoading = true;

		try {
			const streamConfig = {
				signalingServer: omniverseConfig.serverIp,
				signalingPort: omniverseConfig.signalingPort,
				mediaServer: omniverseConfig.serverIp,
				mediaPort: omniverseConfig.mediaPort,
				cursor: 'free',
				mic: false,
				videoElementId: 'omniverse-video',
				audioElementId: 'omniverse-audio',
				authenticate: false,
				maxReconnects: 20,
				nativeTouchEvents: true,
				width: 1920,
				height: 1080,
				fps: 60,
				onUpdate: (message: any) => {
					console.log('Stream update:', message);
				},
				onStart: (message: any) => {
					if (message.action === 'start' && message.status === 'success') {
						console.log('Stream started successfully');
						isConnected = true;
						isLoading = false;

						setTimeout(() => {
							checkKitReadiness();
							console.log('Checking Kit readiness before loading scene');

							setTimeout(() => {
								loadScene('./samples/stage01.usd');
								console.log('Sent request to load scene');
							}, 2000);
						}, 2000);
					}
				},
				onStop: (message: any) => {
					console.log('Stream stopped:', message);
					isConnected = false;
				},
				onTerminate: (message: any) => {
					console.log('Stream terminated:', message);
					isConnected = false;
				}
			};

			const streamProps = {
				streamConfig,
				streamSource: 'direct' as const
			};

			// @ts-ignore
			await AppStreamer.connect(streamProps);
			isSetupDone = true; // Mark setup as done
		} catch (error) {
			console.error('Failed to connect to Omniverse stream:', error);
			isLoading = false;
			isConnected = false;
		}
	};

	onMount(() => {
		if (!hidden && !isSetupDone) {
			setupStream();
		}

		return () => {
			try {
				AppStreamer.stop();
			} catch (error) {
				console.error('Error stopping stream:', error);
			}
		};
	});

	$effect(() => {
		if (hidden) {
			if (videoRef) videoRef.pause();
			if (audioRef) audioRef.pause();
		} else {
			if (!isSetupDone) {
				setupStream();
			} else {
				if (videoRef) videoRef.play().catch((err) => {});
				if (audioRef) audioRef.play().catch((err) => {});
			}
		}
	});

	setInterval(() => {
		if (hidden) return;
		let pos = new Vector3();
		states.controls?.getPosition(pos);

		let sph = new Spherical();
		states.controls?.getSpherical(sph);
		teleportCamera([pos.x * 10, pos.y * 10, pos.z * 10], [sph.theta, Math.PI / 2 - sph.phi, 0]);

		// let target = new Vector3();
		// states.controls?.getTarget(target);

		// teleportCamera(
		// 	[pos.x * 10, pos.y * 10, pos.z * 10],
		// 	[target.x * 10, target.y * 10, target.z * 10]
		// );
	}, 10);
</script>

{#if isLoading && !hidden}
	<div class="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
		<div class="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
			<p class="text-gray-700">Connecting to Omniverse...</p>
		</div>
	</div>
{/if}

<video
	id="omniverse-video"
	bind:this={videoRef}
	class="h-full w-full object-cover"
	class:hidden
	playsinline
	muted
	autoplay
></video>
<audio id="omniverse-audio" bind:this={audioRef} muted></audio>
