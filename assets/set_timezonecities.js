const fs = require("fs");
const moment = require("moment-timezone");
const cityTimezones = require("city-timezones");

// Récupère toutes les timezones supportées
const timeZones = Intl.supportedValuesOf("timeZone");

// Objet résultat
const tzCities = {};

// Pour chaque timezone, on prend le nom de la ville du format IANA
timeZones.forEach(tz => {
	// Exemple : "Europe/Paris" → "Paris"
	const city = tz.split("/").pop().replace(/_/g, " ");

	tzCities[tz] = {
		city,
	};
});

// Écrit le résultat dans un fichier JSON
fs.writeFileSync(
	__dirname + "/timezones_cities_bis.json",
	JSON.stringify(tzCities, null, 2),
	"utf-8"
);

console.log("Fichier généré : assets/timezones_cities_bis.json");
