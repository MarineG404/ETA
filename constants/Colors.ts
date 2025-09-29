import { useColorScheme } from "react-native";


export const COLORS_LIGHT = {
	primary: "#FF6B35",        // Orange/corail vif pour les boutons
	secondary: "#8B4513",      // Brun caramel pour textes secondaires
	background: "#FFF8E7",     // Crème très clair, mousse de bière
	cardBackground: "#FFFFFF", // Blanc pur pour les cartes
	text: "#2C1810",           // Brun très foncé pour texte
	textSecondary: "#8B6F47",  // Brun moyen pour secondaire
	accent: "#FFFFFF",         // Blanc pur pour les bulles
};

export const COLORS_DARK = {
	primary: "#9D2235",
	secondary: "#B8860B",
	background: "#2A0F14",     // Bordeaux très foncé mais clairement ROUGE
	cardBackground: "#1A0A0D", // Noir-prune pour contraste
	text: "#FAFAFA",
	textSecondary: "#A39783",
	accent: "#C77DFF",
};

export const useAppColors = () => {
	const scheme = useColorScheme(); // 'light' | 'dark'
	return scheme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
};
