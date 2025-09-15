-- ==============================
-- FULL SEED SCHEMA + DATA FOR APERO.DB
-- ==============================
-- TABLE TIMEZONES
CREATE TABLE IF NOT EXISTS timezones (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	iana TEXT NOT NULL UNIQUE
);

-- TABLE COUNTRIES
CREATE TABLE IF NOT EXISTS countries (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	UNIQUE(name)
);

-- TABLE CITIES
CREATE TABLE IF NOT EXISTS cities (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	country_id INTEGER NOT NULL,
	timezone_id INTEGER NOT NULL,
	FOREIGN KEY(country_id) REFERENCES countries(id),
	FOREIGN KEY(timezone_id) REFERENCES timezones(id)
);

-- TABLE TYPES (cocktail, mocktail, food)
CREATE TABLE IF NOT EXISTS types (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE
);

-- TABLE SPECIALS
CREATE TABLE IF NOT EXISTS specials (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	type_id INTEGER NOT NULL,
	default_name TEXT NOT NULL,
	country_id INTEGER,
	city_id INTEGER,
	FOREIGN KEY(type_id) REFERENCES types(id),
	FOREIGN KEY(country_id) REFERENCES countries(id),
	FOREIGN KEY(city_id) REFERENCES cities(id)
);

-- TABLE TRANSLATIONS
CREATE TABLE IF NOT EXISTS translations (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	entity_type TEXT NOT NULL,
	-- country, city, special
	entity_id INTEGER NOT NULL,
	lang TEXT NOT NULL,
	translated_name TEXT NOT NULL,
	translated_desc TEXT
);

-- ==============================
-- DATA
-- ==============================
-- TIMEZONES
INSERT INTO
	timezones (iana)
VALUES
	('Europe/Paris'),
	('America/New_York'),
	('America/Los_Angeles'),
	('Europe/London'),
	('Europe/Berlin'),
	('Asia/Tokyo'),
	('Asia/Kolkata'),
	('Australia/Sydney'),
	('America/Sao_Paulo'),
	('Africa/Johannesburg');

-- COUNTRIES
INSERT INTO
	countries (name)
VALUES
	('France'),
	('United States'),
	('United Kingdom'),
	('Germany'),
	('Japan'),
	('India'),
	('Australia'),
	('Brazil'),
	('South Africa'),
	('Canada');

-- CITIES
INSERT INTO
	cities (name, country_id, timezone_id)
VALUES
	(
		'Paris',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'France'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Europe/Paris'
		)
	),
	(
		'Lyon',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'France'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Europe/Paris'
		)
	),
	(
		'New York',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United States'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'America/New_York'
		)
	),
	(
		'Los Angeles',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United States'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'America/Los_Angeles'
		)
	),
	(
		'London',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United Kingdom'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Europe/London'
		)
	),
	(
		'Manchester',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United Kingdom'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Europe/London'
		)
	),
	(
		'Berlin',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Germany'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Europe/Berlin'
		)
	),
	(
		'Tokyo',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Japan'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Asia/Tokyo'
		)
	),
	(
		'Osaka',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Japan'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Asia/Tokyo'
		)
	),
	(
		'Mumbai',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'India'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Asia/Kolkata'
		)
	),
	(
		'Delhi',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'India'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Asia/Kolkata'
		)
	),
	(
		'Sydney',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Australia'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Australia/Sydney'
		)
	),
	(
		'São Paulo',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Brazil'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'America/Sao_Paulo'
		)
	),
	(
		'Rio de Janeiro',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Brazil'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'America/Sao_Paulo'
		)
	),
	(
		'Johannesburg',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'South Africa'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Africa/Johannesburg'
		)
	),
	(
		'Cape Town',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'South Africa'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'Africa/Johannesburg'
		)
	),
	(
		'Toronto',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Canada'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'America/New_York'
		)
	),
	(
		'Montreal',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Canada'
		),
		(
			SELECT
				id
			FROM
				timezones
			WHERE
				iana = 'America/New_York'
		)
	);

-- TYPES
INSERT INTO
	types (name)
VALUES
	('cocktail'),
	('mocktail'),
	('food');

