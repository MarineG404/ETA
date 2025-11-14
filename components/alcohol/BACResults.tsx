import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { getBACStatus } from '@/utils/alcoholCalculator';

interface BACResultsProps {
	currentBAC: number;
	soberTime: Date | null;
}

export const BACResults: React.FC<BACResultsProps> = ({ currentBAC, soberTime }) => {
	const { isDark } = useTheme();
	const COLORS = getColors(isDark);
	const status = getBACStatus(currentBAC);

	return (
		<View style={styles.results}>
			<View style={[styles.bacCard, { backgroundColor: COLORS.cardBackground, borderColor: status.color }]}>
				<Text style={[styles.bacLabel, { color: COLORS.textSecondary }]}>Taux d'alcoolémie estimé</Text>
				<Text style={[styles.bacValue, { color: status.color }]}>
					{currentBAC.toFixed(2)} g/L
				</Text>
				<Text style={[styles.bacStatus, { color: status.color }]}>
					{status.text}
				</Text>
			</View>

			{soberTime && currentBAC > 0 && (
				<View style={[styles.soberCard, { backgroundColor: isDark ? '#1A3A1A' : '#E8F5E9' }]}>
					<Text style={[styles.soberLabel, { color: COLORS.text }]}>⏰ Sobriété estimée vers</Text>
					<Text style={styles.soberTime}>
						{soberTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
					</Text>
					<Text style={[styles.soberDate, { color: COLORS.textSecondary }]}>
						{soberTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
					</Text>
				</View>
			)}

			<View style={[styles.warning, { backgroundColor: isDark ? '#3A2A1A' : '#FFF3E0' }]}>
				<Text style={[styles.warningText, { color: isDark ? '#FFB74D' : '#E65100' }]}>
					⚠️ Ces calculs sont approximatifs. Ne conduis jamais après avoir bu !
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	results: {
		marginBottom: 40,
	},
	bacCard: {
		borderRadius: 16,
		padding: 24,
		alignItems: 'center',
		marginBottom: 16,
		borderWidth: 3,
	},
	bacLabel: {
		fontSize: 16,
		marginBottom: 8,
	},
	bacValue: {
		fontSize: 48,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	bacStatus: {
		fontSize: 18,
		fontWeight: '600',
	},
	soberCard: {
		borderRadius: 16,
		padding: 20,
		alignItems: 'center',
		marginBottom: 16,
	},
	soberLabel: {
		fontSize: 14,
		marginBottom: 8,
	},
	soberTime: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#4CAF50',
		marginBottom: 4,
	},
	soberDate: {
		fontSize: 14,
	},
	warning: {
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: '#FF9800',
	},
	warningText: {
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 20,
	},
});
