import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrinkForm } from '@/components/alcohol/DrinkForm';
import { DrinksList } from '@/components/alcohol/DrinksList';
import { BACResults } from '@/components/alcohol/BACResults';
import { Drink } from '@/types/alcohol';
import { calculateBAC } from '@/utils/alcoholCalculator';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/context/ProfileContext';
import { getColors } from '@/constants/Colors';
import { Header } from '@/components/ui/header';

export default function CalculatorScreen() {
	const { isDark } = useTheme();
	const colors = getColors(isDark);
	const { profile } = useProfile();

	const [drinks, setDrinks] = useState<Drink[]>([]);
	const [result, setResult] = useState(calculateBAC([], profile));

	useEffect(() => {
		setResult(calculateBAC(drinks, profile));
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

				<DrinkForm onAddDrink={addDrink} />
				<DrinksList drinks={drinks} onRemoveDrink={removeDrink} />
				{isProfileComplete && <BACResults result={result} />}
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
