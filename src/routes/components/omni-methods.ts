import { AppStreamer } from '@nvidia/omniverse-webrtc-streaming-library';

/**
 * Teleports the camera to a specific position and rotation.
 * @param position - The position to teleport the camera to.
 * @param rotation - The rotation to set the camera to.
 */
export const teleportCamera = (position: number[], quaternion: number[]) => {
	const message = {
		event_type: 'teleportCameraRequest',
		payload: {
			position: position,
			quaternion: quaternion
		}
	};

	AppStreamer.sendMessage(JSON.stringify(message));
};

/**
 * Loads a scene from a specified path.
 * @param scenePath - The path to the scene to load.
 */
export const loadScene = (scenePath: string) => {
	const message = {
		event_type: 'openStageRequest',
		payload: {
			url: scenePath
		}
	};

	AppStreamer.sendMessage(JSON.stringify(message));
};

/**
 * Checks if the Kit is ready.
 */
export const checkKitReadiness = () => {
	const message = {
		event_type: 'loadingStateQuery',
		payload: {}
	};

	AppStreamer.sendMessage(JSON.stringify(message));
};

/**
 * Handles custom events from the Omniverse stream.
 * @param message - The message received from the stream.
 */
export const handleCustomEvent = (message: any) => {
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
		} else {
			console.error(`Failed to load stage: ${message.payload.url}`);
		}
	}

	// Handle loading state changes
	if (message && message.event_type === 'loadingStateResponse') {
		console.log('Loading state:', message.payload);
		if (message.payload.loading_state === 'idle') {
			console.log('Kit is idle and ready for loading');
		} else if (message.payload.loading_state === 'loading') {
			console.log(`Loading in progress: ${message.payload.url || 'unknown file'}`);
		}
	}

	// Handle progress updates
	if (message && message.event_type === 'updateProgressActivity') {
		console.log('Loading progress:', message.payload);
	}

	// Handle errors
	if (message && message.event_type === 'error') {
		console.error('Kit error:', message.payload);
	}
};
