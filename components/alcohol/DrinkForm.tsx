import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Drink } from '@/types/alcohol';
import { useTheme } from '@/context/ThemeContext';
import { getColors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';

type DrinkFormProps = {
	onAddDrink: (drink: Omit<Drink, 'id'>) => void;
};

export const DrinkForm: React.FC<DrinkFormProps> = ({ onAddDrink }) => {
	const { isDark } = useTheme();
	const colors = getColors(isDark);

	const [name, setName] = useState('');
	const [volume, setVolume] = useState('');
	const [alcohol, setAlcohol] = useState('');
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	// Boissons prédéfinies
	const presets = [
		{ name: '🍺 Bière', volume: 250, alcohol: 5 },
		{ name: '🍷 Vin', volume: 150, alcohol: 12 },
		{ name: '🥃 Whisky', volume: 40, alcohol: 40 },
		{ name: '🍹 Cocktail', volume: 200, alcohol: 15 },
	];

	const handlePreset = (preset: typeof presets[0]) => {
		setName(preset.name);
		setVolume(preset.volume.toString());
		setAlcohol(preset.alcohol.toString());
	};

	const handleSubmit = () => {
		if (!name || !volume || !alcohol) {
			alert('Remplis tous les champs !');
			return;
		}

		if (endTime <= startTime) {
			alert('L\'heure de fin doit être après l\'heure de début !');
			return;
		}

		onAddDrink({
			name,
			volume: parseFloat(volume),
			alcohol: parseFloat(alcohol),
			startTime,
			endTime,
		});

		// Reset
		setName('');
		setVolume('');
		setAlcohol('');
		setStartTime(new Date());
		setEndTime(new Date());
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
			<Text style={[styles.title, { color: colors.text }]}>🍺 Ajouter une boisson</Text>

			{/* Presets */}
			<View style={styles.presetsRow}>
				{presets.map((preset, idx) => (
					<TouchableOpacity
						key={idx}
						style={[styles.presetButton, { backgroundColor: colors.background }]}
						onPress={() => handlePreset(preset)}
					>
						<Text style={{ color: colors.text, fontSize: 12 }}>{preset.name}</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Nom */}
			<TextInput
				style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
				placeholder="Nom de la boisson"
				placeholderTextColor={colors.textSecondary}
				value={name}
				onChangeText={setName}
			/>

			{/* Volume et Alcool */}
			<View style={styles.row}>
				<TextInput
					style={[styles.input, styles.halfInput, { backgroundColor: colors.background, color: colors.text }]}
					placeholder="Volume (mL)"
					placeholderTextColor={colors.textSecondary}
					keyboardType="numeric"
					value={volume}
					onChangeText={setVolume}
				/>
				<TextInput
					style={[styles.input, styles.halfInput, { backgroundColor: colors.background, color: colors.text }]}
					placeholder="Alcool (%)"
					placeholderTextColor={colors.textSecondary}
					keyboardType="numeric"
					value={alcohol}
					onChangeText={setAlcohol}
				/>
			</View>

			{/* Heure de début */}
			<TouchableOpacity
				style={[styles.timeButton, { backgroundColor: colors.background }]}
				onPress={() => setShowStartPicker(true)}
			>
				<Text style={{ color: colors.text }}>
					⏰ Début : {startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
				</Text>
			</TouchableOpacity>

			{showStartPicker && (
				<DateTimePicker
					value={startTime}
					mode="time"
					display="default"
					onChange={(event, date) => {
						setShowStartPicker(Platform.OS === 'ios');
						if (date) setStartTime(date);
					}}
				/>
			)}

			{/* Heure de fin */}
			<TouchableOpacity
				style={[styles.timeButton, { backgroundColor: colors.background }]}
				onPress={() => setShowEndPicker(true)}
			>
				<Text style={{ color: colors.text }}>
					⏰ Fin : {endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
				</Text>
			</TouchableOpacity>

			{showEndPicker && (
				<DateTimePicker
					value={endTime}
					mode="time"
					display="default"
					onChange={(event, date) => {
						setShowEndPicker(Platform.OS === 'ios');
						if (date) setEndTime(date);
					}}
				/>
			)}

			{/* Bouton ajouter */}
			<TouchableOpacity
				style={[styles.addButton, { backgroundColor: colors.primary }]}
				onPress={handleSubmit}
			>
				<Text style={styles.addButtonText}>➕ Ajouter</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 20,
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	presetsRow: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 12,
		flexWrap: 'wrap',
	},
	presetButton: {
		padding: 8,
		borderRadius: 8,
		flex: 1,
		minWidth: 70,
		alignItems: 'center',
	},
	input: {
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
		fontSize: 16,
	},
	row: {
		flexDirection: 'row',
		gap: 8,
	},
	halfInput: {
		flex: 1,
	},
	timeButton: {
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
		alignItems: 'center',
	},
	addButton: {
		padding: 14,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 8,
	},
	addButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
