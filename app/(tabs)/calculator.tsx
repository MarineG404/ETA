import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrinkForm } from '@/components/alcohol/DrinkForm';
import { DrinksList } from '@/components/alcohol/DrinksList';
import { BACResults } from '@/components/alcohol/BACResults';
import { Drink } from '@/types/alcohol';
import { calculateBAC, predictBAC } from '@/utils/alcoholCalculator';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/context/ProfileContext';
import { getColors } from '@/constants/Colors';
import { Header } from '@/components/ui/header';
import * as Notifications from 'expo-notifications';
import { getBACStatus } from '@/utils/alcoholCalculator';
import { PhaseNotifier } from '@/components/notifications/PhaseNotifier'; // nouveau

export default function CalculatorScreen() {
	const { isDark } = useTheme();
	const colors = getColors(isDark);
	const { profile } = useProfile();

	const [drinks, setDrinks] = useState<Drink[]>([]);
	const [result, setResult] = useState(calculateBAC([], profile));
	const [predictions, setPredictions] = useState<{ time: Date; bac: number }[]>([]); // nouveau

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
