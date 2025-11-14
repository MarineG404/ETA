import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
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

	// Boissons prédéfinies maintenant avec durée par défaut (minutes)
	const presets = [
		{ name: '🍺 Bière', volume: 250, alcohol: 5, durationMin: 15 },
		{ name: '🍻 Triple', volume: 500, alcohol: 9, durationMin: 30 },
		{ name: '🍷 Vin', volume: 150, alcohol: 12, durationMin: 15 },
		{ name: '🥃 Whisky', volume: 40, alcohol: 40, durationMin: 10 },
		{ name: '🍹 Cocktail', volume: 200, alcohol: 15, durationMin: 20 },
	];

	const handlePreset = (preset: typeof presets[0]) => {
		const now = new Date();
		const start = new Date(now.getTime() - (preset.durationMin ?? 15) * 60 * 1000);

		setName(preset.name);
		setVolume(preset.volume.toString());
		setAlcohol(preset.alcohol.toString());
		setStartTime(start);
		setEndTime(now);
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

			{/* Presets en ligne (scroll horizontal) */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.presetsRow}
			>
				{presets.map((preset, idx) => (
					<TouchableOpacity
						key={idx}
						style={[styles.presetButton, { backgroundColor: colors.background }]}
						onPress={() => handlePreset(preset)}
					>
						<Text style={[styles.presetText, { color: colors.text }]} numberOfLines={2}>
							{preset.name} · {preset.durationMin}min
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>

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
	// presetsRow devient contentContainerStyle pour le ScrollView
	presetsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 8,
	},
	presetButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 12,
		marginRight: 8,
		minWidth: 90,
		alignItems: 'center',
		justifyContent: 'center',
	},
	presetText: {
		fontSize: 13,
		textAlign: 'center',
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
