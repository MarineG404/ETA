import { Drink, UserProfile } from '@/types/alcohol';

// Calcul du taux d'alcoolémie
export const calculateBAC = (drinks: Drink[], profile: UserProfile): number => {
	if (!profile.gender || !profile.weight) return 0;

	const r = profile.gender === 'male' ? 0.68 : 0.55; // Coefficient de diffusion
	let totalAlcohol = 0;

	drinks.forEach(drink => {
		const gramsAlcohol = (drink.volume * drink.alcohol * 0.789) / 10; // 0.789 = densité alcool
		const hoursElapsed = (Date.now() - drink.time.getTime()) / (1000 * 60 * 60);
		const eliminatedAlcohol = hoursElapsed * 0.15 * profile.weight * r; // 0.15g/L/h élimination
		totalAlcohol += Math.max(0, gramsAlcohol - eliminatedAlcohol);
	});

	const bac = totalAlcohol / (profile.weight * r);
	return Math.max(0, bac);
};

// Calcul du temps avant sobriété
export const calculateSoberTime = (currentBAC: number, profile: UserProfile): Date | null => {
	if (currentBAC <= 0 || !profile.gender || !profile.weight) return null;

	const r = profile.gender === 'male' ? 0.68 : 0.55;
	const hoursToSober = currentBAC / (0.15 / (profile.weight * r));

	const soberTime = new Date();
	soberTime.setHours(soberTime.getHours() + hoursToSober);

	return soberTime;
};

export const getBACStatus = (bac: number) => {
	if (bac === 0) return { text: 'Sobre ✅', color: '#4CAF50' };
	if (bac < 0.5) return { text: 'Légèrement alcoolisé ⚠️', color: '#FFC107' };
	if (bac < 0.8) return { text: 'Limite légale dépassée 🚫', color: '#FF9800' };
	return { text: 'Fortement alcoolisé ⛔', color: '#F44336' };
};
