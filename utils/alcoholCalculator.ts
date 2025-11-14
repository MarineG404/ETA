// Version scientifique et réaliste du calcul BAC
// ------------------------------------------------------------
// Objectifs :
// - Garder les mêmes variables / noms de fonctions pour intégration facile
// - Utiliser la formule Watson pour le Total Body Water (plus précise que r fixe)
// - Modéliser l'absorption par une fonction exponentielle (first-order)
// - Calculer l'élimination en grammes/heure (ELIMINATION_RATE en g/L/h * TBW en L)
// - Élimination concurrente à l'absorption (empêche des pics tardifs artificiels)
// ------------------------------------------------------------

import { Drink, UserProfile, BACResult } from '@/types/alcohol';

// Constantes
const ALCOHOL_DENSITY = 0.789; // g/mL
// ELIMINATION_RATE : g/L/h (typique : 0.10 - 0.20) -> 0.15 par défaut
const ELIMINATION_RATE = 0.15;

// Paramètre d'absorption (valeur de base, modifiable)
// ABSORPTION_TIME est utilisé comme "échelle" pour estimer le temps vers le pic
const ABSORPTION_TIME = 0.75; // heures (≈45 minutes)

// --- Utils: Watson formula pour estimer le Total Body Water (en litres)
// On utilise âge si disponible dans profile, sinon on prend une valeur par défaut.
const estimateTBW = (profile: UserProfile): number => {
  const weight = profile.weight; // kg
  const height = profile.height || 170; // cm, fallback 170
  const age = profile.age || 30; // années, fallback 30

  if (!profile.gender || !weight) return 0;

  // Formules Watson (litres)
  if (profile.gender === 'male') {
    // TBW = 2.447 - 0.09516*age + 0.1074*height(cm) + 0.3362*weight(kg)
    return 2.447 - 0.09516 * age + 0.1074 * height + 0.3362 * weight;
  } else {
    // TBW = -2.097 + 0.1069*height + 0.2466*weight
    return -2.097 + 0.1069 * height + 0.2466 * weight;
  }
};

// Ancienne fonction getWaterContent conservée pour compatibilité (retourne largeur d'eau estimée r)
const getWaterContent = (gender: 'male' | 'female'): number => {
  return gender === 'male' ? 0.68 : 0.55;
};

// Calcul des grammes d'alcool pur
const calculateAlcoholGrams = (drink: Drink): number => {
  // drink.volume en mL, drink.alcohol en % (ex: 5 pour 5%)
  return (drink.volume * (drink.alcohol / 100)) * ALCOHOL_DENSITY; // g
};

// Fonction d'absorption (first-order approché)
// - peakTimeHours : temps (h) attendu jusqu'au pic depuis le début de la boisson
// On choisit k tel que la fraction atteigne ~95% au moment du pic : k = -ln(0.05)/peak
const absorptionFraction = (hoursFromStart: number, peakTimeHours: number): number => {
  if (hoursFromStart <= 0) return 0;
  const k = -Math.log(0.05) / Math.max(peakTimeHours, 0.01); // évite division par 0
  const frac = 1 - Math.exp(-k * hoursFromStart);
  return Math.min(1, frac);
};

