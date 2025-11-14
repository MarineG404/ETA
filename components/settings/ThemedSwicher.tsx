import { useTheme } from '@/context/ThemeContext';
import { getColors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ThemeMode = 'auto' | 'light' | 'dark';

const options: { key: ThemeMode; label: string }[] = [
	{ key: 'auto', label: 'Auto' },
	{ key: 'light', label: 'Clair' },
	{ key: 'dark', label: 'Sombre' },
];

export const ThemedSwitcher = () => {
	const { theme, setTheme, isDark } = useTheme();
	const colors = getColors(isDark); // ✅ Utilise isDark du ThemeContext

	return (
		<View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
			<Text style={[styles.title, { color: colors.text }]}>🎨 Thème de l'application</Text>
			<View style={styles.optionsContainer}>
				{options.map((o) => (
					<TouchableOpacity
						key={o.key}
						onPress={() => setTheme(o.key)}
						style={[
							styles.option,
							{ borderColor: theme === o.key ? colors.primary : colors.textSecondary },
							theme === o.key && { backgroundColor: colors.background },
						]}
						accessibilityRole="button"
						accessibilityLabel={o.label}
						accessibilityState={{ selected: theme === o.key }}
					>
						<View
							style={[
								styles.radio,
								{ borderColor: colors.textSecondary },
								theme === o.key && {
									backgroundColor: colors.primary,
									borderColor: colors.primary,
								},
							]}
						/>
						<Text style={[styles.label, { color: colors.text }]}>{o.label}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		borderRadius: 12,
		margin: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	optionsContainer: {
		gap: 12,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 2,
		padding: 12,
		paddingHorizontal: 16,
		minHeight: 50,
		borderRadius: 8,
	},
	radio: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#9ca3af',
		marginRight: 12,
	},
	label: {
		fontSize: 16,
		fontWeight: '500',
	},
});
