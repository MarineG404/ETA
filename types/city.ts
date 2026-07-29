export type SpecialItem = {
	type: 'cocktail' | 'mocktail' | 'food';
	name: string;
};

export type CityData = {
	city: string;
	country?: string;
	timezone: string;
	specials: SpecialItem[];
};
