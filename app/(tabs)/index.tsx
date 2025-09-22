import React, { useEffect, useState } from 'react';
import { ThemedSafeAreaView } from '@/components/Themed/ThemedSafeAreaView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { getCurrentTimezone } from '@/utils/getCurrentTimezone';
import { getCitiesWithTimezones, CityWithTimezone } from '@/utils/db';
import { getCitiesForApero } from '@/utils/apero';
import { DateTime } from 'luxon';

export default function HomeScreen() {
	const [localTimezone, setLocalTimezone] = useState('');
	const [localTime, setLocalTime] = useState('');
	const [aperoCities, setAperoCities] = useState<CityWithTimezone[]>([]);

	// 🔹 Heure locale
	useEffect(() => {
		const tz = getCurrentTimezone();
		setLocalTimezone(tz);
		setLocalTime(DateTime.now().setZone(tz).toFormat('HH:mm'));

		const interval = setInterval(() => {
			setLocalTime(DateTime.now().setZone(tz).toFormat('HH:mm'));
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	// 🔹 Charger les villes depuis la DB et filtrer celles où c'est l'apéro
	useEffect(() => {
		const fetchCities = async () => {
			try {
				const cities = await getCitiesWithTimezones(); // ✅ utilisation async/await
				const filtered = getCitiesForApero(cities);
				setAperoCities(filtered);
			} catch (error) {
				console.error('Erreur en récupérant les villes :', error);
			}
		};

		fetchCities();
		const interval = setInterval(fetchCities, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<ThemedSafeAreaView style={styles.container} lightColor="#fff" darkColor="#000">
			<ThemedText style={styles.headerText}>
				Coucou ! Il est actuellement {localTime} sur le fuseau {localTimezone}
			</ThemedText>

			<ThemedText style={styles.subHeaderText}>
				Les villes où il est actuellement l'heure de l'apéro :
			</ThemedText>

			<ScrollView style={styles.citiesScroll}>
				{aperoCities.length > 0 ? (
					aperoCities.map((city) => (
						<ThemedText key={city.name} style={styles.cityText}>
							{city.name} ({city.timezone})
						</ThemedText>
					))
				) : (
					<ThemedText style={styles.noCityText}>Aucune ville pour l'instant 😢</ThemedText>
				)}
			</ScrollView>
		</ThemedSafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		alignItems: 'center',
	},
	headerText: {
		fontSize: 18,
		marginBottom: 12,
		textAlign: 'center',
	},
	subHeaderText: {
		fontSize: 16,
		marginBottom: 8,
		textAlign: 'center',
	},
	citiesScroll: {
		width: '100%',
		maxHeight: 300,
	},
	cityText: {
		fontSize: 14,
		marginBottom: 6,
	},
	noCityText: {
		fontSize: 14,
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 8,
	},
});
