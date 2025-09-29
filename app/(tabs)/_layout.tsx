import { useAppColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
	const COLORS = useAppColors(); // hook à l'intérieur du composant

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: COLORS.background,   // fond du tab bar
					borderTopColor: COLORS.primary,       // barre de séparation
					borderTopWidth: 2,                    // épaisseur de la barre
					elevation: 0,                          // supprime shadow Android
					shadowOpacity: 0,                       // supprime shadow iOS
				},
				tabBarActiveTintColor: COLORS.primary,   // icônes actives
				tabBarInactiveTintColor: COLORS.secondary, // icônes inactives
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
