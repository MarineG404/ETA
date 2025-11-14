export type Gender = 'male' | 'female';

export type UserProfile = {
	gender: Gender | null;
	weight: number | null; // en kg
	height: number | null; // en cm
	age: number | null; // en années ✅ Ajouté
};

export type Drink = {
	id: string;
	name: string;
	volume: number; // en mL
	alcohol: number; // % d'alcool
	startTime: Date; // ✅ Heure de début
	endTime: Date; // ✅ Heure de fin
};

export type BACResult = {
	currentBAC: number; // Taux actuel en g/L
	peakBAC: number; // Taux maximal atteint
	peakTime: Date; // Heure du pic
	soberTime: Date | null; // Heure de sobriété
	status: {
		text: string;
		color: string;
	};
};
