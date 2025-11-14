import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/Colors";
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
	title: string;
	subtitle?: string;
	emoji?: string;
	children: ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, emoji, children }) => {
	const { isDark } = useTheme();
	const COLORS = getColors(isDark);

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<View style={styles.headerContainer}>
				<Text style={[styles.title, { color: COLORS.primary }]}>
					{emoji && `${emoji} `}{title}
				</Text>
				{subtitle && (
					<Text style={[styles.subtitle, { color: COLORS.secondary }]}>
						{subtitle}
					</Text>
				)}
			</View>
			{children}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		paddingBottom: 0,
	},
	headerContainer: {
		alignItems: 'center',
		width: '100%',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		paddingHorizontal: 16,
		marginBottom: 16,
	},
});
