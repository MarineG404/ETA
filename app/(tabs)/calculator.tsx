import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkForm } from '@/components/alcohol/DrinkForm';
import { DrinksList } from '@/components/alcohol/DrinksList';
import { BACResults } from '@/components/alcohol/BACResults';
import { Drink } from '@/types/alcohol';
import { calculateBAC, predictBAC } from '@/utils/alcoholCalculator';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/context/ProfileContext';
import { getColors } from '@/constants/Colors';
import { Header } from '@/components/ui/header';
import { PhaseNotifier } from '@/components/notifications/PhaseNotifier'; // nouveau

const DRINKS_STORAGE_KEY = 'drinks';

export default function CalculatorScreen() {
	const { isDark } = useTheme();
	const colors = getColors(isDark);
	const { profile } = useProfile();

	const [drinks, setDrinks] = useState<Drink[]>([]);
	const [result, setResult] = useState(calculateBAC([], profile));
	const [predictions, setPredictions] = useState<{ time: Date; bac: number }[]>([]); // nouveau

	// Évite d'écraser le stockage avec le tableau vide initial avant la fin du chargement
	const hasLoadedDrinks = useRef(false);

	// Charger les boissons sauvegardées au démarrage
	useEffect(() => {
		const loadDrinks = async () => {
			try {
				const saved = await AsyncStorage.getItem(DRINKS_STORAGE_KEY);
				if (saved) {
					const parsed: Drink[] = JSON.parse(saved).map((d: Drink) => ({
						...d,
						startTime: new Date(d.startTime),
						endTime: new Date(d.endTime),
					}));
					setDrinks(parsed);
				}
			} catch (error) {
				console.error('Erreur chargement boissons:', error);
			} finally {
				hasLoadedDrinks.current = true;
			}
		};
		loadDrinks();
	}, []);

	// Sauvegarder les boissons quand elles changent
	useEffect(() => {
		if (!hasLoadedDrinks.current) return;
		AsyncStorage.setItem(DRINKS_STORAGE_KEY, JSON.stringify(drinks)).catch((error) => {
			console.error('Erreur sauvegarde boissons:', error);
		});
	}, [drinks]);

	useEffect(() => {
		const r = calculateBAC(drinks, profile);
		setResult(r);
		// prédictions sur 12h (15min step dans predictBAC)
		setPredictions(predictBAC(drinks, profile, 12));
	}, [drinks, profile]);

	const addDrink = (drink: Omit<Drink, 'id'>) => {
		const newDrink: Drink = {
			...drink,
			id: Date.now().toString(),
		};
		setDrinks([...drinks, newDrink]);
	};

	const removeDrink = (id: string) => {
		setDrinks(drinks.filter((d) => d.id !== id));
	};

	const isProfileComplete = profile.gender && profile.weight;

	return (
		<Header
			emoji="🍺"
			title="Calculateur d'alcoolémie"
			subtitle="Estime ton taux d'alcool dans le sang"
		>
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{!isProfileComplete && (
					<View style={[styles.warning, { backgroundColor: colors.primary + '20' }]}>
						<Text style={[styles.warningText, { color: colors.primary }]}>
							⚠️ Configure ton profil dans les paramètres pour des calculs précis !
						</Text>
					</View>
				)}

				{isProfileComplete && <PhaseNotifier predictions={predictions} />}

				<DrinkForm onAddDrink={addDrink} />
				<DrinksList drinks={drinks} onRemoveDrink={removeDrink} />
				{isProfileComplete && <BACResults result={result} predictions={predictions} />}
			</ScrollView>
		</Header>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		width: '100%',
	},
	scrollContent: {
		paddingBottom: 40,
	},
	warning: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 16,
	},
	warningText: {
		fontSize: 14,
		fontWeight: '600',
		textAlign: 'center',
	},
});
