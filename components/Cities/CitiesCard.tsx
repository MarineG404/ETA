import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DateTime } from 'luxon';
import { useTheme } from '@/context/ThemeContext';
import { getColors } from '@/constants/Colors';

type CityData = {
	city: string;
	timezone: string;
	specials: { type: string; name: string }[];
};

type CitiesCardProps = {
	city: CityData;
};

export const CitiesCard: React.FC<CitiesCardProps> = ({ city }) => {
	const { isDark } = useTheme();
	const colors = getColors(isDark);

	const localTime = DateTime.now().setZone(city.timezone).toFormat('HH:mm');

	const cocktail = city.specials.find((s) => s.type === 'cocktail')?.name || '🍹 Cocktail';
	const mocktail = city.specials.find((s) => s.type === 'mocktail')?.name || '🥤 Mocktail';
	const food = city.specials.find((s) => s.type === 'food')?.name || '🍴 Plat';

	return (
		<View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
			<View style={styles.header}>
				<Text style={[styles.cityName, { color: colors.text }]}>{city.city}</Text>
				<Text style={[styles.time, { color: colors.primary }]}>{localTime}</Text>
			</View>

			<View style={styles.specialsContainer}>
				<Text style={[styles.specialText, { color: colors.text }]}>🍸 {cocktail}</Text>
				<Text style={[styles.specialText, { color: colors.text }]}>🥤 {mocktail}</Text>
				<Text style={[styles.specialText, { color: colors.text }]}>🍴 {food}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	cityName: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	time: {
		fontSize: 18,
		fontWeight: '600',
	},
	specialsContainer: {
		gap: 4,
	},
	specialText: {
		fontSize: 15,
		paddingVertical: 2,
	},
});
