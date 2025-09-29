import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CityData } from '@/utils/aperoDb';
import { COLORS } from '@/constants/Colors';
import { DateTime } from 'luxon';

type CitiesCardProps = {
	city: CityData;
};

export const CitiesCard: React.FC<CitiesCardProps> = ({ city }) => {
	const getSpecial = (type: 'cocktail' | 'mocktail' | 'food') =>
		city.specials.find(s => s.type === type)?.name || '—';
	const localTime = DateTime.now().setZone(city.timezone).toFormat('HH:mm');

	return (
		<View style={styles.card}>
			<Text style={styles.cityName}>{city.city}</Text>
			<Text style={styles.localTime}>🕒 {localTime}</Text>
			<Text style={styles.timezone}>Timezone: {city.timezone}</Text>
			<Text style={styles.special}>🍹 Cocktail: {getSpecial('cocktail')}</Text>
			<Text style={styles.special}>🥤 Mocktail: {getSpecial('mocktail')}</Text>
			<Text style={styles.special}>🍴 Food: {getSpecial('food')}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: COLORS.cardBackground,
		padding: 12,
		marginVertical: 6,
		borderRadius: 22,
	},
	cityName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.primary,
	},
	localTime: {
		fontSize: 14,
		color: COLORS.primary,
		marginBottom: 4,
	},
	timezone: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginBottom: 6,
	},
	special: {
		fontSize: 14,
		color: COLORS.text,
	},
});

export default CitiesCard;
