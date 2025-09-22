// utils/db.ts
import 'setimmediate';
import SQLite from 'react-native-sqlite-storage';

export type CityWithTimezone = {
	name: string;
	timezone: string;
};

let db: SQLite.SQLiteDatabase;

const initializeDatabase = async () => {
	try {
		db = await SQLite.openDatabase({
			name: 'apero.db',
			location: 'default',
		});
		console.log('Database opened successfully');
		return db;
	} catch (error) {
		console.error('Error opening database', error);
		throw error;
	}
};

export const getCitiesWithTimezones = async (): Promise<CityWithTimezone[]> => {
	try {
		if (!db) {
			await initializeDatabase();
		}

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
	} catch (error) {
		console.error('Database error', error);
		throw error;
	}
};
