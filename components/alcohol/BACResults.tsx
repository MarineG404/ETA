import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BACResult } from '@/types/alcohol';
import { useTheme } from '@/context/ThemeContext';
import { getColors } from '@/constants/Colors';

type BACResultsProps = {
	result: BACResult;
};

export const BACResults: React.FC<BACResultsProps> = ({ result }) => {
	const { isDark } = useTheme();
	const colors = getColors(isDark);

	return (
		<View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
			<Text style={[styles.title, { color: colors.text }]}>📊 Résultats</Text>

			{/* Taux actuel */}
			<View style={[styles.mainResult, { backgroundColor: result.status.color + '20' }]}>
				<Text style={[styles.bacValue, { color: result.status.color }]}>
					{result.currentBAC.toFixed(2)} g/L
				</Text>
				<Text style={[styles.status, { color: result.status.color }]}>
					{result.status.text}
				</Text>
			</View>

			{/* Pic d'alcoolémie */}
			<View style={styles.infoRow}>
				<Text style={{ color: colors.textSecondary }}>📈 Pic maximal :</Text>
				<Text style={{ color: colors.text, fontWeight: 'bold' }}>
					{result.peakBAC.toFixed(2)} g/L à {result.peakTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
				</Text>
			</View>

			{/* Temps avant sobriété */}
			{result.soberTime && (
				<View style={styles.infoRow}>
					<Text style={{ color: colors.textSecondary }}>⏰ Sobre vers :</Text>
					<Text style={{ color: colors.text, fontWeight: 'bold' }}>
						{result.soberTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
					</Text>
				</View>
			)}

			{/* Avertissement */}
			<Text style={[styles.warning, { color: colors.textSecondary }]}>
				⚠️ Ces calculs sont indicatifs. Ne conduis jamais après avoir bu !
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
	mainResult: {
		padding: 20,
		borderRadius: 16,
		alignItems: 'center',
		marginBottom: 16,
	},
	bacValue: {
		fontSize: 48,
		fontWeight: 'bold',
	},
	status: {
		fontSize: 16,
		fontWeight: '600',
		marginTop: 8,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	warning: {
		fontSize: 12,
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 12,
	},
});
