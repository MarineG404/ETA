// seed_db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const ct = require("countries-and-timezones");
const cityTimezones = require("city-timezones");

// Nom du fichier SQLite
const DB_FILE = path.join(__dirname, "apero.db");
let db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
	console.log("🚀 Début du seeding...");

	const timezones = ct.getAllTimezones();
	const countries = ct.getAllCountries();
	console.log(countries)

	for (const tzName in timezones) {
		const tz = timezones[tzName];

		// 1. Insert timezone
		db.run(`INSERT OR IGNORE INTO timezones (iana) VALUES (?)`, [tzName], function () {
			db.get(`SELECT id FROM timezones WHERE iana = ?`, [tzName], (err, tzRow) => {
				if (err || !tzRow) return;

				// 2. Pour chaque pays lié au timezone
				tz.countries.forEach((countryCode) => {
					const country = countries[countryCode];
					if (!country) return;

					db.run(`INSERT OR IGNORE INTO countries (name) VALUES (?)`, [country.name], function () {
						db.get(`SELECT id FROM countries WHERE name = ?`, [country.name], (err, cRow) => {
							if (err || !cRow) return;

							// 3. Récupérer des villes par timezone
							const cities = cityTimezones.findFromTimezone(tzName)
								.filter(c => c.iso2 === countryCode)
								.slice(0, 3);

							cities.forEach((city) => {
								db.run(
									`INSERT OR IGNORE INTO cities (name, country_id, timezone_id) VALUES (?, ?, ?)`,
									[city.city, cRow.id, tzRow.id]
								);
							});
						});
					});
				});
			});
		});
	}
});

db.close(() => {
	console.log("✅ Seeding terminé !");
});
