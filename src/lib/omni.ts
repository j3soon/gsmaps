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
 */
export const omniverseConfig: OmniverseConfig = {
	serverIp: '172.28.33.205',
	signalingPort: 49100, // Default signaling port for Omniverse streaming
	mediaPort: 1024, // Default media port for Omniverse streaming
	streamSource: 'direct'
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
	sample1: './samples/stage01.usd',
	sample2: './samples/stage02.usd'
};
