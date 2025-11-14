import { useTheme } from '@/context/ThemeContext';
import { ThemedSwitcher } from '@/components/settings/ThemedSwicher';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getColors } from '@/constants/Colors';
import { Header } from '@/components/ui/header';

export default function SettingsScreen() {
	const { isDark } = useTheme();
	const colors = getColors(isDark);

	return (
		<Header
			emoji="⚙️"
			title="Paramètres"
			subtitle="Personnalise ton expérience ETA"
		>
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
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
		</Header>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		width: '100%',
	},
	scrollContent: {
		paddingBottom: 40,
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
