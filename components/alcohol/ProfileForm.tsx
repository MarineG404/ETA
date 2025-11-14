import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { UserProfile } from '@/types/alcohol';
import { getColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

interface ProfileFormProps {
	profile: UserProfile;
	onProfileChange: (profile: UserProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onProfileChange }) => {
	const { isDark } = useTheme();
	const COLORS = getColors(isDark);

	return (
		<View style={[styles.section, { backgroundColor: COLORS.cardBackground }]}>
			<Text style={[styles.sectionTitle, { color: COLORS.text }]}>👤 Ton profil</Text>

			<View style={styles.genderButtons}>
				<TouchableOpacity
					style={[
						styles.genderButton,
						{ backgroundColor: COLORS.background, borderColor: COLORS.cardBackground },
						profile.gender === 'male' && { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary }
					]}
					onPress={() => onProfileChange({ ...profile, gender: 'male' })}
				>
					<Text style={[styles.genderButtonText, { color: COLORS.text }]}>👨 Homme</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.genderButton,
						{ backgroundColor: COLORS.background, borderColor: COLORS.cardBackground },
						profile.gender === 'female' && { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary }
					]}
					onPress={() => onProfileChange({ ...profile, gender: 'female' })}
				>
					<Text style={[styles.genderButtonText, { color: COLORS.text }]}>👩 Femme</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.inputRow}>
				<View style={styles.inputGroup}>
					<Text style={[styles.label, { color: COLORS.textSecondary }]}>Poids (kg)</Text>
					<TextInput
						style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.textSecondary + '40' }]}
						keyboardType="numeric"
						value={profile.weight ? profile.weight.toString() : ''}
						onChangeText={(text) => onProfileChange({ ...profile, weight: parseFloat(text) || 0 })}
						placeholder="70"
						placeholderTextColor={COLORS.textSecondary}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={[styles.label, { color: COLORS.textSecondary }]}>Taille (cm)</Text>
					<TextInput
						style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.textSecondary + '40' }]}
						keyboardType="numeric"
						value={profile.height ? profile.height.toString() : ''}
						onChangeText={(text) => onProfileChange({ ...profile, height: parseFloat(text) || 0 })}
						placeholder="175"
						placeholderTextColor={COLORS.textSecondary}
					/>
				</View>
			</View>
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
	genderButtons: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 12,
	},
	genderButton: {
		flex: 1,
		padding: 12,
		borderRadius: 12,
		alignItems: 'center',
		borderWidth: 2,
	},
	genderButtonText: {
		fontSize: 16,
		fontWeight: '600',
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
	},
});
