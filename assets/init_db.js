// init_db.js
const sqlite3 = require("sqlite3").verbose();

// Nom du fichier SQLite
const path = require("path");
const DB_FILE = path.join(__dirname, "apero.db");  // toujours dans assets/

// Ouvre la base (ou crée si inexistante)
let db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
	// TABLE TIMEZONES
	db.run(`
    CREATE TABLE IF NOT EXISTS timezones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      iana TEXT NOT NULL UNIQUE
    );
  `);

	// TABLE COUNTRIES
	db.run(`
    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      UNIQUE(name)
    );
  `);

	// TABLE CITIES
	db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country_id INTEGER NOT NULL,
      timezone_id INTEGER NOT NULL,
      FOREIGN KEY(country_id) REFERENCES countries(id),
      FOREIGN KEY(timezone_id) REFERENCES timezones(id)
    );
  `);

	// TABLE SPECIALS
	db.run(`
    CREATE TABLE IF NOT EXISTS specials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- cocktail, mocktail, food
      default_name TEXT NOT NULL,
      country_id INTEGER,
      city_id INTEGER,
      FOREIGN KEY(country_id) REFERENCES countries(id),
      FOREIGN KEY(city_id) REFERENCES cities(id)
    );
  `);

	// TABLE TRANSLATIONS
	db.run(`
    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL, -- country, city, special
      entity_id INTEGER NOT NULL,
      lang TEXT NOT NULL,
      translated_name TEXT NOT NULL,
      translated_desc TEXT
    );
  `);

	console.log("✅ Base de données créée : apero.db");
});

db.close();
