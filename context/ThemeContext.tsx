import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'auto';

type ThemeContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const systemColorScheme = useColorScheme();
	const [theme, setThemeState] = useState<Theme>('auto');

	// Charger le thème sauvegardé au démarrage
	useEffect(() => {
		const loadTheme = async () => {
			try {
				const savedTheme = await AsyncStorage.getItem('theme');
				if (savedTheme) {
					setThemeState(savedTheme as Theme);
				}
			} catch (error) {
				console.error('Erreur chargement thème:', error);
			}
		};
		loadTheme();
	}, []);

	// Sauvegarder le thème quand il change
	const setTheme = async (newTheme: Theme) => {
		try {
			await AsyncStorage.setItem('theme', newTheme);
			setThemeState(newTheme);
		} catch (error) {
			console.error('Erreur sauvegarde thème:', error);
		}
	};

	// Déterminer si le mode sombre est actif
	const isDark = theme === 'auto' ? systemColorScheme === 'dark' : theme === 'dark';

	return (
		<ThemeContext.Provider value={{ theme, setTheme, isDark }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return context;
};
