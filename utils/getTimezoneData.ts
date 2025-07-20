type TimezonesCities = {
	[timezone: string]: {
		city: string;
		country: string;
	}[];
};

import timezones_cities_json from '@/assets/timezones_by_iana.json';

const timeZoneCities = timezones_cities_json as TimezonesCities;

export function getTimezoneData(tz: string) {
	return timeZoneCities[tz] || [];
}
