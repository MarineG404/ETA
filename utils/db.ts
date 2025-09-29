// utils/db.ts
import 'setimmediate';
import * as SQLite from 'expo-sqlite';

export type CityWithTimezone = { name: string; timezone: string };

let db: SQLite.SQLiteDatabase | null = null;
let dbReady: Promise<SQLite.SQLiteDatabase> | null = null;

// --- helpers
async function tableInfo(db: SQLite.SQLiteDatabase, table: string) {
	return db.getAllAsync<{ cid: number; name: string; type: string; notnull: number; dflt_value: any; pk: number }>(
		`PRAGMA table_info(${table});`
	);
}
async function hasColumn(db: SQLite.SQLiteDatabase, table: string, col: string) {
	try {
		const cols = await tableInfo(db, table);
		return cols.some(c => c.name === col);
	} catch {
		return false;
	}
}

// --- MIGRATION: assure que 'cities' a bien country_id & timezone_id
async function migrateIfNeeded(db: SQLite.SQLiteDatabase) {
	// Si la table n'existe pas encore, PRAGMA table_info renverra 0 ligne -> on ne fait rien
	const cols = await tableInfo(db, 'cities');
	const exists = cols.length > 0;

	if (exists) {
		const hasCountry = cols.some(c => c.name === 'country_id');
		const hasTimezone = cols.some(c => c.name === 'timezone_id');

		if (!hasCountry || !hasTimezone) {
			// Schéma obsolète -> on recrée proprement
			await db.withTransactionAsync(async () => {
				await db.execAsync(`DROP TABLE IF EXISTS cities;`);
				await db.execAsync(`
          CREATE TABLE IF NOT EXISTS cities (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            country_id  INTEGER NOT NULL,
            timezone_id INTEGER NOT NULL,
            FOREIGN KEY(country_id)  REFERENCES countries(id),
            FOREIGN KEY(timezone_id) REFERENCES timezones(id)
          );
        `);
			});
		}
	}
}

// --- SEED
async function seedIfNeeded(db: SQLite.SQLiteDatabase) {
	// Lire correctement user_version
	const ver = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
	const userVersion = ver?.user_version ?? 0;

	// FK ON
	await db.execAsync('PRAGMA foreign_keys = ON;');

	// Schéma (idempotent)
	await db.execAsync(`
    CREATE TABLE IF NOT EXISTS timezones (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      iana TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS countries (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS cities (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      country_id  INTEGER NOT NULL,
      timezone_id INTEGER NOT NULL,
      FOREIGN KEY(country_id)  REFERENCES countries(id),
      FOREIGN KEY(timezone_id) REFERENCES timezones(id)
    );
    CREATE TABLE IF NOT EXISTS types (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS specials (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      type_id      INTEGER NOT NULL,
      default_name TEXT NOT NULL,
      country_id   INTEGER,
      city_id      INTEGER,
      FOREIGN KEY(type_id)    REFERENCES types(id),
      FOREIGN KEY(country_id) REFERENCES countries(id),
      FOREIGN KEY(city_id)    REFERENCES cities(id)
    );
    CREATE TABLE IF NOT EXISTS translations (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type     TEXT NOT NULL,
      entity_id       INTEGER NOT NULL,
      lang            TEXT NOT NULL,
      translated_name TEXT NOT NULL,
      translated_desc TEXT
    );
  `);

	// *** Migration avant d'insérer ***
	await migrateIfNeeded(db);

	// Si déjà seedé (version >=1), on sort après migration éventuelle
	if (userVersion >= 1) return;

	// Seed atomique & idempotent
	await db.withTransactionAsync(async () => {
		await db.execAsync(`
      INSERT OR IGNORE INTO timezones (iana) VALUES
        ('Europe/Paris'), ('America/New_York'), ('America/Los_Angeles'),
        ('Europe/London'), ('Europe/Berlin'), ('Asia/Tokyo'),
        ('Asia/Kolkata'), ('Australia/Sydney'), ('America/Sao_Paulo'),
        ('Africa/Johannesburg');
    `);

		await db.execAsync(`
      INSERT OR IGNORE INTO countries (name) VALUES
        ('France'), ('United States'), ('United Kingdom'), ('Germany'),
        ('Japan'), ('India'), ('Australia'), ('Brazil'), ('South Africa'), ('Canada');
    `);

		await db.execAsync(`
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

		await db.execAsync(`INSERT OR IGNORE INTO types (name) VALUES ('cocktail'), ('mocktail'), ('food');`);

		await db.execAsync('PRAGMA user_version = 1;');
	});

	// Logs
	const c1 = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM timezones;');
	const c2 = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM cities;');
	console.log('[DB] seed done. timezones:', c1?.n, 'cities:', c2?.n);
}

const initializeDatabase = async () => {
	if (db) return db;
	if (!dbReady) {
		dbReady = (async () => {
			const handle = await SQLite.openDatabaseAsync('apero.db');
			db = handle;
			await seedIfNeeded(handle);
			return handle;
		})();
	}
	return dbReady;
};

export const getCitiesWithTimezones = async (): Promise<CityWithTimezone[]> => {
	const handle = await initializeDatabase();
	const rows = await handle.getAllAsync<{ city: string; timezone: string }>(`
        SELECT c.name AS city, t.iana AS timezone
        FROM cities c
                 JOIN timezones t ON c.timezone_id = t.id
        ORDER BY c.name
    `);
	return rows.map(r => ({ name: r.city, timezone: r.timezone }));
};
