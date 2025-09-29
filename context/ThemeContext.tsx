import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { COLORS_LIGHT, COLORS_DARK } from "@/constants/Colors";

type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextProps {
	themeMode: ThemeMode;
	COLORS: typeof COLORS_LIGHT;
	setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
	themeMode: "auto",
	COLORS: COLORS_LIGHT,
	setThemeMode: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const systemScheme = useColorScheme(); // 'light' | 'dark'
	const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
	const [COLORS, setCOLORS] = useState(COLORS_LIGHT);

	// Charger le choix de l'utilisateur au démarrage
	useEffect(() => {
		const loadTheme = async () => {
			const saved = await AsyncStorage.getItem("@themeMode");
			if (saved === "light" || saved === "dark" || saved === "auto") {
				setThemeModeState(saved);
			}
		};
		loadTheme();
	}, []);

	// Mettre à jour la palette à chaque changement
	useEffect(() => {
		const mode = themeMode === "auto" ? systemScheme : themeMode;
		setCOLORS(mode === "dark" ? COLORS_DARK : COLORS_LIGHT);
	}, [themeMode, systemScheme]);

	const setThemeMode = async (mode: ThemeMode) => {
		setThemeModeState(mode);
		await AsyncStorage.setItem("@themeMode", mode);
	};

	return (
		<ThemeContext.Provider value={{ themeMode, COLORS, setThemeMode }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Hook pratique
export const useTheme = () => useContext(ThemeContext);
