import { ScrollView, StyleSheet, Text } from "react-native";
import { getTimezoneData } from "@/utils/getTimezoneData";
import { COLORS } from "@/constants/Colors";

export function CitiesZone({ localTimezone }: { localTimezone: string }) {

	const cities = getTimezoneData(localTimezone);

	return (
		<ScrollView contentContainerStyle={styles.citiesContainer} style={styles.citiesScroll}>
			{cities.map(({ city, country }, index) => (
				<Text key={index} style={styles.cityText}>
					{city} {country ? `- ${country}` : ''}
				</Text>
			))}
		</ScrollView>
	)
}


const styles = StyleSheet.create({
	citiesScroll: {
		width: '100%',
		maxHeight: 200,
	},
	citiesContainer: {
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	cityText: {
		fontSize: 14,
		marginBottom: 6,
		color: COLORS.text,
	},
	noCityText: {
		fontSize: 14,
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 8,
		color: COLORS.textSecondary,
	},
});
