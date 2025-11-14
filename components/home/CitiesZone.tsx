import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { CitiesCard } from '@/components/Cities/CitiesCard';

type CityData = {
	city: string;
	country?: string;
	timezone: string;
	specials: { type: string; name: string }[];
};

type CitiesZoneProps = {
	cities: CityData[];
};

export const CitiesZone: React.FC<CitiesZoneProps> = ({ cities }) => {
	return (
		<View style={styles.container}>
			<FlatList
				data={cities}
				keyExtractor={(item) => item.city}
				renderItem={({ item }) => <CitiesCard city={item} />}
				contentContainerStyle={styles.list}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	list: {
		padding: 16,
		gap: 16,
	},
});
