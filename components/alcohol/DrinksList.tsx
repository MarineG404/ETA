import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Drink } from '@/types/alcohol';
import { useTheme } from '@/context/ThemeContext';
import { getColors } from '@/constants/Colors';

type DrinksListProps = {
	drinks: Drink[];
	onRemoveDrink: (id: string) => void;
};

export const DrinksList: React.FC<DrinksListProps> = ({ drinks, onRemoveDrink }) => {
	const { isDark } = useTheme();
	const COLORS = getColors(isDark);

	if (drinks.length === 0) {
		return (
			<View style={[styles.emptyContainer, { backgroundColor: COLORS.cardBackground }]}>
				<Text style={{ color: COLORS.textSecondary, fontStyle: 'italic' }}>
					Aucune boisson ajoutée
				</Text>
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: COLORS.cardBackground }]}>
			<Text style={[styles.title, { color: COLORS.text }]}>📋 Mes boissons ({drinks.length})</Text>
			{drinks.map((drink) => (
				<View key={drink.id} style={[styles.drinkItem, { backgroundColor: COLORS.background }]}>
					<View style={styles.drinkInfo}>
						<Text style={[styles.drinkName, { color: COLORS.text }]}>{drink.name}</Text>
						<Text style={[styles.drinkDetails, { color: COLORS.textSecondary }]}>
							{drink.volume}ml • {drink.alcohol}% • {drink.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} → {drink.endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
						</Text>
					</View>
					<TouchableOpacity onPress={() => onRemoveDrink(drink.id)}>
						<Text style={[styles.deleteButton, { color: COLORS.primary }]}>🗑️</Text>
					</TouchableOpacity>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 20,
		marginBottom: 16,
	},
	emptyContainer: {
		padding: 16,
		borderRadius: 20,
		alignItems: 'center',
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	drinkItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
		borderRadius: 8,
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
		fontSize: 14,
	},
	deleteButton: {
		fontSize: 24,
		marginLeft: 12,
	},
});
