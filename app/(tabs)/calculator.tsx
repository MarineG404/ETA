import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ProfileForm } from '@/components/alcohol/ProfileForm';
import { DrinkForm } from '@/components/alcohol/DrinkForm';
import { DrinksList } from '@/components/alcohol/DrinksList';
import { BACResults } from '@/components/alcohol/BACResults';
import { UserProfile, Drink } from '@/types/alcohol';
import { calculateBAC, calculateSoberTime } from '@/utils/alcoholCalculator';
import { Header } from '@/components/ui/header';

export default function CalculatorScreen() {
	const [profile, setProfile] = useState<UserProfile>({
		weight: 0,
		height: 0,
		gender: null,
	});

	const [drinks, setDrinks] = useState<Drink[]>([]);

	const addDrink = (drink: Drink) => {
		setDrinks([...drinks, drink]);
	};

	const removeDrink = (id: string) => {
		setDrinks(drinks.filter(d => d.id !== id));
	};

	const currentBAC = calculateBAC(drinks, profile);
	const soberTime = calculateSoberTime(currentBAC, profile);
	const showResults = profile.gender && profile.weight > 0 && drinks.length > 0;

	return (
		<Header
			emoji="🍺"
			title="Calculateur d'Alcoolémie"
			subtitle="Estime ton taux et le temps avant d'être sobre"
		>
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<ProfileForm profile={profile} onProfileChange={setProfile} />
				<DrinkForm onAddDrink={addDrink} />
				<DrinksList drinks={drinks} onRemoveDrink={removeDrink} />

				{showResults && (
					<BACResults currentBAC={currentBAC} soberTime={soberTime} />
				)}
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