-- SPECIALS
INSERT INTO
	specials (type_id, default_name, country_id, city_id)
VALUES
	-- France
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'French 75',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'France'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Virgin Mojito',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'France'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Croissant',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'France'
		),
		NULL
	),
	-- United States
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Old Fashioned',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United States'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Shirley Temple',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United States'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Burger',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United States'
		),
		NULL
	),
	-- United Kingdom
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Pimm''s Cup',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United Kingdom'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Elderflower Fizz',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United Kingdom'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Fish and Chips',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'United Kingdom'
		),
		NULL
	),
	-- Germany
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Berliner Weisse',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Germany'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Apfelschorle',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Germany'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Bratwurst',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Germany'
		),
		NULL
	),
	-- Japan
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Tokyo Tea',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Japan'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Matcha Fizz',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Japan'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Sushi',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Japan'
		),
		NULL
	),
	-- India
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Mango Margarita',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'India'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Lassi',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'India'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Samosa',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'India'
		),
		NULL
	),
	-- Australia
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Sydney Sling',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Australia'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Lemon Lime Bitters',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Australia'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Meat Pie',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Australia'
		),
		NULL
	),
	-- Brazil
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Caipirinha',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Brazil'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Guaraná',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Brazil'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Feijoada',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Brazil'
		),
		NULL
	),
	-- South Africa
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Springbokkie',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'South Africa'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Rooibos Iced Tea',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'South Africa'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Biltong',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'South Africa'
		),
		NULL
	),
	-- Canada
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'cocktail'
		),
		'Caesar',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Canada'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'mocktail'
		),
		'Maple Lemonade',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Canada'
		),
		NULL
	),
	(
		(
			SELECT
				id
			FROM
				types
			WHERE
				name = 'food'
		),
		'Poutine',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Canada'
		),
		NULL
	);

-- TRANSLATIONS (FR + EN)
INSERT INTO
	translations (
		entity_type,
		entity_id,
		lang,
		translated_name,
		translated_desc
	)
VALUES
	-- France
	(
		'country',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'France'
		),
		'fr',
		'France',
		'Un pays en Europe'
	),
	(
		'country',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'France'
		),
		'en',
		'France',
		'A country in Europe'
	),
	(
		'city',
		(
			SELECT
				id
			FROM
				cities
			WHERE
				name = 'Paris'
		),
		'fr',
		'Paris',
		'Capitale de la France'
	),
	(
		'city',
		(
			SELECT
				id
			FROM
				cities
			WHERE
				name = 'Paris'
		),
		'en',
		'Paris',
		'Capital of France'
	),
	(
		'special',
		(
			SELECT
				id
			FROM
				specials
			WHERE
				default_name = 'French 75'
		),
		'fr',
		'French 75',
		'Cocktail français au champagne et gin'
	),
	(
		'special',
		(
			SELECT
				id
			FROM
				specials
			WHERE
				default_name = 'French 75'
		),
		'en',
		'French 75',
		'French cocktail with champagne and gin'
	),
	-- Japan
	(
		'country',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Japan'
		),
		'fr',
		'Japon',
		'Un pays insulaire en Asie'
	),
	(
		'country',
		(
			SELECT
				id
			FROM
				countries
			WHERE
				name = 'Japan'
		),
		'en',
		'Japan',
		'An island country in Asia'
	),
	(
		'city',
		(
			SELECT
				id
			FROM
				cities
			WHERE
				name = 'Tokyo'
		),
		'fr',
		'Tokyo',
		'Capitale du Japon'
	),
	(
		'city',
		(
			SELECT
				id
			FROM
				cities
			WHERE
				name = 'Tokyo'
		),
		'en',
		'Tokyo',
		'Capital of Japan'
	),
	(
		'special',
		(
			SELECT
				id
			FROM
				specials
			WHERE
				default_name = 'Sushi'
		),
		'fr',
		'Sushi',
		'Poisson cru avec riz vinaigré'
	),
	(
		'special',
		(
			SELECT
				id
			FROM
				specials
			WHERE
				default_name = 'Sushi'
		),
		'en',
		'Sushi',
		'Raw fish with vinegared rice'
	);
