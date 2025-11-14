import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { UserProfile } from '@/types/alcohol';
import { useTheme } from '@/context/ThemeContext';
import { getColors } from '@/constants/Colors';

type ProfileFormProps = {
	profile: UserProfile;
	onProfileChange: (profile: UserProfile) => void;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onProfileChange }) => {
	const { isDark } = useTheme();
	const colors = getColors(isDark);

	return (
		<View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
			<Text style={[styles.title, { color: colors.text }]}>👤 Mon profil</Text>

			{/* Genre */}
			<View style={styles.row}>
				<TouchableOpacity
					style={[
						styles.genderButton,
						{ backgroundColor: profile.gender === 'male' ? colors.primary : colors.background }
					]}
					onPress={() => onProfileChange({ ...profile, gender: 'male' })}
				>
					<Text style={[styles.genderText, { color: profile.gender === 'male' ? '#fff' : colors.text }]}>
						👨 Homme
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.genderButton,
						{ backgroundColor: profile.gender === 'female' ? colors.primary : colors.background }
					]}
					onPress={() => onProfileChange({ ...profile, gender: 'female' })}
				>
					<Text style={[styles.genderText, { color: profile.gender === 'female' ? '#fff' : colors.text }]}>
						👩 Femme
					</Text>
				</TouchableOpacity>
			</View>

			{/* Poids et Taille */}
			<View style={styles.row}>
				<TextInput
					style={[styles.input, styles.halfInput, { backgroundColor: colors.background, color: colors.text }]}
					placeholder="Poids (kg)"
					placeholderTextColor={colors.textSecondary}
					keyboardType="numeric"
					value={profile.weight?.toString() || ''}
					onChangeText={(text) => onProfileChange({ ...profile, weight: parseFloat(text) || null })}
				/>
				<TextInput
					style={[styles.input, styles.halfInput, { backgroundColor: colors.background, color: colors.text }]}
					placeholder="Taille (cm)"
					placeholderTextColor={colors.textSecondary}
					keyboardType="numeric"
					value={profile.height?.toString() || ''}
					onChangeText={(text) => onProfileChange({ ...profile, height: parseFloat(text) || null })}
				/>
			</View>

			{/* Âge */}
			<TextInput
				style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
				placeholder="Âge (années)"
				placeholderTextColor={colors.textSecondary}
				keyboardType="numeric"
				value={profile.age?.toString() || ''}
				onChangeText={(text) => onProfileChange({ ...profile, age: parseFloat(text) || null })}
			/>

			<Text style={[styles.hint, { color: colors.textSecondary }]}>
				ℹ️ Ces données sont utilisées pour le calculateur d'alcoolémie (formule Watson)
			</Text>
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
	row: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 12,
	},
	genderButton: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	genderText: {
		fontSize: 16,
		fontWeight: '600',
	},
	input: {
		padding: 12,
		borderRadius: 8,
		fontSize: 16,
		marginBottom: 12,
	},
	halfInput: {
		flex: 1,
		marginBottom: 0,
	},
	hint: {
		fontSize: 12,
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 4,
	},
});
