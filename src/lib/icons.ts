import { Building, ForkKnife, LucideIcon } from 'lucide-react';

export const locationTypeIcons: Record<string, LucideIcon> = {
	restaurant: ForkKnife,
	lecture_hall: Building,
} as const;
