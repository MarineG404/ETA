import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Drink } from '@/types/alcohol';
import { getColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

interface DrinkFormProps {
	onAddDrink: (drink: Drink) => void;
}

export const DrinkForm: React.FC<DrinkFormProps> = ({ onAddDrink }) => {
	const { isDark } = useTheme();
	const COLORS = getColors(isDark);

	const [newDrink, setNewDrink] = useState({
		name: '',
		volume: '',
		alcohol: '',
	});

	const presets = [
		{ name: 'Bière 🍺', volume: 33, alcohol: 5 },
		{ name: 'Vin 🍷', volume: 15, alcohol: 12 },
		{ name: 'Pastis 🥃', volume: 4, alcohol: 45 },
		{ name: 'Whisky 🥃', volume: 4, alcohol: 40 },
	];

	const addDrink = () => {
		if (!newDrink.name || !newDrink.volume || !newDrink.alcohol) return;

		const drink: Drink = {
			id: Date.now().toString(),
			name: newDrink.name,
			volume: parseFloat(newDrink.volume),
			alcohol: parseFloat(newDrink.alcohol),
			time: new Date(),
		};

		onAddDrink(drink);
		setNewDrink({ name: '', volume: '', alcohol: '' });
	};

	const addPreset = (preset: typeof presets[0]) => {
		const drink: Drink = {
			id: Date.now().toString(),
			name: preset.name,
			volume: preset.volume,
			alcohol: preset.alcohol,
			time: new Date(),
		};
		onAddDrink(drink);
	};

	return (
		<View style={[styles.section, { backgroundColor: COLORS.cardBackground }]}>
			<Text style={[styles.sectionTitle, { color: COLORS.text }]}>🍹 Ajouter une boisson</Text>

			{/* Presets rapides */}
			<View style={styles.presets}>
				{presets.map((preset, index) => (
					<TouchableOpacity
						key={index}
						style={[styles.presetButton, { backgroundColor: COLORS.background }]}
						onPress={() => addPreset(preset)}
					>
						<Text style={[styles.presetText, { color: COLORS.text }]}>{preset.name}</Text>
					</TouchableOpacity>
				))}
			</View>

			<Text style={[styles.orText, { color: COLORS.textSecondary }]}>ou personnalisé :</Text>

			<TextInput
				style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.textSecondary + '40' }]}
				value={newDrink.name}
				onChangeText={(text) => setNewDrink({ ...newDrink, name: text })}
				placeholder="Ex: Bière, Vin, Cocktail..."
				placeholderTextColor={COLORS.textSecondary}
			/>

			<View style={styles.inputRow}>
				<View style={styles.inputGroup}>
					<Text style={[styles.label, { color: COLORS.textSecondary }]}>Volume (cl)</Text>
					<TextInput
						style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.textSecondary + '40' }]}
						keyboardType="numeric"
						value={newDrink.volume}
						onChangeText={(text) => setNewDrink({ ...newDrink, volume: text })}
						placeholder="33"
						placeholderTextColor={COLORS.textSecondary}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={[styles.label, { color: COLORS.textSecondary }]}>Alcool (%)</Text>
					<TextInput
						style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.textSecondary + '40' }]}
						keyboardType="numeric"
						value={newDrink.alcohol}
						onChangeText={(text) => setNewDrink({ ...newDrink, alcohol: text })}
						placeholder="5"
						placeholderTextColor={COLORS.textSecondary}
					/>
				</View>
			</View>

			<TouchableOpacity
				style={[styles.addButton, { backgroundColor: COLORS.primary }]}
				onPress={addDrink}
			>
				<Text style={styles.addButtonText}>➕ Ajouter</Text>
			</TouchableOpacity>
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
	presets: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginBottom: 12,
	},
	presetButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
	},
	presetText: {
		fontSize: 14,
		fontWeight: '500',
	},
	orText: {
		textAlign: 'center',
		fontSize: 14,
		marginBottom: 12,
	},
	inputRow: {
		flexDirection: 'row',
		gap: 12,
	},
	inputGroup: {
		flex: 1,
	},
	label: {
		fontSize: 14,
		marginBottom: 6,
		fontWeight: '500',
	},
	input: {
		borderRadius: 12,
		padding: 12,
		fontSize: 16,
		borderWidth: 1,
		marginBottom: 12,
	},
	addButton: {
		borderRadius: 12,
		padding: 14,
		alignItems: 'center',
	},
	addButtonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '600',
	},
});
