import { DateTime } from 'luxon';

const aperoStart = '18:00';
const aperoEnd = '19:30';

export const getCitiesForApero = (cities: { name: string; timezone: string }[]) => {
	return cities.filter(city => {
		const localTime = DateTime.now().setZone(city.timezone).toFormat('HH:mm');
		return localTime >= aperoStart && localTime <= aperoEnd;
	});
};
