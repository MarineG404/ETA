import React, { useEffect, useState } from 'react';
import { resetDatabase, getCityData, CityData } from '@/utils/aperoDb';
import CitiesCard from '@/components/Cities/CitiesCard';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from '@/constants/Colors';
import { getCitiesForApero } from '@/utils/apero';

export default function HomeScreen() {
	const [cities, setCities] = useState<CityData[]>([]);

	// 🔹 Init DB + fetch
	useEffect(() => {
		const initDb = async () => {
			await resetDatabase();
			await fetchCities();
		};
		initDb();
	}, []);

	const fetchCities = async () => {
		try {
			const data = await getCityData();
			setCities(data);
		} catch (error) {
			console.error('Erreur en récupérant les villes:', error);
			setCities([]);
		}
	};

	// 🔹 Rafraîchissement villes toutes les minutes
	useEffect(() => {
		const interval = setInterval(fetchCities, 60000);
		return () => clearInterval(interval);
	}, []);

	const citiesForApero = getCitiesForApero(cities);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.subHeaderText}>
				Les villes où il est actuellement l'heure de l'apéro :
			</Text>

			<ScrollView style={styles.citiesScroll} contentContainerStyle={styles.scrollContent}>
				{citiesForApero.length === 0 ? (
					<Text style={styles.loadingText}>Aucune ville pour l'instant 😢</Text>
				) : (
					citiesForApero.map(city => (
						<View key={city.city} style={styles.cardWrapper}>
							<CitiesCard city={city} />
						</View>
					))
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: COLORS.background,
		padding: 16,
	},
	subHeaderText: {
		fontSize: 16,
		marginBottom: 8,
		textAlign: 'center',
		color: COLORS.secondary,
	},
	loadingText: {
		fontSize: 14,
		fontStyle: 'italic',
		color: COLORS.textSecondary,
		marginTop: 8,
		textAlign: 'center',
	},
	citiesScroll: {
		flex: 1,
		width: '100%',
	},
	scrollContent: {
		paddingBottom: 24,
	},
	cardWrapper: {
		marginBottom: 12,
	},
});
