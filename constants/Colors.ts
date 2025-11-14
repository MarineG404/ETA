export const COLORS_LIGHT = {
	primary: "#FF6B35",        // Orange/corail vif pour les boutons
	secondary: "#8B4513",      // Brun caramel pour textes secondaires
	background: "#FFF9F0",     // Crème plus chaud, légèrement doré
	cardBackground: "#FFFCF7", // Blanc cassé très doux
	text: "#2C1810",           // Brun très foncé pour texte
	textSecondary: "#8B6F47",  // Brun moyen pour secondaire
	accent: "#FFFFFF",         // Blanc pur pour les bulles
};

export const COLORS_DARK = {
	primary: "#9D2235",
	secondary: "#B8860B",
	background: "#2A0F14",     // Bordeaux très foncé mais clairement ROUGE
	cardBackground: "#1A0A0D", // Noir-prune pour contraste
	text: "#F5E6D3",           // Beige chaud au lieu de blanc pur
	textSecondary: "#B8A490",  // Beige grisé pour texte secondaire
	accent: "#E8B4B8",         // Rose poudré doux pour accents
};

export const getColors = (isDark: boolean) => {
	return isDark ? COLORS_DARK : COLORS_LIGHT;
};
