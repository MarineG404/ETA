interface LocalizationWithTimezone {
	timezone: string;
}

export function getCurrentTimezone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