// Calcul du taux d'alcoolémie pour une boisson (modèle scientifique)
const calculateDrinkBAC = (drink: Drink, profile: UserProfile, currentTime: Date): number => {
  if (!profile.gender || !profile.weight) return 0;

  const alcoholGrams = calculateAlcoholGrams(drink); // g

  // Estimation du TBW (litres) via Watson (plus précis que r * poids)
  const tbw = estimateTBW(profile); // L
  if (tbw <= 0) return 0;

  // Durée de consommation (heures)
  const drinkDuration = (drink.endTime.getTime() - drink.startTime.getTime()) / (1000 * 60 * 60);
  const hoursFromStart = (currentTime.getTime() - drink.startTime.getTime()) / (1000 * 60 * 60);

  // Estimation du temps jusqu'au pic (en heures) : on base sur la durée + ABSORPTION_TIME
  // Approche : pic ≈ milieu de la consommation + un petit décalage (ABSORPTION_TIME * 0.5)
  const peakTimeHours = (Math.max(0, drinkDuration) / 2) + (ABSORPTION_TIME * 0.5);

  // Fraction d'alcool absorbée jusqu'à l'instant t
  const fracAbsorbed = absorptionFraction(hoursFromStart, peakTimeHours);

  // Quantité d'alcool présente dans le corps (grammes), en tenant compte de l'absorption
  const gramsAbsorbed = alcoholGrams * fracAbsorbed;

  // Taux d'élimination en grammes/heure = ELIMINATION_RATE (g/L/h) * TBW (L)
  const elimGramsPerHour = ELIMINATION_RATE * tbw;

  // Élimination totale depuis le début (on considère que l'élimination commence dès qu'il y a alcool absorbé)
  const gramsEliminated = Math.max(0, hoursFromStart * elimGramsPerHour);

  // Quantité nette d'alcool encore dans le corps (grammes)
  const gramsNet = Math.max(0, gramsAbsorbed - gramsEliminated);

  // BAC instantané en g/L = gramsNet / TBW
  const bac = gramsNet / tbw;

  return bac;
};

// Calcul du taux d'alcoolémie total avec pic (version scientifique)
export const calculateBAC = (drinks: Drink[], profile: UserProfile): BACResult => {
  if (!profile.gender || !profile.weight || drinks.length === 0) {
    return {
      currentBAC: 0,
      peakBAC: 0,
      peakTime: new Date(),
      soberTime: null,
      status: { text: 'Sobre ✅', color: '#4CAF50' },
    };
  }

  const now = new Date();
  let currentBAC = 0;
  let peakBAC = 0;
  let peakTime = now;

  // BAC actuel : somme des contributions de chaque boisson
  drinks.forEach(drink => {
    currentBAC += calculateDrinkBAC(drink, profile, now);
  });

  // Recherche du pic : on parcourt de (début de la première boisson) -> (2h après la dernière)
  const earliest = drinks.reduce((min, d) => Math.min(min, d.startTime.getTime()), drinks[0].startTime.getTime());
  const latest = drinks.reduce((max, d) => Math.max(max, d.endTime.getTime()), drinks[0].endTime.getTime());

  const searchStart = earliest;
  const searchEnd = latest + 2 * 60 * 60 * 1000; // +2h

  for (let t = searchStart; t <= searchEnd; t += 60 * 1000) { // résolution 1 minute pour précision scientifique
    const testTime = new Date(t);
    let testBAC = 0;
    drinks.forEach(drink => {
      testBAC += calculateDrinkBAC(drink, profile, testTime);
    });

    if (testBAC > peakBAC) {
      peakBAC = testBAC;
      peakTime = testTime;
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

// Calcul du temps avant sobriété (depuis le pic)
export const calculateSoberTime = (peakBAC: number, peakTime: Date, profile: UserProfile): Date | null => {
  if (peakBAC <= 0.01 || !profile.gender || !profile.weight) return null;

  // Analytique : heures = peakBAC / ELIMINATION_RATE (puisque ELIMINATION_RATE est en g/L/h)
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
  if (!profile.gender || !profile.weight) return [];

  const predictions: { time: Date; bac: number }[] = [];
  const now = new Date();

  for (let minutes = 0; minutes <= hoursAhead * 60; minutes += 5) {
    const futureTime = new Date(now.getTime() + minutes * 60 * 1000);
    let futureBac = 0;

    drinks.forEach(drink => {
      futureBac += calculateDrinkBAC(drink, profile, futureTime);
    });

    predictions.push({
      time: futureTime,
      bac: Math.round(futureBac * 1000) / 1000,
    });
  }

  return predictions;
};
