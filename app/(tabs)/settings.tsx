import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/context/ProfileContext';
import { ThemedSwitcher } from '@/components/settings/ThemedSwicher';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getColors } from '@/constants/Colors';
import { Header } from '@/components/ui/header';
import { ProfileForm } from '@/components/settings/ProfileForm';

export default function SettingsScreen() {
	const { isDark } = useTheme();
	const colors = getColors(isDark);
	const { profile, setProfile } = useProfile();
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

				<View style={styles.spacer} />

				<ProfileForm profile={profile} onProfileChange={setProfile} />

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
	spacer: {
		height: 12, 
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
