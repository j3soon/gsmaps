import type CC from 'camera-controls';

export const states: {
	mode: 'three' | 'omni';
	controls: CC | undefined;
	currentId: number;
} = $state({
	mode: 'three',
	controls: undefined,
	currentId: 0
});
