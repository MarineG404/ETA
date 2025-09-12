import { ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "../Themed/ThemedText";
import { getTimezoneData } from "@/utils/getTimezoneData";

export function CitiesZone ({ localTimezone }: { localTimezone: string }){

	const cities = getTimezoneData(localTimezone);

	return (
		<ScrollView contentContainerStyle={styles.citiesContainer} style={styles.citiesScroll}>
			{cities.map(({ city, country }, index) => (
				<ThemedText key={index} style={styles.cityText}>
					{city} {country ? `- ${country}` : ''}
				</ThemedText>
			))}
		</ScrollView>
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerText: {
		fontSize: 18,
		marginBottom: 12,
		textAlign: 'center',
	},
	subHeaderText: {
		fontSize: 16,
		marginBottom: 8,
		textAlign: 'center',
	},
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
	},
	noCityText: {
		fontSize: 14,
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 8,
	},
});
