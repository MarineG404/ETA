import React, { useEffect, useState } from 'react';
import { resetDatabase, getCityData, CityData } from '@/utils/aperoDb';
import { CitiesCard } from '@/components/Cities/CitiesCard';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { getCitiesForApero } from '@/utils/apero';
import { getColors } from "@/constants/Colors";
import { useTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
	const { isDark } = useTheme();
	const COLORS = getColors(isDark);

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

	useEffect(() => {
		const interval = setInterval(fetchCities, 60000);
		return () => clearInterval(interval);
	}, []);

	const citiesForApero = getCitiesForApero(cities);

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
			<Text style={[styles.title, { color: COLORS.primary }]}>🌍 ETA - Estimate Time of Apero </Text>
			<Text style={[styles.subHeaderText, { color: COLORS.secondary }]}>
				Les villes où il est actuellement l'heure de l'apéro :
			</Text>

			<ScrollView
				style={styles.citiesScroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{citiesForApero.length === 0 ? (
					<Text style={[styles.loadingText, { color: COLORS.textSecondary }]}>Aucune ville pour l'instant 😢</Text>
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
		padding: 16,
		paddingBottom: 0, // ✅ Retire le padding du bas
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subHeaderText: {
		fontSize: 16,
		marginBottom: 8,
		textAlign: 'center',
	},
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
