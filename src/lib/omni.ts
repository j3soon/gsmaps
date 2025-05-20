import { z } from 'zod';

/**
 * Type definition for Omniverse streaming configuration
 */
export interface OmniverseConfig {
	serverIp: string;
	signalingPort: number;
	mediaPort: number;
	streamSource: 'direct' | 'gfn';
}

/**
 * Validation schema for Omniverse config
 */
export const omniverseConfigSchema = z.object({
	serverIp: z.string(),
	signalingPort: z.number().int().positive(),
	mediaPort: z.number().int().positive(),
	streamSource: z.enum(['direct', 'gfn'])
});

/**
 * Default configuration for local Omniverse streaming
 * Uses environment variables if available, otherwise uses defaults
 */
export const omniverseConfig: OmniverseConfig = {
	serverIp: '140.114.78.196',
	signalingPort:
		typeof process !== 'undefined'
			? Number(process.env.OMNIVERSE_SIGNALING_PORT || '49100')
			: 49100,
	mediaPort:
		typeof process !== 'undefined' ? Number(process.env.OMNIVERSE_MEDIA_PORT || '1024') : 1024,
	streamSource:
		typeof process !== 'undefined' && process.env.OMNIVERSE_STREAM_SOURCE === 'gfn'
			? 'gfn'
			: 'direct'
};

/**
 * Formats a message to send to the Omniverse server
 */
export const formatOmniverseMessage = (eventType: string, payload: Record<string, any>) => {
	return JSON.stringify({
		event_type: eventType,
		payload: payload
	});
};

/**
 * Predefined camera positions for navigation
 */
export const cameraPositions = {
	mainView: { position: [0, 20, 0], rotation: [0, 0, 0] },
	buildingA: { position: [50, 15, 30], rotation: [0, Math.PI / 4, 0] },
	buildingB: { position: [-40, 10, -20], rotation: [0, -Math.PI / 4, 0] },
	aerial: { position: [0, 100, 0], rotation: [Math.PI / 2, 0, 0] }
};

/**
 * Sample scene paths
 */
export const sampleScenePaths = {
	sample0: './samples/gsplat_assets/usd/example_scene.usd',
	sample1: './samples/stage01.usd',
	sample2: './samples/stage02.usd'
};
