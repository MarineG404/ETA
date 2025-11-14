import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Drink } from '@/types/alcohol';
import { getColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

interface DrinksListProps {
	drinks: Drink[];
	onRemoveDrink: (id: string) => void;
}

export const DrinksList: React.FC<DrinksListProps> = ({ drinks, onRemoveDrink }) => {
	const { isDark } = useTheme();
	const COLORS = getColors(isDark);

	if (drinks.length === 0) return null;

	return (
		<View style={[styles.section, { backgroundColor: COLORS.cardBackground }]}>
			<Text style={[styles.sectionTitle, { color: COLORS.text }]}>📋 Consommations</Text>
			{drinks.map(drink => (
				<View key={drink.id} style={[styles.drinkItem, { backgroundColor: COLORS.background }]}>
					<View style={styles.drinkInfo}>
						<Text style={[styles.drinkName, { color: COLORS.text }]}>{drink.name}</Text>
						<Text style={[styles.drinkDetails, { color: COLORS.textSecondary }]}>
							{drink.volume}cl • {drink.alcohol}% • {drink.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
						</Text>
					</View>
					<TouchableOpacity onPress={() => onRemoveDrink(drink.id)}>
						<Text style={styles.removeButton}>✕</Text>
					</TouchableOpacity>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 12,
	},
	drinkItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 12,
		padding: 12,
		marginBottom: 8,
	},
	drinkInfo: {
		flex: 1,
	},
	drinkName: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	drinkDetails: {
		fontSize: 13,
	},
	removeButton: {
		fontSize: 24,
		color: '#F44336',
		padding: 4,
	},
});
