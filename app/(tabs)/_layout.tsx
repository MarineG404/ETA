import { Tabs } from "expo-router";
import React from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";

export default function TabLayout() {
	const { isDark } = useTheme();
	const colors = getColors(isDark);

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: colors.cardBackground,
					borderTopColor: colors.textSecondary + "30",
				},
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.textSecondary,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Apéro",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "beer" : "beer-outline"}
							size={28}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="calculator"
				options={{
					title: "Taux",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "calculator" : "calculator-outline"}
							size={28}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="settings"
				options={{
					title: "Paramètres",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "settings" : "settings-outline"}
							size={28}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
