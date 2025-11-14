import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BACResult } from '@/types/alcohol';
import { useTheme } from '@/context/ThemeContext';
import { getColors } from '@/constants/Colors';
import { getBACStatus } from '@/utils/alcoholCalculator';

type Prediction = { time: Date; bac: number };

type BACResultsProps = {
	result: BACResult;
	predictions?: Prediction[]; // nouveau
};

export const BACResults: React.FC<BACResultsProps> = ({ result, predictions = [] }) => {
	const { isDark } = useTheme();
	const colors = getColors(isDark);

	const peakStatus = getBACStatus(result.peakBAC);

	// Regroupe les prédictions consécutives par même status
	const segments = React.useMemo(() => {
		if (!predictions.length) return [] as { status: { text: string; color: string }; start: Date; end: Date }[];

		const segs: { status: { text: string; color: string }; start: Date; end: Date }[] = [];
		let prevStatus = getBACStatus(predictions[0].bac);
		let start = predictions[0].time;

		for (let i = 1; i < predictions.length; i++) {
			const s = getBACStatus(predictions[i].bac);
			if (s.text !== prevStatus.text) {
				// close previous
				segs.push({ status: prevStatus, start, end: predictions[i - 1].time });
				prevStatus = s;
				start = predictions[i].time;
			}
		}
		// push last
		segs.push({ status: prevStatus, start, end: predictions[predictions.length - 1].time });

		return segs;
	}, [predictions]);

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

			{/* Pic d'alcoolémie (inchangé, avec statut entre parenthèses) */}
			<View style={styles.infoRow}>
				<Text style={[styles.infoLabel, { color: colors.textSecondary }]}>📈 Pic maximal :</Text>

				<View style={styles.infoValueContainer}>
					<Text
						style={[styles.infoValue, { color: colors.text, fontWeight: 'bold' }]}
						numberOfLines={2}
						ellipsizeMode="tail"
					>
						{result.peakBAC.toFixed(2)} g/L à {result.peakTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
						{peakStatus && (
							<Text style={{ color: peakStatus.color }}>{` - (${peakStatus.text})`}</Text>
						)}
					</Text>
				</View>
			</View>

			{/* Phases prévues (regroupées) */}
			{segments.length > 0 && (
				<View style={[styles.infoBlock, { borderColor: colors.textSecondary + '30' }]}>
					<Text style={[styles.infoLabel, { color: colors.textSecondary }]}>🕒 Phases prévues</Text>
					{segments.map((seg, idx) => (
						<View key={idx} style={styles.phaseRow}>
							<View style={styles.phaseDot}>
								<Text style={{ color: seg.status.color }}>{'●'}</Text>
							</View>
							<Text
								style={[styles.phaseText, { color: colors.text }]}
								numberOfLines={1}
								ellipsizeMode="tail"
							>
								{seg.status.text} — {seg.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
								{seg.start.getTime() !== seg.end.getTime() ? ` → ${seg.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : ''}
							</Text>
						</View>
					))}
				</View>
			)}

			{/* Temps avant sobriété */}
			{result.soberTime && (
				<View style={styles.infoRow}>
					<Text style={[styles.infoLabel, { color: colors.textSecondary }]}>⏰ Sobre vers :</Text>
					<View style={styles.infoValueContainer}>
						<Text style={[styles.infoValue, { color: colors.text, fontWeight: 'bold' }]}>
							{result.soberTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
						</Text>
					</View>
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
		alignItems: 'center',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	infoLabel: {
		width: 120,
		fontSize: 14,
	},
	infoValueContainer: {
		flex: 1,
		minWidth: 0,
	},
	infoValue: {
		flexWrap: 'wrap',
		flexShrink: 1,
		fontSize: 14,
	},
	infoBlock: {
		paddingVertical: 10,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#eee',
		marginTop: 10,
		marginBottom: 8,
	},
	phaseRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 6,
	},
	phaseDot: {
		width: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	phaseText: {
		flex: 1,
		fontSize: 14,
	},
	warning: {
		fontSize: 12,
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 12,
	},
});
