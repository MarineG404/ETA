// Modèle scientifique du taux d'alcoolémie (BAC)
// ------------------------------------------------------------
// - Formule de Watson pour le Total Body Water (plus précise qu'un ratio fixe)
// - Absorption modélisée par une courbe exponentielle par boisson (first-order)
// - Élimination hépatique = cinétique d'ordre zéro (taux constant, ~0.15 g/L/h),
//   appliquée UNE SEULE FOIS sur le pool total d'alcool dans le corps — pas par
//   boisson. Le foie n'a qu'une seule capacité d'élimination ; l'appliquer en
//   parallèle à chaque boisson ferait décroître le BAC N fois trop vite avec
//   N boissons en cours d'absorption.
// - Une simulation temporelle unique (grammes d'alcool dans le corps) est
//   réutilisée pour le taux actuel, le pic et les prédictions.
// ------------------------------------------------------------

import { Drink, UserProfile, BACResult } from '@/types/alcohol';

const ALCOHOL_DENSITY = 0.789; // g/mL
const ELIMINATION_RATE = 0.15; // g/L/h (Widmark, typique 0.10-0.20)
const ABSORPTION_TIME = 0.75; // heures (~45 min), échelle de temps jusqu'au pic d'absorption

// Total Body Water (litres) via la formule de Watson
const estimateTBW = (profile: UserProfile): number => {
	const weight = profile.weight; // kg
	const height = profile.height || 170; // cm, fallback
	const age = profile.age || 30; // années, fallback

	if (!profile.gender || !weight) return 0;

	if (profile.gender === 'male') {
		return 2.447 - 0.09516 * age + 0.1074 * height + 0.3362 * weight;
	}
	return -2.097 + 0.1069 * height + 0.2466 * weight;
};

const calculateAlcoholGrams = (drink: Drink): number =>
	drink.volume * (drink.alcohol / 100) * ALCOHOL_DENSITY; // g

// Temps estimé (h) jusqu'au pic d'absorption d'une boisson : milieu de la
// consommation + un décalage lié à l'absorption digestive
const peakTimeHoursFor = (drink: Drink): number => {
	const drinkDuration = Math.max(0, (drink.endTime.getTime() - drink.startTime.getTime()) / 3_600_000);
	return drinkDuration / 2 + ABSORPTION_TIME * 0.5;
};

// Fraction cumulative d'alcool absorbée à hoursFromStart (atteint ~95% au pic)
const absorptionFraction = (hoursFromStart: number, peakTimeHours: number): number => {
	if (hoursFromStart <= 0) return 0;
	const k = -Math.log(0.05) / Math.max(peakTimeHours, 0.01); // évite division par 0
	return Math.min(1, 1 - Math.exp(-k * hoursFromStart));
};

type SimPoint = { time: Date; grams: number };

// Simule le pool total d'alcool (g) dans le corps entre `from` et `to`.
// Chaque boisson suit sa propre courbe d'absorption, mais l'élimination
// s'applique une seule fois sur le total absorbé, comme le ferait le foie.
const simulate = (drinks: Drink[], tbw: number, from: Date, to: Date, stepMinutes: number): SimPoint[] => {
	if (tbw <= 0 || drinks.length === 0 || to.getTime() < from.getTime()) return [];

	const elimGramsPerHour = ELIMINATION_RATE * tbw;
	const stepMs = stepMinutes * 60_000;
	const drinkMeta = drinks.map(d => ({
		grams: calculateAlcoholGrams(d),
		peak: peakTimeHoursFor(d),
		startMs: d.startTime.getTime(),
	}));
	const prevAbsorbed = drinkMeta.map(() => 0);

	const points: SimPoint[] = [];
	let grams = 0;

	for (let t = from.getTime(); t <= to.getTime(); t += stepMs) {
		let absorbedDelta = 0;
		drinkMeta.forEach((d, i) => {
			const hours = (t - d.startMs) / 3_600_000;
			const absorbedSoFar = d.grams * absorptionFraction(hours, d.peak);
			absorbedDelta += absorbedSoFar - prevAbsorbed[i];
			prevAbsorbed[i] = absorbedSoFar;
		});

		grams = Math.max(0, grams + absorbedDelta - elimGramsPerHour * (stepMinutes / 60));
		points.push({ time: new Date(t), grams });
	}

	return points;
};

