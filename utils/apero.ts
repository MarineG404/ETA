import { DateTime } from 'luxon';
import { CityData } from './aperoDb';

const aperoStart = '18:00';
const aperoEnd = '19:30';

/**
 * Retourne seulement les villes où c'est actuellement l'heure de l'apéro
 */
export const getCitiesForApero = (cities: CityData[]) => {
	return cities.filter(city => {
		const localTime = DateTime.now().setZone(city.timezone).toFormat('HH:mm');
		return localTime >= aperoStart && localTime <= aperoEnd;
	});
};
