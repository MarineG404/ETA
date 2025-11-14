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

		// --- Seed timezones (couverture mondiale complète)
		await handle.execAsync(`
      INSERT OR IGNORE INTO timezones (iana) VALUES
        -- Europe
        ('Europe/Paris'), ('Europe/London'), ('Europe/Berlin'), ('Europe/Madrid'),
        ('Europe/Rome'), ('Europe/Athens'), ('Europe/Moscow'), ('Europe/Istanbul'),
        ('Europe/Stockholm'), ('Europe/Amsterdam'), ('Europe/Lisbon'),
        -- Amériques
        ('America/New_York'), ('America/Chicago'), ('America/Denver'), ('America/Los_Angeles'),
        ('America/Anchorage'), ('America/Mexico_City'), ('America/Toronto'), ('America/Montreal'),
        ('America/Vancouver'), ('America/Sao_Paulo'), ('America/Buenos_Aires'), ('America/Santiago'),
        ('America/Bogota'), ('America/Lima'), ('America/Caracas'), ('America/Havana'),
        -- Asie-Pacifique
        ('Asia/Tokyo'), ('Asia/Seoul'), ('Asia/Shanghai'), ('Asia/Hong_Kong'),
        ('Asia/Singapore'), ('Asia/Bangkok'), ('Asia/Jakarta'), ('Asia/Kolkata'),
        ('Asia/Dubai'), ('Asia/Tehran'), ('Asia/Karachi'), ('Asia/Manila'),
        ('Australia/Sydney'), ('Australia/Melbourne'), ('Australia/Perth'), ('Australia/Brisbane'),
        ('Pacific/Auckland'), ('Pacific/Fiji'), ('Pacific/Honolulu'), ('Pacific/Tahiti'),
        -- Afrique
        ('Africa/Johannesburg'), ('Africa/Cairo'), ('Africa/Lagos'), ('Africa/Nairobi'),
        ('Africa/Casablanca'), ('Africa/Addis_Ababa'), ('Africa/Algiers');
    `);

		// --- Seed countries (50+ pays)
		await handle.execAsync(`
      INSERT OR IGNORE INTO countries (name) VALUES
        ('France'), ('United States'), ('United Kingdom'), ('Germany'), ('Spain'),
        ('Italy'), ('Greece'), ('Russia'), ('Turkey'), ('Sweden'), ('Netherlands'), ('Portugal'),
        ('Canada'), ('Mexico'), ('Brazil'), ('Argentina'), ('Chile'), ('Colombia'), ('Peru'), ('Venezuela'), ('Cuba'),
        ('Japan'), ('South Korea'), ('China'), ('Hong Kong'), ('Singapore'), ('Thailand'),
        ('Indonesia'), ('India'), ('UAE'), ('Iran'), ('Pakistan'), ('Philippines'),
        ('Australia'), ('New Zealand'), ('Fiji'),
        ('South Africa'), ('Egypt'), ('Nigeria'), ('Kenya'), ('Morocco'), ('Ethiopia'), ('Algeria');
    `);

		// --- Seed cities (60+ villes sur tous les fuseaux horaires)
		await handle.execAsync(`
      INSERT OR IGNORE INTO cities (name, country_id, timezone_id) VALUES
        -- Europe
        ('Paris',         (SELECT id FROM countries WHERE name='France'),         (SELECT id FROM timezones WHERE iana='Europe/Paris')),
        ('Lyon',          (SELECT id FROM countries WHERE name='France'),         (SELECT id FROM timezones WHERE iana='Europe/Paris')),
        ('London',        (SELECT id FROM countries WHERE name='United Kingdom'), (SELECT id FROM timezones WHERE iana='Europe/London')),
        ('Manchester',    (SELECT id FROM countries WHERE name='United Kingdom'), (SELECT id FROM timezones WHERE iana='Europe/London')),
        ('Berlin',        (SELECT id FROM countries WHERE name='Germany'),        (SELECT id FROM timezones WHERE iana='Europe/Berlin')),
        ('Munich',        (SELECT id FROM countries WHERE name='Germany'),        (SELECT id FROM timezones WHERE iana='Europe/Berlin')),
        ('Madrid',        (SELECT id FROM countries WHERE name='Spain'),          (SELECT id FROM timezones WHERE iana='Europe/Madrid')),
        ('Barcelona',     (SELECT id FROM countries WHERE name='Spain'),          (SELECT id FROM timezones WHERE iana='Europe/Madrid')),
        ('Rome',          (SELECT id FROM countries WHERE name='Italy'),          (SELECT id FROM timezones WHERE iana='Europe/Rome')),
        ('Milan',         (SELECT id FROM countries WHERE name='Italy'),          (SELECT id FROM timezones WHERE iana='Europe/Rome')),
        ('Athens',        (SELECT id FROM countries WHERE name='Greece'),         (SELECT id FROM timezones WHERE iana='Europe/Athens')),
        ('Moscow',        (SELECT id FROM countries WHERE name='Russia'),         (SELECT id FROM timezones WHERE iana='Europe/Moscow')),
        ('Istanbul',      (SELECT id FROM countries WHERE name='Turkey'),         (SELECT id FROM timezones WHERE iana='Europe/Istanbul')),
        ('Stockholm',     (SELECT id FROM countries WHERE name='Sweden'),         (SELECT id FROM timezones WHERE iana='Europe/Stockholm')),
        ('Amsterdam',     (SELECT id FROM countries WHERE name='Netherlands'),    (SELECT id FROM timezones WHERE iana='Europe/Amsterdam')),
        ('Lisbon',        (SELECT id FROM countries WHERE name='Portugal'),       (SELECT id FROM timezones WHERE iana='Europe/Lisbon')),

        -- Amérique du Nord
        ('New York',      (SELECT id FROM countries WHERE name='United States'),  (SELECT id FROM timezones WHERE iana='America/New_York')),
        ('Chicago',       (SELECT id FROM countries WHERE name='United States'),  (SELECT id FROM timezones WHERE iana='America/Chicago')),
        ('Denver',        (SELECT id FROM countries WHERE name='United States'),  (SELECT id FROM timezones WHERE iana='America/Denver')),
        ('Los Angeles',   (SELECT id FROM countries WHERE name='United States'),  (SELECT id FROM timezones WHERE iana='America/Los_Angeles')),
        ('Anchorage',     (SELECT id FROM countries WHERE name='United States'),  (SELECT id FROM timezones WHERE iana='America/Anchorage')),
        ('Toronto',       (SELECT id FROM countries WHERE name='Canada'),         (SELECT id FROM timezones WHERE iana='America/Toronto')),
        ('Montreal',      (SELECT id FROM countries WHERE name='Canada'),         (SELECT id FROM timezones WHERE iana='America/Montreal')),
        ('Vancouver',     (SELECT id FROM countries WHERE name='Canada'),         (SELECT id FROM timezones WHERE iana='America/Vancouver')),
        ('Mexico City',   (SELECT id FROM countries WHERE name='Mexico'),         (SELECT id FROM timezones WHERE iana='America/Mexico_City')),
        ('Havana',        (SELECT id FROM countries WHERE name='Cuba'),           (SELECT id FROM timezones WHERE iana='America/Havana')),

        -- Amérique du Sud
        ('São Paulo',     (SELECT id FROM countries WHERE name='Brazil'),         (SELECT id FROM timezones WHERE iana='America/Sao_Paulo')),
        ('Rio de Janeiro',(SELECT id FROM countries WHERE name='Brazil'),         (SELECT id FROM timezones WHERE iana='America/Sao_Paulo')),
        ('Buenos Aires',  (SELECT id FROM countries WHERE name='Argentina'),      (SELECT id FROM timezones WHERE iana='America/Buenos_Aires')),
        ('Santiago',      (SELECT id FROM countries WHERE name='Chile'),          (SELECT id FROM timezones WHERE iana='America/Santiago')),
        ('Bogotá',        (SELECT id FROM countries WHERE name='Colombia'),       (SELECT id FROM timezones WHERE iana='America/Bogota')),
        ('Lima',          (SELECT id FROM countries WHERE name='Peru'),           (SELECT id FROM timezones WHERE iana='America/Lima')),
        ('Caracas',       (SELECT id FROM countries WHERE name='Venezuela'),      (SELECT id FROM timezones WHERE iana='America/Caracas')),

        -- Asie
        ('Tokyo',         (SELECT id FROM countries WHERE name='Japan'),          (SELECT id FROM timezones WHERE iana='Asia/Tokyo')),
        ('Osaka',         (SELECT id FROM countries WHERE name='Japan'),          (SELECT id FROM timezones WHERE iana='Asia/Tokyo')),
        ('Seoul',         (SELECT id from countries where name='South Korea'),    (SELECT id FROM timezones WHERE iana='Asia/Seoul')),
        ('Shanghai',      (SELECT id FROM countries WHERE name='China'),          (SELECT id FROM timezones WHERE iana='Asia/Shanghai')),
        ('Beijing',       (SELECT id FROM countries WHERE name='China'),          (SELECT id FROM timezones WHERE iana='Asia/Shanghai')),
        ('Hong Kong',     (SELECT id FROM countries WHERE name='Hong Kong'),      (SELECT id FROM timezones WHERE iana='Asia/Hong_Kong')),
        ('Singapore',     (SELECT id FROM countries WHERE name='Singapore'),      (SELECT id FROM timezones WHERE iana='Asia/Singapore')),
        ('Bangkok',       (SELECT id FROM countries WHERE name='Thailand'),       (SELECT id FROM timezones WHERE iana='Asia/Bangkok')),
        ('Jakarta',       (SELECT id FROM countries WHERE name='Indonesia'),      (SELECT id FROM timezones WHERE iana='Asia/Jakarta')),
        ('Mumbai',        (SELECT id FROM countries WHERE name='India'),          (SELECT id FROM timezones WHERE iana='Asia/Kolkata')),
        ('Delhi',         (SELECT id FROM countries WHERE name='India'),          (SELECT id FROM timezones WHERE iana='Asia/Kolkata')),
        ('Dubai',         (SELECT id FROM countries WHERE name='UAE'),            (SELECT id FROM timezones WHERE iana='Asia/Dubai')),
        ('Tehran',        (SELECT id FROM countries WHERE name='Iran'),           (SELECT id FROM timezones WHERE iana='Asia/Tehran')),
        ('Karachi',       (SELECT id FROM countries WHERE name='Pakistan'),       (SELECT id FROM timezones WHERE iana='Asia/Karachi')),
        ('Manila',        (SELECT id FROM countries WHERE name='Philippines'),    (SELECT id FROM timezones WHERE iana='Asia/Manila')),

        -- Océanie
        ('Sydney',        (SELECT id FROM countries WHERE name='Australia'),      (SELECT id FROM timezones WHERE iana='Australia/Sydney')),
        ('Melbourne',     (SELECT id FROM countries WHERE name='Australia'),      (SELECT id FROM timezones WHERE iana='Australia/Melbourne')),
        ('Perth',         (SELECT id FROM countries WHERE name='Australia'),      (SELECT id FROM timezones WHERE iana='Australia/Perth')),
        ('Brisbane',      (SELECT id FROM countries WHERE name='Australia'),      (SELECT id FROM timezones WHERE iana='Australia/Brisbane')),
        ('Auckland',      (SELECT id FROM countries WHERE name='New Zealand'),    (SELECT id FROM timezones WHERE iana='Pacific/Auckland')),
        ('Suva',          (SELECT id FROM countries WHERE name='Fiji'),           (SELECT id FROM timezones WHERE iana='Pacific/Fiji')),

        -- Afrique
        ('Johannesburg',  (SELECT id FROM countries WHERE name='South Africa'),   (SELECT id FROM timezones WHERE iana='Africa/Johannesburg')),
        ('Cape Town',     (SELECT id FROM countries WHERE name='South Africa'),   (SELECT id FROM timezones WHERE iana='Africa/Johannesburg')),
        ('Cairo',         (SELECT id FROM countries WHERE name='Egypt'),          (SELECT id FROM timezones WHERE iana='Africa/Cairo')),
        ('Lagos',         (SELECT id FROM countries WHERE name='Nigeria'),        (SELECT id FROM timezones WHERE iana='Africa/Lagos')),
        ('Nairobi',       (SELECT id FROM countries WHERE name='Kenya'),          (SELECT id FROM timezones WHERE iana='Africa/Nairobi')),
        ('Casablanca',    (SELECT id FROM countries WHERE name='Morocco'),        (SELECT id FROM timezones WHERE iana='Africa/Casablanca')),
        ('Addis Ababa',   (SELECT id FROM countries WHERE name='Ethiopia'),       (SELECT id FROM timezones WHERE iana='Africa/Addis_Ababa')),
        ('Algiers',       (SELECT id FROM countries WHERE name='Algeria'),        (SELECT id FROM timezones WHERE iana='Africa/Algiers'));
    `);

		// --- Seed types
		await handle.execAsync(`INSERT OR IGNORE INTO types (name) VALUES ('cocktail'), ('mocktail'), ('food');`);

		// --- Seed specials (spécialités pour TOUS les 42 pays)
		await handle.execAsync(`
      INSERT OR IGNORE INTO specials (type_id, default_name, country_id, city_id) VALUES
      -- France 🇫🇷
      ((SELECT id FROM types WHERE name='cocktail'), 'French 75', (SELECT id FROM countries WHERE name='France'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Virgin Mojito', (SELECT id FROM countries WHERE name='France'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Croissant', (SELECT id FROM countries WHERE name='France'), NULL),

      -- United States 🇺🇸
      ((SELECT id FROM types WHERE name='cocktail'), 'Old Fashioned', (SELECT id FROM countries WHERE name='United States'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Shirley Temple', (SELECT id FROM countries WHERE name='United States'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Burger', (SELECT id FROM countries WHERE name='United States'), NULL),

      -- United Kingdom 🇬🇧
      ((SELECT id FROM types WHERE name='cocktail'), 'Pimm''s Cup', (SELECT id FROM countries WHERE name='United Kingdom'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Elderflower Fizz', (SELECT id FROM countries WHERE name='United Kingdom'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Fish and Chips', (SELECT id FROM countries WHERE name='United Kingdom'), NULL),

      -- Germany 🇩🇪
      ((SELECT id FROM types WHERE name='cocktail'), 'Berliner Weisse', (SELECT id FROM countries WHERE name='Germany'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Apfelschorle', (SELECT id FROM countries WHERE name='Germany'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Bratwurst', (SELECT id FROM countries WHERE name='Germany'), NULL),

      -- Spain 🇪🇸
      ((SELECT id FROM types WHERE name='cocktail'), 'Sangria', (SELECT id FROM countries WHERE name='Spain'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Horchata', (SELECT id FROM countries WHERE name='Spain'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Tapas', (SELECT id FROM countries WHERE name='Spain'), NULL),

      -- Italy 🇮🇹
      ((SELECT id FROM types WHERE name='cocktail'), 'Aperol Spritz', (SELECT id FROM countries WHERE name='Italy'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Sanbittèr', (SELECT id FROM countries WHERE name='Italy'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Pizza Margherita', (SELECT id FROM countries WHERE name='Italy'), NULL),

      -- Greece 🇬🇷
      ((SELECT id FROM types WHERE name='cocktail'), 'Ouzo', (SELECT id FROM countries WHERE name='Greece'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Greek Lemonade', (SELECT id FROM countries WHERE name='Greece'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Souvlaki', (SELECT id FROM countries WHERE name='Greece'), NULL),

      -- Russia 🇷🇺
      ((SELECT id FROM types WHERE name='cocktail'), 'Moscow Mule', (SELECT id FROM countries WHERE name='Russia'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Kvass', (SELECT id FROM countries WHERE name='Russia'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Blini', (SELECT id FROM countries WHERE name='Russia'), NULL),

      -- Turkey 🇹🇷
      ((SELECT id FROM types WHERE name='cocktail'), 'Raki', (SELECT id FROM countries WHERE name='Turkey'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Ayran', (SELECT id FROM countries WHERE name='Turkey'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Kebab', (SELECT id FROM countries WHERE name='Turkey'), NULL),

      -- Sweden 🇸🇪
      ((SELECT id FROM types WHERE name='cocktail'), 'Swedish Punsch', (SELECT id FROM countries WHERE name='Sweden'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Lingonberry Spritz', (SELECT id FROM countries WHERE name='Sweden'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Meatballs', (SELECT id FROM countries WHERE name='Sweden'), NULL),

      -- Netherlands 🇳🇱
      ((SELECT id FROM types WHERE name='cocktail'), 'Jenever Cocktail', (SELECT id FROM countries WHERE name='Netherlands'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Chocomel', (SELECT id FROM countries WHERE name='Netherlands'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Stroopwafel', (SELECT id FROM countries WHERE name='Netherlands'), NULL),

      -- Portugal 🇵🇹
      ((SELECT id FROM types WHERE name='cocktail'), 'Port Tonic', (SELECT id FROM countries WHERE name='Portugal'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Sumol', (SELECT id FROM countries WHERE name='Portugal'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Pastel de Nata', (SELECT id FROM countries WHERE name='Portugal'), NULL),

      -- Japan 🇯🇵
      ((SELECT id FROM types WHERE name='cocktail'), 'Sake Martini', (SELECT id FROM countries WHERE name='Japan'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Matcha Fizz', (SELECT id FROM countries WHERE name='Japan'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Sushi', (SELECT id FROM countries WHERE name='Japan'), NULL),

      -- South Korea 🇰🇷
      ((SELECT id FROM types WHERE name='cocktail'), 'Soju Bomb', (SELECT id FROM countries WHERE name='South Korea'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Sikhye', (SELECT id FROM countries WHERE name='South Korea'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Korean Fried Chicken', (SELECT id FROM countries WHERE name='South Korea'), NULL),

      -- China 🇨🇳
      ((SELECT id FROM types WHERE name='cocktail'), 'Baijiu Martini', (SELECT id FROM countries WHERE name='China'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Plum Juice', (SELECT id FROM countries WHERE name='China'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Dim Sum', (SELECT id FROM countries WHERE name='China'), NULL),

      -- Hong Kong 🇭🇰
      ((SELECT id FROM types WHERE name='cocktail'), 'Hong Kong Sling', (SELECT id FROM countries WHERE name='Hong Kong'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Lemon Tea', (SELECT id FROM countries WHERE name='Hong Kong'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Egg Tart', (SELECT id FROM countries WHERE name='Hong Kong'), NULL),

      -- Singapore 🇸🇬
      ((SELECT id FROM types WHERE name='cocktail'), 'Singapore Sling', (SELECT id FROM countries WHERE name='Singapore'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Bandung', (SELECT id FROM countries WHERE name='Singapore'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Chili Crab', (SELECT id FROM countries WHERE name='Singapore'), NULL),

      -- Thailand 🇹🇭
      ((SELECT id FROM types WHERE name='cocktail'), 'Thai Basil Smash', (SELECT id FROM countries WHERE name='Thailand'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Thai Iced Tea', (SELECT id FROM countries WHERE name='Thailand'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Pad Thai', (SELECT id FROM countries WHERE name='Thailand'), NULL),

      -- Indonesia 🇮🇩
      ((SELECT id FROM types WHERE name='cocktail'), 'Arak Attack', (SELECT id FROM countries WHERE name='Indonesia'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Es Kelapa Muda', (SELECT id FROM countries WHERE name='Indonesia'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Nasi Goreng', (SELECT id FROM countries WHERE name='Indonesia'), NULL),

      -- India 🇮🇳
      ((SELECT id FROM types WHERE name='cocktail'), 'Mango Margarita', (SELECT id FROM countries WHERE name='India'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Lassi', (SELECT id FROM countries WHERE name='India'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Samosa', (SELECT id FROM countries WHERE name='India'), NULL),

      -- UAE 🇦🇪
      ((SELECT id FROM types WHERE name='cocktail'), 'Arabic Coffee Martini', (SELECT id FROM countries WHERE name='UAE'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Jallab', (SELECT id FROM countries WHERE name='UAE'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Shawarma', (SELECT id FROM countries WHERE name='UAE'), NULL),

      -- Iran 🇮🇷
      ((SELECT id FROM types WHERE name='cocktail'), 'Persian Pomegranate Fizz', (SELECT id FROM countries WHERE name='Iran'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Doogh', (SELECT id FROM countries WHERE name='Iran'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Kebab Koobideh', (SELECT id FROM countries WHERE name='Iran'), NULL),

      -- Pakistan 🇵🇰
      ((SELECT id FROM types WHERE name='cocktail'), 'Karachi Collins', (SELECT id FROM countries WHERE name='Pakistan'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Rooh Afza', (SELECT id FROM countries WHERE name='Pakistan'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Biryani', (SELECT id FROM countries WHERE name='Pakistan'), NULL),

      -- Philippines 🇵🇭
      ((SELECT id FROM types WHERE name='cocktail'), 'Manila Sunset', (SELECT id FROM countries WHERE name='Philippines'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Calamansi Juice', (SELECT id FROM countries WHERE name='Philippines'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Adobo', (SELECT id FROM countries WHERE name='Philippines'), NULL),

      -- Australia 🇦🇺
      ((SELECT id FROM types WHERE name='cocktail'), 'Sydney Sling', (SELECT id FROM countries WHERE name='Australia'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Lemon Lime Bitters', (SELECT id FROM countries WHERE name='Australia'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Meat Pie', (SELECT id FROM countries WHERE name='Australia'), NULL),

      -- New Zealand 🇳🇿
      ((SELECT id FROM types WHERE name='cocktail'), 'Kiwi Martini', (SELECT id FROM countries WHERE name='New Zealand'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'L&P Soda', (SELECT id FROM countries WHERE name='New Zealand'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Pavlova', (SELECT id FROM countries WHERE name='New Zealand'), NULL),

      -- Fiji 🇫🇯
      ((SELECT id FROM types WHERE name='cocktail'), 'Fiji Sunset', (SELECT id FROM countries WHERE name='Fiji'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Coconut Water', (SELECT id FROM countries WHERE name='Fiji'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Kokoda', (SELECT id FROM countries WHERE name='Fiji'), NULL),

      -- Canada 🇨🇦
      ((SELECT id FROM types WHERE name='cocktail'), 'Caesar', (SELECT id FROM countries WHERE name='Canada'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Maple Lemonade', (SELECT id FROM countries WHERE name='Canada'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Poutine', (SELECT id FROM countries WHERE name='Canada'), NULL),

      -- Mexico 🇲🇽
      ((SELECT id FROM types WHERE name='cocktail'), 'Margarita', (SELECT id FROM countries WHERE name='Mexico'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Agua de Jamaica', (SELECT id FROM countries WHERE name='Mexico'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Tacos', (SELECT id FROM countries WHERE name='Mexico'), NULL),

      -- Brazil 🇧🇷
      ((SELECT id FROM types WHERE name='cocktail'), 'Caipirinha', (SELECT id FROM countries WHERE name='Brazil'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Guaraná', (SELECT id FROM countries WHERE name='Brazil'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Feijoada', (SELECT id FROM countries WHERE name='Brazil'), NULL),

      -- Argentina 🇦🇷
      ((SELECT id FROM types WHERE name='cocktail'), 'Fernet con Cola', (SELECT id FROM countries WHERE name='Argentina'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Mate Cocido', (SELECT id FROM countries WHERE name='Argentina'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Empanadas', (SELECT id FROM countries WHERE name='Argentina'), NULL),

      -- Chile 🇨🇱
      ((SELECT id FROM types WHERE name='cocktail'), 'Pisco Sour', (SELECT id FROM countries WHERE name='Chile'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Mote con Huesillo', (SELECT id FROM countries WHERE name='Chile'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Completo', (SELECT id FROM countries WHERE name='Chile'), NULL),

      -- Colombia 🇨🇴
      ((SELECT id FROM types WHERE name='cocktail'), 'Aguardiente', (SELECT id FROM countries WHERE name='Colombia'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Lulada', (SELECT id FROM countries WHERE name='Colombia'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Arepa', (SELECT id FROM countries WHERE name='Colombia'), NULL),

      -- Peru 🇵🇪
      ((SELECT id FROM types WHERE name='cocktail'), 'Chilcano', (SELECT id FROM countries WHERE name='Peru'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Chicha Morada', (SELECT id FROM countries WHERE name='Peru'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Ceviche', (SELECT id FROM countries WHERE name='Peru'), NULL),

      -- Venezuela 🇻🇪
      ((SELECT id FROM types WHERE name='cocktail'), 'Ponche Crema', (SELECT id FROM countries WHERE name='Venezuela'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Papelón con Limón', (SELECT id FROM countries WHERE name='Venezuela'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Arepa', (SELECT id FROM countries WHERE name='Venezuela'), NULL),

      -- Cuba 🇨🇺
      ((SELECT id FROM types WHERE name='cocktail'), 'Mojito', (SELECT id FROM countries WHERE name='Cuba'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Guarapo', (SELECT id FROM countries WHERE name='Cuba'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Ropa Vieja', (SELECT id FROM countries WHERE name='Cuba'), NULL),

      -- South Africa 🇿🇦
      ((SELECT id FROM types WHERE name='cocktail'), 'Springbokkie', (SELECT id FROM countries WHERE name='South Africa'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Rooibos Iced Tea', (SELECT id FROM countries WHERE name='South Africa'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Biltong', (SELECT id FROM countries WHERE name='South Africa'), NULL),

      -- Egypt 🇪🇬
      ((SELECT id FROM types WHERE name='cocktail'), 'Egyptian Sunset', (SELECT id FROM countries WHERE name='Egypt'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Karkadeh', (SELECT id FROM countries WHERE name='Egypt'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Koshari', (SELECT id FROM countries WHERE name='Egypt'), NULL),

      -- Nigeria 🇳🇬
      ((SELECT id FROM types WHERE name='cocktail'), 'Chapman', (SELECT id FROM countries WHERE name='Nigeria'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Zobo', (SELECT id FROM countries WHERE name='Nigeria'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Jollof Rice', (SELECT id FROM countries WHERE name='Nigeria'), NULL),

      -- Kenya 🇰🇪
      ((SELECT id FROM types WHERE name='cocktail'), 'Dawa', (SELECT id FROM countries WHERE name='Kenya'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Tangawizi', (SELECT id FROM countries WHERE name='Kenya'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Nyama Choma', (SELECT id FROM countries WHERE name='Kenya'), NULL),

      -- Morocco 🇲🇦
      ((SELECT id FROM types WHERE name='cocktail'), 'Moroccan Mint Mojito', (SELECT id FROM countries WHERE name='Morocco'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Mint Tea', (SELECT id FROM countries WHERE name='Morocco'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Tagine', (SELECT id FROM countries WHERE name='Morocco'), NULL),

      -- Ethiopia 🇪🇹
      ((SELECT id FROM types WHERE name='cocktail'), 'Tej', (SELECT id FROM countries WHERE name='Ethiopia'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Spris', (SELECT id FROM countries WHERE name='Ethiopia'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Injera', (SELECT id FROM countries WHERE name='Ethiopia'), NULL),

      -- Algeria 🇩🇿
      ((SELECT id FROM types WHERE name='cocktail'), 'Algerian Sunset', (SELECT id FROM countries WHERE name='Algeria'), NULL),
      ((SELECT id FROM types WHERE name='mocktail'), 'Sharbat', (SELECT id FROM countries WHERE name='Algeria'), NULL),
      ((SELECT id FROM types WHERE name='food'), 'Couscous', (SELECT id FROM countries WHERE name='Algeria'), NULL);
    `);
	});

	console.log('[DB] ✅ Re-seeding terminé - 60+ villes, 42 pays, 126 spécialités !');
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

	return Object.values(cityMap);
};