// Calcul du taux d'alcoolémie actuel + pic (modèle scientifique)
export const calculateBAC = (drinks: Drink[], profile: UserProfile): BACResult => {
	const tbw = estimateTBW(profile);

	if (!profile.gender || !profile.weight || tbw <= 0 || drinks.length === 0) {
		return {
			currentBAC: 0,
			peakBAC: 0,
			peakTime: new Date(),
			soberTime: null,
			status: { text: 'Sobre ✅', color: '#4CAF50' },
		};
	}

	const now = new Date();
	const earliest = new Date(Math.min(...drinks.map(d => d.startTime.getTime())));
	const latest = Math.max(...drinks.map(d => d.endTime.getTime())) + 2 * 60 * 60 * 1000; // +2h
	const searchEnd = new Date(Math.max(now.getTime(), latest));

	// résolution 1 minute pour précision scientifique
	const points = simulate(drinks, tbw, earliest, searchEnd, 1);

	let peakBAC = 0;
	let peakTime = now;
	let currentBAC = 0;

	for (const p of points) {
		const bac = p.grams / tbw;
		if (bac > peakBAC) {
			peakBAC = bac;
			peakTime = p.time;
		}
		if (p.time.getTime() <= now.getTime()) {
			currentBAC = bac;
		}
	}

	const soberTime = calculateSoberTime(peakBAC, peakTime, profile);

	return {
		currentBAC: Math.round(currentBAC * 1000) / 1000,
		peakBAC: Math.round(peakBAC * 1000) / 1000,
		peakTime,
		soberTime,
		status: getBACStatus(currentBAC),
	};
};

// Temps avant sobriété depuis le pic : une fois l'absorption terminée, le BAC
// décroît linéairement à ELIMINATION_RATE (g/L/h)
export const calculateSoberTime = (peakBAC: number, peakTime: Date, profile: UserProfile): Date | null => {
	if (peakBAC <= 0.01 || !profile.gender || !profile.weight) return null;

	const hoursToSober = peakBAC / ELIMINATION_RATE;
	return new Date(peakTime.getTime() + hoursToSober * 60 * 60 * 1000);
};

// Statut en fonction du taux (g/L)
export const getBACStatus = (bac: number) => {
	if (bac < 0.01) return { text: 'Sobre ✅', color: '#4CAF50' };
	if (bac < 0.2) return { text: 'Effet minimal 🟢', color: '#8BC34A' };
	if (bac < 0.5) return { text: 'Légèrement alcoolisé ⚠️', color: '#FFC107' };
	if (bac < 0.8) return { text: 'Limite légale dépassée 🚫', color: '#FF9800' };
	if (bac < 1.5) return { text: 'Fortement alcoolisé ⛔', color: '#F44336' };
	return { text: 'Danger ! 🚨', color: '#D32F2F' };
};

// Prédictions pour les prochaines heures (résolution 5 minutes)
export const predictBAC = (drinks: Drink[], profile: UserProfile, hoursAhead: number = 6): { time: Date; bac: number }[] => {
	const tbw = estimateTBW(profile);
	if (!profile.gender || !profile.weight || tbw <= 0 || drinks.length === 0) return [];

	const now = new Date();
	const earliest = new Date(Math.min(...drinks.map(d => d.startTime.getTime()), now.getTime()));
	const horizon = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

	const points = simulate(drinks, tbw, earliest, horizon, 5);

	return points
		.filter(p => p.time.getTime() >= now.getTime())
		.map(p => ({ time: p.time, bac: Math.round((p.grams / tbw) * 1000) / 1000 }));
};
