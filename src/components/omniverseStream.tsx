import { useCallback, useEffect, useRef, useState } from 'react';
import { AppStreamer } from '@nvidia/omniverse-webrtc-streaming-library';
import { OmniverseConfig, sampleScenePaths } from '@/lib/omni';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface OmniverseStreamProps {
	config: OmniverseConfig;
}

const OmniverseStream = ({ config }: OmniverseStreamProps) => {
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const videoRef = useRef<HTMLVideoElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const connectionRef = useRef<boolean>(false);

	// Function to teleport camera to a specific position and rotation
	const teleportCamera = useCallback(
		(position: number[], rotation: number[]) => {
			if (!isConnected) return;

			const message = {
				event_type: 'teleportCameraRequest',
				payload: {
					position: position,
					rotation: rotation,
				},
			};

			AppStreamer.sendMessage(JSON.stringify(message));
		},
		[isConnected]
	);

	const setupStream = useCallback(async () => {
		setIsLoading(true);

		try {
			// Clean up any existing connection
			if (connectionRef.current) {
				AppStreamer.stop();
				connectionRef.current = false;
				await new Promise((resolve) => setTimeout(resolve, 500));
			}

			// Setup stream configuration
			const streamConfig = {
				signalingServer: config.serverIp,
				signalingPort: config.signalingPort,
				mediaServer: config.serverIp,
				mediaPort: config.mediaPort,
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
						setIsConnected(true);
						connectionRef.current = true;
						setIsLoading(false);

						// First check if Kit is ready before attempting to load a scene
						setTimeout(() => {
							checkKitReadiness();
							console.log('Checking Kit readiness before loading scene');

							// Wait a bit longer and then attempt to load the scene
							setTimeout(() => {
								const loadSceneMessage = {
									event_type: 'openStageRequest',
									payload: {
										// Try without leading slash first
										url: './samples/stage01.usd',
									},
								};
								AppStreamer.sendMessage(JSON.stringify(loadSceneMessage));
								console.log('Sent request to load scene');
							}, 2000);
						}, 2000); // Wait longer before sending any requests to give Kit time to initialize
					}
				},
				onCustomEvent: (message: any) => {
					// Parse message if it's a string
					if (typeof message === 'string') {
						try {
							message = JSON.parse(message);
						} catch (e) {
							console.log('Not a JSON string message:', message);
						}
					}

					console.log('Custom event:', message);

					// Handle stage loading events
					if (message && message.event_type === 'openedStageResult') {
						console.log('Stage loading result:', message.payload);
						if (message.payload.result === 'success') {
							console.log(`Successfully loaded stage: ${message.payload.url}`);
							setIsLoading(false);

							// Show success alert
							alert(`Successfully loaded: ${message.payload.url}`);
						} else {
							console.error(`Failed to load stage: ${message.payload.url}`);
							setIsLoading(false);

							// Show error alert with path suggestion
							alert(
								`Failed to load stage: ${message.payload.url}\n\nTry paths like:\n- ${message.payload.url.replace(/^\/+/, '')}\n- omniverse://localhost${message.payload.url}`
							);
						}
					}

					// Handle loading state changes
					if (message && message.event_type === 'loadingStateResponse') {
						console.log('Loading state:', message.payload);
						if (message.payload.loading_state === 'idle') {
							setIsLoading(false);

							// If there's a URL in the response, we know a stage is loaded
							if (message.payload.url) {
								console.log(`Stage already loaded: ${message.payload.url}`);
							} else {
								console.log('No stage currently loaded, ready for loading');
							}
						} else if (message.payload.loading_state === 'loading') {
							setIsLoading(true);
							console.log(`Loading in progress: ${message.payload.url || 'unknown file'}`);
						}
					}

					// Handle progress updates
					if (message && message.event_type === 'updateProgressActivity') {
						console.log('Loading progress:', message.payload);
						setIsLoading(true);
					}

					// Handle errors
					if (message && message.event_type === 'error') {
						console.error('Kit error:', message.payload);
						setIsLoading(false);
						alert(`Error from Kit: ${message.payload.message || JSON.stringify(message.payload)}`);
					}
				},
				onStop: (message: any) => {
					console.log('Stream stopped:', message);
					setIsConnected(false);
					connectionRef.current = false;
				},
				onTerminate: (message: any) => {
					console.log('Stream terminated:', message);
					setIsConnected(false);
					connectionRef.current = false;
				},
			};

			const streamProps = {
				streamConfig,
				streamSource: 'direct' as const,
			};

			// Connect to the stream
			await AppStreamer.connect(streamProps);
		} catch (error) {
			console.error('Failed to connect to Omniverse stream:', error);
			setIsLoading(false);
			setIsConnected(false);
			connectionRef.current = false;
		}
	}, [config]);

	// Function to check if Kit is ready
	const checkKitReadiness = useCallback(() => {
		if (!isConnected) return;

		const message = {
			event_type: 'loadingStateQuery',
			payload: {},
		};

		AppStreamer.sendMessage(JSON.stringify(message));
		console.log('Checking if Kit is ready...');
	}, [isConnected]);

	// Function to handle navigation to predefined points of interest
	const navigateToPointOfInterest = (poiIndex: number) => {
		const pois = [
			{ position: [300, 300, 300], rotation: [0, 0, -Math.PI / 2] }, // Above and to the right
			{ position: [-300, 300, 0], rotation: [-Math.PI / 4, Math.PI / 2, 0] }, // Above and to the left
			{ position: [0, 300, -300], rotation: [-Math.PI / 4, 0, 0] }, // Above and behind
		];

		if (poiIndex >= 0 && poiIndex < pois.length) {
			teleportCamera(pois[poiIndex].position, pois[poiIndex].rotation);
		}
	};

	const loadScene = useCallback(
		(scenePath: string) => {
			if (!isConnected) return;

			setIsLoading(true);

			// First check if Kit is ready
			checkKitReadiness();

			// Try different path formats if the original doesn't work
			let formattedPath = scenePath;

			// If path doesn't start with omniverse:// and doesn't have a full protocol
			if (!scenePath.startsWith('omniverse://') && !scenePath.includes('://')) {
				// For absolute paths starting with /, keep as is
				// For relative paths, ensure they don't start with /
				formattedPath = scenePath.startsWith('/') ? scenePath : scenePath.replace(/^\/+/, '');
			}

			const loadSceneMessage = {
				event_type: 'openStageRequest',
				payload: {
					url: formattedPath,
				},
			};

			console.log(`Loading scene: ${formattedPath}`);
			AppStreamer.sendMessage(JSON.stringify(loadSceneMessage));

			// Set loading to false after a timeout (as we might not get a response)
			setTimeout(() => {
				if (isLoading) {
					console.log('No loading response received, resetting loading state');
					setIsLoading(false);
				}
			}, 10000);
		},
		[isConnected, isLoading, checkKitReadiness]
	);

	// Poll for Kit readiness after connection is established
	useEffect(() => {
		if (isConnected) {
			// Start polling for Kit readiness
			const readinessInterval = setInterval(() => {
				checkKitReadiness();
			}, 5000);

			// Clear interval after 60 seconds or when component unmounts
			const timeoutId = setTimeout(() => {
				clearInterval(readinessInterval);
			}, 60000);

			return () => {
				clearInterval(readinessInterval);
				clearTimeout(timeoutId);
			};
		}
	}, [isConnected, checkKitReadiness]);

	// Connect on component mount
	useEffect(() => {
		setupStream();

		// Cleanup on unmount
		return () => {
			if (connectionRef.current) {
				try {
					AppStreamer.stop();
					connectionRef.current = false;
				} catch (error) {
					console.error('Error stopping stream:', error);
				}
			}
		};
	}, [setupStream]);

	return (
		<div className="relative h-full w-full">
			{isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
					<div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
						<Loader2 className="mb-4 h-8 w-8 animate-spin text-gray-700" />
						<p className="text-gray-700">Connecting to Omniverse...</p>
					</div>
				</div>
			)}

			<video
				id="omniverse-video"
				ref={videoRef}
				className="h-full w-full object-cover"
				playsInline
				muted
				autoPlay
			/>
			<audio id="omniverse-audio" ref={audioRef} muted />

			{isConnected && (
				<>
					<div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
						<Button onClick={() => navigateToPointOfInterest(0)} variant="secondary">
							POI 1
						</Button>
						<Button onClick={() => navigateToPointOfInterest(1)} variant="secondary">
							POI 2
						</Button>
						<Button onClick={() => navigateToPointOfInterest(2)} variant="secondary">
							POI 3
						</Button>
						<Button onClick={() => setupStream()} variant="destructive">
							Reconnect
						</Button>
					</div>

					<div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
						<Button onClick={() => loadScene('./samples/stage01.usd')} variant="secondary">
							Load Scene 1
						</Button>
						<Button onClick={() => loadScene('./samples/stage02.usd')} variant="secondary">
							Load Scene 2
						</Button>
					</div>
				</>
			)}

			{isConnected && (
				<div className="absolute right-4 top-20 z-10 rounded-md bg-white/90 p-3 shadow-md">
					<h3 className="mb-2 text-sm font-bold">Debug Info</h3>
					<p className="mb-2 text-xs">
						Server: {config.serverIp}:{config.signalingPort}
					</p>
					<div className="mb-2 flex flex-col gap-2">
						<input
							type="text"
							placeholder="Custom USD path"
							className="rounded border p-1 text-xs"
							id="custom-path-input"
							defaultValue="./samples/stage01.usd"
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									const pathInput = document.getElementById(
										'custom-path-input'
									) as HTMLInputElement;
									if (pathInput && pathInput.value) {
										loadScene(pathInput.value);
									}
								}}
							>
								Load
							</Button>
							<Button size="sm" variant="outline" onClick={() => checkKitReadiness()}>
								Check Kit
							</Button>
						</div>
					</div>
				</div>
			)}

			{!isConnected && !isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/10">
					<div className="rounded-lg bg-white p-6 text-center shadow-lg">
						<p className="mb-4 text-red-600">Connection to Omniverse failed</p>
						<p className="mb-4 text-gray-700">
							Make sure the Omniverse server is running at:
							<br />
							{config.serverIp}:{config.signalingPort}/{config.mediaPort}
						</p>
						<Button onClick={() => setupStream()}>Retry Connection</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default OmniverseStream;
