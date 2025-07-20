import React, { useEffect, useState } from 'react';
import { ScrollView, ViewStyle, StyleSheet } from 'react-native';
import moment from 'moment-timezone';
import { ThemedSafeAreaView } from '@/components/Themed/ThemedSafeAreaView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { getCurrentTimezone } from '@/utils/getCurrentTimezone';
import { getTimezoneData } from '@/utils/getTimezoneData';

export default function HomeScreen() {
	const [timezone, setTimezone] = useState('');
	const [localTime, setLocalTime] = useState('');

	useEffect(() => {
		const tz = getCurrentTimezone();
		setTimezone(tz);
		setLocalTime(moment().tz(tz).format('HH:mm'));

		const interval = setInterval(() => {
			setLocalTime(moment().tz(tz).format('HH:mm'));
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	const CitiesInZone = ({ timezone }: { timezone: string }) => {
		const cities = getTimezoneData(timezone);

		if (cities.length === 0) {
			return <ThemedText style={styles.noCityText}>Aucune ville trouvée pour ce fuseau.</ThemedText>;
		}

		return (
			<ScrollView contentContainerStyle={styles.citiesContainer} style={styles.citiesScroll}>
				{cities.map(({ city, country }, index) => (
					<ThemedText key={index} style={styles.cityText}>
						{city} {country ? `- ${country}` : ''}
					</ThemedText>
				))}
			</ScrollView>
		);
	};

	return (
		<ThemedSafeAreaView style={styles.container} lightColor="#fff" darkColor="#000">
			<ThemedText style={styles.headerText}>
				Coucou ! Il est actuellement {localTime} sur le fuseau {timezone}
			</ThemedText>

			<ThemedText style={styles.subHeaderText}>
				Voici quelques villes dans ce fuseau horaire :
			</ThemedText>

			<CitiesInZone timezone={timezone} />

			<ThemedText style={styles.subHeaderText}>
				Les villes où il est actuellement 18h00 :
			</ThemedText>
		</ThemedSafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: 'center',
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
		maxHeight: 200,
	},
	citiesContainer: {
		paddingVertical: 8,
		paddingHorizontal: 12,
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
