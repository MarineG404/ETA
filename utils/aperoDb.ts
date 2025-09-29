// utils/aperoDb.ts
import { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

export type SpecialItem = {
	type: 'cocktail' | 'mocktail' | 'food';
	name: string;
};

export type CityData = {
	city: string;
	timezone: string;
	specials: SpecialItem[];
};

let db: SQLiteDatabase | null = null;
let dbReady: Promise<SQLiteDatabase> | null = null;

/** Initialise la DB (singleton) */
async function initializeDb(): Promise<SQLiteDatabase> {
	if (db) return db;
	if (!dbReady) {
		dbReady = (async () => {
			const handle = await SQLite.openDatabaseAsync('apero.db');
			db = handle;
			return handle;
		})();
	}
	return dbReady;
}

/** 🔥 RESET DB et reseed complet avec toutes les données */
export const resetDatabase = async () => {
	const handle = await initializeDb();

	await handle.withTransactionAsync(async () => {
		console.log('[DB] Reset en cours : DROP ALL TABLES...');
		await handle.execAsync(`
      DROP TABLE IF EXISTS translations;
      DROP TABLE IF EXISTS specials;
      DROP TABLE IF EXISTS types;
      DROP TABLE IF EXISTS cities;
      DROP TABLE IF EXISTS countries;
      DROP TABLE IF EXISTS timezones;
    `);
		await handle.execAsync('PRAGMA user_version = 0;');
	});

	console.log('[DB] Base vidée. Re-seeding...');

	await handle.withTransactionAsync(async () => {
		// --- Création tables
		await handle.execAsync(`
      CREATE TABLE IF NOT EXISTS timezones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        iana TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        country_id INTEGER NOT NULL,
        timezone_id INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS specials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type_id INTEGER NOT NULL,
        default_name TEXT NOT NULL,
        country_id INTEGER,
        city_id INTEGER
      );
    `);

		// --- Seed timezones
		await handle.execAsync(`
      INSERT OR IGNORE INTO timezones (iana) VALUES
        ('Europe/Paris'), ('America/New_York'), ('America/Los_Angeles'),
        ('Europe/London'), ('Europe/Berlin'), ('Asia/Tokyo'),
        ('Asia/Kolkata'), ('Australia/Sydney'), ('America/Sao_Paulo'),
        ('Africa/Johannesburg');
    `);

		// --- Seed countries
		await handle.execAsync(`
      INSERT OR IGNORE INTO countries (name) VALUES
        ('France'), ('United States'), ('United Kingdom'), ('Germany'),
        ('Japan'), ('India'), ('Australia'), ('Brazil'), ('South Africa'), ('Canada');
    `);

		// --- Seed cities
		await handle.execAsync(`
      INSERT OR IGNORE INTO cities (name, country_id, timezone_id) VALUES
        ('Paris',         (SELECT id FROM countries WHERE name='France'),         (SELECT id FROM timezones WHERE iana='Europe/Paris')),
        ('Lyon',          (SELECT id FROM countries WHERE name='France'),         (SELECT id FROM timezones WHERE iana='Europe/Paris')),
        ('New York',      (SELECT id FROM countries WHERE name='United States'),  (SELECT id FROM timezones WHERE iana='America/New_York')),
        ('Los Angeles',   (SELECT id FROM countries WHERE name='United States'),  (SELECT id FROM timezones WHERE iana='America/Los_Angeles')),
        ('London',        (SELECT id FROM countries WHERE name='United Kingdom'), (SELECT id FROM timezones WHERE iana='Europe/London')),
        ('Manchester',    (SELECT id FROM countries WHERE name='United Kingdom'), (SELECT id FROM timezones WHERE iana='Europe/London')),
        ('Berlin',        (SELECT id FROM countries WHERE name='Germany'),        (SELECT id FROM timezones WHERE iana='Europe/Berlin')),
        ('Tokyo',         (SELECT id FROM countries WHERE name='Japan'),          (SELECT id FROM timezones WHERE iana='Asia/Tokyo')),
        ('Osaka',         (SELECT id FROM countries WHERE name='Japan'),          (SELECT id FROM timezones WHERE iana='Asia/Tokyo')),
        ('Mumbai',        (SELECT id FROM countries WHERE name='India'),          (SELECT id FROM timezones WHERE iana='Asia/Kolkata')),
        ('Delhi',         (SELECT id FROM countries WHERE name='India'),          (SELECT id FROM timezones WHERE iana='Asia/Kolkata')),
        ('Sydney',        (SELECT id FROM countries WHERE name='Australia'),      (SELECT id FROM timezones WHERE iana='Australia/Sydney')),
        ('São Paulo',     (SELECT id FROM countries WHERE name='Brazil'),         (SELECT id FROM timezones WHERE iana='America/Sao_Paulo')),
        ('Rio de Janeiro',(SELECT id FROM countries WHERE name='Brazil'),         (SELECT id FROM timezones WHERE iana='America/Sao_Paulo')),
        ('Johannesburg',  (SELECT id FROM countries WHERE name='South Africa'),   (SELECT id FROM timezones WHERE iana='Africa/Johannesburg')),
        ('Cape Town',     (SELECT id FROM countries WHERE name='South Africa'),   (SELECT id FROM timezones WHERE iana='Africa/Johannesburg')),
        ('Toronto',       (SELECT id FROM countries WHERE name='Canada'),         (SELECT id FROM timezones WHERE iana='America/New_York')),
        ('Montreal',      (SELECT id FROM countries WHERE name='Canada'),         (SELECT id FROM timezones WHERE iana='America/New_York'));
    `);

		// --- Seed types
		await handle.execAsync(`INSERT OR IGNORE INTO types (name) VALUES ('cocktail'), ('mocktail'), ('food');`);

		// --- Seed specials
		await handle.execAsync(`
      INSERT OR IGNORE INTO specials (type_id, default_name, country_id, city_id) VALUES
      -- France
      ((SELECT id FROM types WHERE name='cocktail'), 'French 75', (SELECT id FROM countries WHERE name='France'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Virgin Mojito', (SELECT id FROM countries WHERE name='France'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Croissant', (SELECT id FROM countries WHERE name='France'), NULL),
      -- United States
      ((SELECT id FROM types WHERE name='cocktail'), 'Old Fashioned', (SELECT id FROM countries WHERE name='United States'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Shirley Temple', (SELECT id FROM countries WHERE name='United States'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Burger', (SELECT id FROM countries WHERE name='United States'), NULL),
      -- United Kingdom
      ((SELECT id FROM types WHERE name='cocktail'), 'Pimm''s Cup', (SELECT id FROM countries WHERE name='United Kingdom'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Elderflower Fizz', (SELECT id FROM countries WHERE name='United Kingdom'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Fish and Chips', (SELECT id FROM countries WHERE name='United Kingdom'), NULL),
      -- Germany
      ((SELECT id FROM types WHERE name='cocktail'), 'Berliner Weisse', (SELECT id FROM countries WHERE name='Germany'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Apfelschorle', (SELECT id FROM countries WHERE name='Germany'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Bratwurst', (SELECT id FROM countries WHERE name='Germany'), NULL),
      -- Japan
      ((SELECT id FROM types WHERE name='cocktail'), 'Tokyo Tea', (SELECT id FROM countries WHERE name='Japan'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Matcha Fizz', (SELECT id FROM countries WHERE name='Japan'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Sushi', (SELECT id FROM countries WHERE name='Japan'), NULL),
      -- India
      ((SELECT id FROM types WHERE name='cocktail'), 'Mango Margarita', (SELECT id FROM countries WHERE name='India'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Lassi', (SELECT id FROM countries WHERE name='India'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Samosa', (SELECT id FROM countries WHERE name='India'), NULL),
      -- Australia
      ((SELECT id FROM types WHERE name='cocktail'), 'Sydney Sling', (SELECT id FROM countries WHERE name='Australia'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Lemon Lime Bitters', (SELECT id FROM countries WHERE name='Australia'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Meat Pie', (SELECT id FROM countries WHERE name='Australia'), NULL),
      -- Brazil
      ((SELECT id FROM types WHERE name='cocktail'), 'Caipirinha', (SELECT id FROM countries WHERE name='Brazil'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Guaraná', (SELECT id FROM countries WHERE name='Brazil'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Feijoada', (SELECT id FROM countries WHERE name='Brazil'), NULL),
      -- South Africa
      ((SELECT id FROM types WHERE name='cocktail'), 'Springbokkie', (SELECT id FROM countries WHERE name='South Africa'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Rooibos Iced Tea', (SELECT id FROM countries WHERE name='South Africa'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Biltong', (SELECT id FROM countries WHERE name='South Africa'), NULL),
      -- Canada
      ((SELECT id FROM types WHERE name='cocktail'), 'Caesar', (SELECT id FROM countries WHERE name='Canada'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Maple Lemonade', (SELECT id FROM countries WHERE name='Canada'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Poutine', (SELECT id FROM countries WHERE name='Canada'), NULL);
    `);
	});

	console.log('[DB] Re-seeding terminé ✅');
};


export const getCityData = async (): Promise<CityData[]> => {
	const handle = await initializeDb();

	const rows = await handle.getAllAsync<{
		city: string;
		timezone: string;
		type_name: string;
		default_name: string;
	}>(`
    SELECT
      c.name AS city,
      t.iana AS timezone,
      ty.name AS type_name,
      s.default_name
    FROM cities c
      JOIN timezones t ON c.timezone_id = t.id
      JOIN countries co ON c.country_id = co.id
      LEFT JOIN specials s
        ON (s.country_id = co.id OR s.city_id = c.id)
      LEFT JOIN types ty ON s.type_id = ty.id
    ORDER BY c.name, ty.id
  `);

	const cityMap: Record<string, CityData> = {};
	rows.forEach(r => {
		if (!cityMap[r.city]) {
			cityMap[r.city] = { city: r.city, timezone: r.timezone, specials: [] };
		}
		if (r.type_name && r.default_name) {
			cityMap[r.city].specials.push({
				type: r.type_name as 'cocktail' | 'mocktail' | 'food',
				name: r.default_name,
			});
		}
	});

	// DEBUG
	const specialsDebug = await handle.getAllAsync<any>(`SELECT * FROM specials LIMIT 10;`);
	console.log('[DEBUG specials]', specialsDebug);

	return Object.values(cityMap);
};
