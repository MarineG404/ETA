// Définition du type pour la structure des données des villes par fuseau horaire
type TimezonesCities = {
	[timezone: string]: {
		city: string;    // Nom de la ville
		country: string; // Nom du pays
	}[];
};

import timezones_cities_json from '@/assets/timezones_by_iana.json';

// Conversion des données importées au type défini ci-dessus
const timeZoneCities = timezones_cities_json as TimezonesCities;

/**
 * Récupère la liste des villes associées à un fuseau horaire donné.
 * @param tz - Le nom du fuseau horaire (IANA)
 * @returns Un tableau d'objets { city, country } ou un tableau vide si le fuseau n'existe pas
 */
export function getTimezoneData(tz: string) {
	return timeZoneCities[tz] || [];
}
