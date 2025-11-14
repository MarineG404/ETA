import { useTheme } from '@/context/ThemeContext';
import { ThemedSwitcher } from '@/components/settings/ThemedSwicher';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getColors } from '@/constants/Colors';

export default function SettingsScreen() {
	const { isDark } = useTheme();
	const colors = getColors(isDark); 

	return (
		<ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
			<View style={styles.header}>
				<Text style={[styles.headerTitle, { color: colors.text }]}>Paramètres</Text>
				<Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
					Personnalise ton expérience ETA
				</Text>
			</View>

			<ThemedSwitcher />

			<View style={styles.footer}>
				<Text style={[styles.footerText, { color: colors.textSecondary }]}>
					🍻 ETA - Estimate Time of Apero
				</Text>
				<Text style={[styles.footerText, { color: colors.textSecondary }]}>
					Version 1.0.0
				</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		padding: 20,
		paddingTop: 60,
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	headerSubtitle: {
		fontSize: 16,
	},
	footer: {
		alignItems: 'center',
		padding: 20,
		marginTop: 40,
	},
	footerText: {
		fontSize: 14,
		marginVertical: 4,
	},
});
