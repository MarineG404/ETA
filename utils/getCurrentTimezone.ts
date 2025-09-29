// Typage pour un fuseau
import { DateTime } from 'luxon';

export interface LocalizationWithTimezone {
	timezone: string;
}

export function getCurrentTimezone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}


export function getLocalTime(timezone: string, format = 'HH:mm'): string {
	return DateTime.now().setZone(timezone).toFormat(format);
}
