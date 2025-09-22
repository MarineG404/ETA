// utils/db.ts
import SQLite from 'react-native-sqlite-storage';

export type CityWithTimezone = {
	name: string;
	timezone: string;
};

const db = SQLite.openDatabase(
	{ name: 'apero.db', location: 'default' },
	() => console.log('DB ouverte'),
	err => console.error('Erreur ouverture DB', err)
);

export const getCitiesWithTimezones = (): Promise<CityWithTimezone[]> => {
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT c.name as city, t.iana as timezone
         FROM cities c
         JOIN timezones t ON c.timezone_id = t.id`,
				[],
				(_, result) => {
					const cities: CityWithTimezone[] = [];
					for (let i = 0; i < result.rows.length; i++) {
						const row = result.rows.item(i);
						cities.push({ name: row.city, timezone: row.timezone });
					}
					resolve(cities);
				},
				(_, error) => {
					console.error('Erreur lors de la récupération des villes', error);
					reject(error);
					return true;
				}
			);
		});
	});
};
