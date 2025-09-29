// import { useTheme } from "@/context/ThemeContext";
// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// export default function SettingsScreen() {
// 	const { themeMode, setThemeMode, COLORS } = useTheme();

// 	return (
// 		<View style={[styles.container, { backgroundColor: COLORS.background }]}>
// 			<Text style={[styles.title, { color: COLORS.primary }]}>Theme</Text>

// 			{(["light", "dark", "auto"] as const).map((mode) => (
// 				<TouchableOpacity
// 					key={mode}
// 					style={[
// 						styles.button,
// 						{
// 							backgroundColor: themeMode === mode ? COLORS.primary : COLORS.cardBackground,
// 						},
// 					]}
// 					onPress={() => setThemeMode(mode)}
// 				>
// 					<Text
// 						style={{
// 							color: themeMode === mode ? COLORS.cardBackground : COLORS.text,
// 							fontWeight: "bold",
// 						}}
// 					>
// 						{mode.toUpperCase()}
// 					</Text>
// 				</TouchableOpacity>
// 			))}
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
// 	title: { fontSize: 24, marginBottom: 16 },
// 	button: {
// 		paddingVertical: 12,
// 		paddingHorizontal: 24,
// 		borderRadius: 8,
// 		marginVertical: 8,
// 		width: "60%",
// 		alignItems: "center",
// 	},
// });
