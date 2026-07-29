import React, { useEffect, useState } from 'react';
import { CITIES } from '@/utils/citiesData';
import { CitiesCard } from '@/components/Cities/CitiesCard';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCitiesForApero } from '@/utils/apero';
import { getColors } from "@/constants/Colors";
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/ui/header';

export default function HomeScreen() {
	const { isDark } = useTheme();
	const COLORS = getColors(isDark);

	// CITIES est statique : ce tick ne sert qu'à re-déclencher le rendu
	// pour que getCitiesForApero() ré-évalue l'heure courante par ville.
	const [, forceTick] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => forceTick(t => t + 1), 60000);
		return () => clearInterval(interval);
	}, []);

	const citiesForApero = getCitiesForApero(CITIES);

	return (
		<Header
			emoji="🌍"
			title="ETA - Estimate Time of Apero"
			subtitle="Les villes où il est actuellement l'heure de l'apéro :"
		>
			<ScrollView
				style={styles.citiesScroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{citiesForApero.length === 0 ? (
					<Text style={[styles.loadingText, { color: COLORS.textSecondary }]}>
						Aucune ville pour l'instant 😢
					</Text>
				) : (
					citiesForApero.map(city => (
						<View key={city.city} style={styles.cardWrapper}>
							<CitiesCard city={city} />
						</View>
					))
				)}
			</ScrollView>
		</Header>
	);
}

const styles = StyleSheet.create({
	loadingText: {
		fontSize: 14,
		fontStyle: 'italic',
		marginTop: 8,
		textAlign: 'center',
	},
	citiesScroll: {
		flex: 1,
		width: '100%',
	},
	scrollContent: {
		paddingBottom: 40,
	},
	cardWrapper: {
		marginBottom: 2,
	}
});
