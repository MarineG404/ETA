import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ProfileForm } from '@/components/alcohol/ProfileForm';
import { DrinkForm } from '@/components/alcohol/DrinkForm';
import { DrinksList } from '@/components/alcohol/DrinksList';
import { BACResults } from '@/components/alcohol/BACResults';
import { UserProfile, Drink } from '@/types/alcohol';
import { calculateBAC } from '@/utils/alcoholCalculator';
import { useTheme } from '@/context/ThemeContext';
import { getColors } from '@/constants/Colors';
import { Header } from '@/components/ui/header';

export default function CalculatorScreen() {
	const { isDark } = useTheme();
	const colors = getColors(isDark);

	const [profile, setProfile] = useState<UserProfile>({
		gender: null,
		weight: null,
		height: null,
	});

	const [drinks, setDrinks] = useState<Drink[]>([]);
	const [result, setResult] = useState(calculateBAC([], profile));

	// Recalcul à chaque changement
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
				<ProfileForm profile={profile} onProfileChange={setProfile} />
				<DrinkForm onAddDrink={addDrink} />
				<DrinksList drinks={drinks} onRemoveDrink={removeDrink} />
				<BACResults result={result} />
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
});
