export function calculateDistance(
	point1: [number, number, number],
	point2: [number, number, number]
): number {
	const dx = point2[0] - point1[0];
	const dy = point2[1] - point1[1];
	const dz = point2[2] - point1[2];

	// Calculate Euclidean distance and multiply by 10 to approximate meters
	return Math.sqrt(dx * dx + dy * dy + dz * dz) * 10;
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
