import { Building, ForkKnife, LucideIcon } from 'lucide-react';

export const locationTypeIcons: Record<string, LucideIcon> = {
	'Campus Canteen': ForkKnife,
	'General Buildings': Building,
} as const;
