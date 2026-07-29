// Données statiques : villes, fuseaux horaires et spécialités par pays.
// Générées une fois depuis l'ancien seed SQLite (voir git history) — ces données
// ne changent jamais à l'exécution, donc pas besoin d'une base de données.
import { CityData } from '@/types/city';

export const CITIES: CityData[] = [
	{
		city: "Addis Ababa",
		country: "Ethiopia",
		timezone: "Africa/Addis_Ababa",
		specials: [
			{
				type: "cocktail",
				name: "Tej"
			},
			{
				type: "mocktail",
				name: "Spris"
			},
			{
				type: "food",
				name: "Injera"
			}
		]
	},
	{
		city: "Algiers",
		country: "Algeria",
		timezone: "Africa/Algiers",
		specials: [
			{
				type: "cocktail",
				name: "Algerian Sunset"
			},
			{
				type: "mocktail",
				name: "Sharbat"
			},
			{
				type: "food",
				name: "Couscous"
			}
		]
	},
	{
		city: "Amsterdam",
		country: "Netherlands",
		timezone: "Europe/Amsterdam",
		specials: [
			{
				type: "cocktail",
				name: "Jenever Cocktail"
			},
			{
				type: "mocktail",
				name: "Chocomel"
			},
			{
				type: "food",
				name: "Stroopwafel"
			}
		]
	},
	{
		city: "Anchorage",
		country: "United States",
		timezone: "America/Anchorage",
		specials: [
			{
				type: "cocktail",
				name: "Old Fashioned"
			},
			{
				type: "mocktail",
				name: "Shirley Temple"
			},
			{
				type: "food",
				name: "Burger"
			}
		]
	},
	{
		city: "Athens",
		country: "Greece",
		timezone: "Europe/Athens",
		specials: [
			{
				type: "cocktail",
				name: "Ouzo"
			},
			{
				type: "mocktail",
				name: "Greek Lemonade"
			},
			{
				type: "food",
				name: "Souvlaki"
			}
		]
	},
	{
		city: "Auckland",
		country: "New Zealand",
		timezone: "Pacific/Auckland",
		specials: [
			{
				type: "cocktail",
				name: "Kiwi Martini"
			},
			{
				type: "mocktail",
				name: "L&P Soda"
			},
			{
				type: "food",
				name: "Pavlova"
			}
		]
	},
	{
		city: "Bangkok",
		country: "Thailand",
		timezone: "Asia/Bangkok",
		specials: [
			{
				type: "cocktail",
				name: "Thai Basil Smash"
			},
			{
				type: "mocktail",
				name: "Thai Iced Tea"
			},
			{
				type: "food",
				name: "Pad Thai"
			}
		]
	},
	{
		city: "Barcelona",
		country: "Spain",
		timezone: "Europe/Madrid",
		specials: [
			{
				type: "cocktail",
				name: "Sangria"
			},
			{
				type: "mocktail",
				name: "Horchata"
			},
			{
				type: "food",
				name: "Tapas"
			}
		]
	},
	{
		city: "Beijing",
		country: "China",
		timezone: "Asia/Shanghai",
		specials: [
			{
				type: "cocktail",
				name: "Baijiu Martini"
			},
			{
				type: "mocktail",
				name: "Plum Juice"
			},
			{
				type: "food",
				name: "Dim Sum"
			}
		]
	},
	{
		city: "Berlin",
		country: "Germany",
		timezone: "Europe/Berlin",
		specials: [
			{
				type: "cocktail",
				name: "Berliner Weisse"
			},
			{
				type: "mocktail",
				name: "Apfelschorle"
			},
			{
				type: "food",
				name: "Bratwurst"
			}
		]
	},
	{
		city: "Bogotá",
		country: "Colombia",
		timezone: "America/Bogota",
		specials: [
			{
				type: "cocktail",
				name: "Aguardiente"
			},
			{
				type: "mocktail",
				name: "Lulada"
			},
			{
				type: "food",
				name: "Arepa"
			}
		]
	},
	{
		city: "Brisbane",
		country: "Australia",
		timezone: "Australia/Brisbane",
		specials: [
			{
				type: "cocktail",
				name: "Sydney Sling"
			},
			{
				type: "mocktail",
				name: "Lemon Lime Bitters"
			},
			{
				type: "food",
				name: "Meat Pie"
			}
		]
	},
	{
		city: "Buenos Aires",
		country: "Argentina",
		timezone: "America/Buenos_Aires",
		specials: [
			{
				type: "cocktail",
				name: "Fernet con Cola"
			},
			{
				type: "mocktail",
				name: "Mate Cocido"
			},
			{
				type: "food",
				name: "Empanadas"
			}
		]
	},
	{
		city: "Cairo",
		country: "Egypt",
		timezone: "Africa/Cairo",
		specials: [
			{
				type: "cocktail",
				name: "Egyptian Sunset"
			},
			{
				type: "mocktail",
				name: "Karkadeh"
			},
			{
				type: "food",
				name: "Koshari"
			}
		]
	},
	{
		city: "Cape Town",
		country: "South Africa",
		timezone: "Africa/Johannesburg",
		specials: [
			{
				type: "cocktail",
				name: "Springbokkie"
			},
			{
				type: "mocktail",
				name: "Rooibos Iced Tea"
			},
			{
				type: "food",
				name: "Biltong"
			}
		]
	},
	{
		city: "Caracas",
		country: "Venezuela",
		timezone: "America/Caracas",
		specials: [
			{
				type: "cocktail",
				name: "Ponche Crema"
			},
			{
				type: "mocktail",
				name: "Papelón con Limón"
			},
			{
				type: "food",
				name: "Arepa"
			}
		]
	},
	{
		city: "Casablanca",
		country: "Morocco",
		timezone: "Africa/Casablanca",
		specials: [
			{
				type: "cocktail",
				name: "Moroccan Mint Mojito"
			},
			{
				type: "mocktail",
				name: "Mint Tea"
			},
			{
				type: "food",
				name: "Tagine"
			}
		]
	},
	{
		city: "Chicago",
		country: "United States",
		timezone: "America/Chicago",
		specials: [
			{
				type: "cocktail",
				name: "Old Fashioned"
			},
			{
				type: "mocktail",
				name: "Shirley Temple"
			},
			{
				type: "food",
				name: "Burger"
			}
		]
	},
	{
		city: "Delhi",
		country: "India",
		timezone: "Asia/Kolkata",
		specials: [
			{
				type: "cocktail",
				name: "Mango Margarita"
			},
			{
				type: "mocktail",
				name: "Lassi"
			},
			{
				type: "food",
				name: "Samosa"
			}
		]
	},
	{
		city: "Denver",
		country: "United States",
		timezone: "America/Denver",
		specials: [
			{
				type: "cocktail",
				name: "Old Fashioned"
			},
			{
				type: "mocktail",
				name: "Shirley Temple"
			},
			{
				type: "food",
				name: "Burger"
			}
		]
	},
	{
		city: "Dubai",
		country: "UAE",
		timezone: "Asia/Dubai",
		specials: [
			{
				type: "cocktail",
				name: "Arabic Coffee Martini"
			},
			{
				type: "mocktail",
				name: "Jallab"
			},
			{
				type: "food",
				name: "Shawarma"
			}
		]
	},
	{
		city: "Havana",
		country: "Cuba",
		timezone: "America/Havana",
		specials: [
			{
				type: "cocktail",
				name: "Mojito"
			},
			{
				type: "mocktail",
				name: "Guarapo"
			},
			{
				type: "food",
				name: "Ropa Vieja"
			}
		]
	},
	{
		city: "Hong Kong",
		country: "Hong Kong",
		timezone: "Asia/Hong_Kong",
		specials: [
			{
				type: "cocktail",
				name: "Hong Kong Sling"
			},
			{
				type: "mocktail",
				name: "Lemon Tea"
			},
			{
				type: "food",
				name: "Egg Tart"
			}
		]
	},
	{
		city: "Istanbul",
		country: "Turkey",
		timezone: "Europe/Istanbul",
		specials: [
			{
				type: "cocktail",
				name: "Raki"
			},
			{
				type: "mocktail",
				name: "Ayran"
			},
			{
				type: "food",
				name: "Kebab"
			}
		]
	},
	{
		city: "Jakarta",
		country: "Indonesia",
		timezone: "Asia/Jakarta",
		specials: [
			{
				type: "cocktail",
				name: "Arak Attack"
			},
			{
				type: "mocktail",
				name: "Es Kelapa Muda"
			},
			{
				type: "food",
				name: "Nasi Goreng"
			}
		]
	},
	{
		city: "Johannesburg",
		country: "South Africa",
		timezone: "Africa/Johannesburg",
		specials: [
			{
				type: "cocktail",
				name: "Springbokkie"
			},
			{
				type: "mocktail",
				name: "Rooibos Iced Tea"
			},
			{
				type: "food",
				name: "Biltong"
			}
		]
	},
	{
		city: "Karachi",
		country: "Pakistan",
		timezone: "Asia/Karachi",
		specials: [
			{
				type: "cocktail",
				name: "Karachi Collins"
			},
			{
				type: "mocktail",
				name: "Rooh Afza"
			},
			{
				type: "food",
				name: "Biryani"
			}
		]
	},
	{
		city: "Lagos",
		country: "Nigeria",
		timezone: "Africa/Lagos",
		specials: [
			{
				type: "cocktail",
				name: "Chapman"
			},
			{
				type: "mocktail",
				name: "Zobo"
			},
			{
				type: "food",
				name: "Jollof Rice"
			}
		]
	},
	{
		city: "Lima",
		country: "Peru",
		timezone: "America/Lima",
		specials: [
			{
				type: "cocktail",
				name: "Chilcano"
			},
			{
				type: "mocktail",
				name: "Chicha Morada"
			},
			{
				type: "food",
				name: "Ceviche"
			}
		]
	},
	{
		city: "Lisbon",
		country: "Portugal",
		timezone: "Europe/Lisbon",
		specials: [
			{
				type: "cocktail",
				name: "Port Tonic"
			},
			{
				type: "mocktail",
				name: "Sumol"
			},
			{
				type: "food",
				name: "Pastel de Nata"
			}
		]
	},
	{
		city: "London",
		country: "United Kingdom",
		timezone: "Europe/London",
		specials: [
			{
				type: "cocktail",
				name: "Pimm's Cup"
			},
			{
				type: "mocktail",
				name: "Elderflower Fizz"
			},
			{
				type: "food",
				name: "Fish and Chips"
			}
		]
	},
	{
		city: "Los Angeles",
		country: "United States",
		timezone: "America/Los_Angeles",
		specials: [
			{
				type: "cocktail",
				name: "Old Fashioned"
			},
			{
				type: "mocktail",
				name: "Shirley Temple"
			},
			{
				type: "food",
				name: "Burger"
			}
		]
	},
	{
		city: "Lyon",
		country: "France",
		timezone: "Europe/Paris",
		specials: [
			{
				type: "cocktail",
				name: "French 75"
			},
			{
				type: "mocktail",
				name: "Virgin Mojito"
			},
			{
				type: "food",
				name: "Croissant"
			}
		]
	},
	{
		city: "Madrid",
		country: "Spain",
		timezone: "Europe/Madrid",
		specials: [
			{
				type: "cocktail",
				name: "Sangria"
			},
			{
				type: "mocktail",
				name: "Horchata"
			},
			{
				type: "food",
				name: "Tapas"
			}
		]
	},
	{
		city: "Manchester",
		country: "United Kingdom",
		timezone: "Europe/London",
		specials: [
			{
				type: "cocktail",
				name: "Pimm's Cup"
			},
			{
				type: "mocktail",
				name: "Elderflower Fizz"
			},
			{
				type: "food",
				name: "Fish and Chips"
			}
		]
	},
	{
		city: "Manila",
		country: "Philippines",
		timezone: "Asia/Manila",
		specials: [
			{
				type: "cocktail",
				name: "Manila Sunset"
			},
			{
				type: "mocktail",
				name: "Calamansi Juice"
			},
			{
				type: "food",
				name: "Adobo"
			}
		]
	},
	{
		city: "Melbourne",
		country: "Australia",
		timezone: "Australia/Melbourne",
		specials: [
			{
				type: "cocktail",
				name: "Sydney Sling"
			},
			{
				type: "mocktail",
				name: "Lemon Lime Bitters"
			},
			{
				type: "food",
				name: "Meat Pie"
			}
		]
	},
	{
		city: "Mexico City",
		country: "Mexico",
		timezone: "America/Mexico_City",
		specials: [
			{
				type: "cocktail",
				name: "Margarita"
			},
			{
				type: "mocktail",
				name: "Agua de Jamaica"
			},
			{
				type: "food",
				name: "Tacos"
			}
		]
	},
	{
		city: "Milan",
		country: "Italy",
		timezone: "Europe/Rome",
		specials: [
			{
				type: "cocktail",
				name: "Aperol Spritz"
			},
			{
				type: "mocktail",
				name: "Sanbittèr"
			},
			{
				type: "food",
				name: "Pizza Margherita"
			}
		]
	},
	{
		city: "Montreal",
		country: "Canada",
		timezone: "America/Montreal",
		specials: [
			{
				type: "cocktail",
				name: "Caesar"
			},
			{
				type: "mocktail",
				name: "Maple Lemonade"
			},
			{
				type: "food",
				name: "Poutine"
			}
		]
	},
	{
		city: "Moscow",
		country: "Russia",
		timezone: "Europe/Moscow",
		specials: [
			{
				type: "cocktail",
				name: "Moscow Mule"
			},
			{
				type: "mocktail",
				name: "Kvass"
			},
			{
				type: "food",
				name: "Blini"
			}
		]
	},
	{
		city: "Mumbai",
		country: "India",
		timezone: "Asia/Kolkata",
		specials: [
			{
				type: "cocktail",
				name: "Mango Margarita"
			},
			{
				type: "mocktail",
				name: "Lassi"
			},
			{
				type: "food",
				name: "Samosa"
			}
		]
	},
	{
		city: "Munich",
		country: "Germany",
		timezone: "Europe/Berlin",
		specials: [
			{
				type: "cocktail",
				name: "Berliner Weisse"
			},
			{
				type: "mocktail",
				name: "Apfelschorle"
			},
			{
				type: "food",
				name: "Bratwurst"
			}
		]
	},
	{
		city: "Nairobi",
		country: "Kenya",
		timezone: "Africa/Nairobi",
		specials: [
			{
				type: "cocktail",
				name: "Dawa"
			},
			{
				type: "mocktail",
				name: "Tangawizi"
			},
			{
				type: "food",
				name: "Nyama Choma"
			}
		]
	},
	{
		city: "New York",
		country: "United States",
		timezone: "America/New_York",
		specials: [
			{
				type: "cocktail",
				name: "Old Fashioned"
			},
			{
				type: "mocktail",
				name: "Shirley Temple"
			},
			{
				type: "food",
				name: "Burger"
			}
		]
	},
	{
		city: "Osaka",
		country: "Japan",
		timezone: "Asia/Tokyo",
		specials: [
			{
				type: "cocktail",
				name: "Sake Martini"
			},
			{
				type: "mocktail",
				name: "Matcha Fizz"
			},
			{
				type: "food",
				name: "Sushi"
			}
		]
	},
	{
		city: "Paris",
		country: "France",
		timezone: "Europe/Paris",
		specials: [
			{
				type: "cocktail",
				name: "French 75"
			},
			{
				type: "mocktail",
				name: "Virgin Mojito"
			},
			{
				type: "food",
				name: "Croissant"
			}
		]
	},
	{
		city: "Perth",
		country: "Australia",
		timezone: "Australia/Perth",
		specials: [
			{
				type: "cocktail",
				name: "Sydney Sling"
			},
			{
				type: "mocktail",
				name: "Lemon Lime Bitters"
			},
			{
				type: "food",
				name: "Meat Pie"
			}
		]
	},
	{
		city: "Rio de Janeiro",
		country: "Brazil",
		timezone: "America/Sao_Paulo",
		specials: [
			{
				type: "cocktail",
				name: "Caipirinha"
			},
			{
				type: "mocktail",
				name: "Guaraná"
			},
			{
				type: "food",
				name: "Feijoada"
			}
		]
	},
	{
		city: "Rome",
		country: "Italy",
		timezone: "Europe/Rome",
		specials: [
			{
				type: "cocktail",
				name: "Aperol Spritz"
			},
			{
				type: "mocktail",
				name: "Sanbittèr"
			},
			{
				type: "food",
				name: "Pizza Margherita"
			}
		]
	},
	{
		city: "Santiago",
		country: "Chile",
		timezone: "America/Santiago",
		specials: [
			{
				type: "cocktail",
				name: "Pisco Sour"
			},
			{
				type: "mocktail",
				name: "Mote con Huesillo"
			},
			{
				type: "food",
				name: "Completo"
			}
		]
	},
	{
		city: "Seoul",
		country: "South Korea",
		timezone: "Asia/Seoul",
		specials: [
			{
				type: "cocktail",
				name: "Soju Bomb"
			},
			{
				type: "mocktail",
				name: "Sikhye"
			},
			{
				type: "food",
				name: "Korean Fried Chicken"
			}
		]
	},
	{
		city: "Shanghai",
		country: "China",
		timezone: "Asia/Shanghai",
		specials: [
			{
				type: "cocktail",
				name: "Baijiu Martini"
			},
			{
				type: "mocktail",
				name: "Plum Juice"
			},
			{
				type: "food",
				name: "Dim Sum"
			}
		]
	},
	{
		city: "Singapore",
		country: "Singapore",
		timezone: "Asia/Singapore",
		specials: [
			{
				type: "cocktail",
				name: "Singapore Sling"
			},
			{
				type: "mocktail",
				name: "Bandung"
			},
			{
				type: "food",
				name: "Chili Crab"
			}
		]
	},
	{
		city: "Stockholm",
		country: "Sweden",
		timezone: "Europe/Stockholm",
		specials: [
			{
				type: "cocktail",
				name: "Swedish Punsch"
			},
			{
				type: "mocktail",
				name: "Lingonberry Spritz"
			},
			{
				type: "food",
				name: "Meatballs"
			}
		]
	},
	{
		city: "Suva",
		country: "Fiji",
		timezone: "Pacific/Fiji",
		specials: [
			{
				type: "cocktail",
				name: "Fiji Sunset"
			},
			{
				type: "mocktail",
				name: "Coconut Water"
			},
			{
				type: "food",
				name: "Kokoda"
			}
		]
	},
	{
		city: "Sydney",
		country: "Australia",
		timezone: "Australia/Sydney",
		specials: [
			{
				type: "cocktail",
				name: "Sydney Sling"
			},
			{
				type: "mocktail",
				name: "Lemon Lime Bitters"
			},
			{
				type: "food",
				name: "Meat Pie"
			}
		]
	},
	{
		city: "São Paulo",
		country: "Brazil",
		timezone: "America/Sao_Paulo",
		specials: [
			{
				type: "cocktail",
				name: "Caipirinha"
			},
			{
				type: "mocktail",
				name: "Guaraná"
			},
			{
				type: "food",
				name: "Feijoada"
			}
		]
	},
	{
		city: "Tehran",
		country: "Iran",
		timezone: "Asia/Tehran",
		specials: [
			{
				type: "cocktail",
				name: "Persian Pomegranate Fizz"
			},
			{
				type: "mocktail",
				name: "Doogh"
			},
			{
				type: "food",
				name: "Kebab Koobideh"
			}
		]
	},
	{
		city: "Tokyo",
		country: "Japan",
		timezone: "Asia/Tokyo",
		specials: [
			{
				type: "cocktail",
				name: "Sake Martini"
			},
			{
				type: "mocktail",
				name: "Matcha Fizz"
			},
			{
				type: "food",
				name: "Sushi"
			}
		]
	},
	{
		city: "Toronto",
		country: "Canada",
		timezone: "America/Toronto",
		specials: [
			{
				type: "cocktail",
				name: "Caesar"
			},
			{
				type: "mocktail",
				name: "Maple Lemonade"
			},
			{
				type: "food",
				name: "Poutine"
			}
		]
	},
	{
		city: "Vancouver",
		country: "Canada",
		timezone: "America/Vancouver",
		specials: [
			{
				type: "cocktail",
				name: "Caesar"
			},
			{
				type: "mocktail",
				name: "Maple Lemonade"
			},
			{
				type: "food",
				name: "Poutine"
			}
		]
	}
];
