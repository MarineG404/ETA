import React, { useEffect, useState } from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import moment from 'moment-timezone';
import { ThemedSafeAreaView } from '@/components/Themed/ThemedSafeAreaView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { getCurrentTimezone } from '@/utils/getCurrentTimezone';
import { getTimezoneData } from '@/utils/getTimezoneData';

export default function HomeScreen() {
	const [timezone, setTimezone] = useState('');
	const [localTime, setLocalTime] = useState('');

	useEffect(() => {
		const tz = getCurrentTimezone();
		setTimezone(tz);
		setLocalTime(moment().tz(tz).format('HH:mm'));

		const interval = setInterval(() => {
			setLocalTime(moment().tz(tz).format('HH:mm'));
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	const containerStyle: ViewStyle = {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	};

	const CitiesInZone = ({ timezone }: { timezone: string }) => {
		const cities = getTimezoneData(timezone);

		if (cities.length === 0) {
			return <ThemedText>Aucune ville trouvée pour ce fuseau.</ThemedText>;
		}

		return (
			<ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
				{cities.map(({ city, country }, index) => (
					<ThemedText key={index}>
						{city} {country ? `- ${country}` : ''}
					</ThemedText>
				))}
			</ScrollView>
		);
	};

	return (
		<ThemedSafeAreaView style={containerStyle} lightColor="#fff" darkColor="#000">
			<ThemedText style={{ fontSize: 18, marginBottom: 8 }}>
				Coucou ! Il est {localTime} sur le fuseau {timezone}
			</ThemedText>
			<CitiesInZone timezone={timezone} />
		</ThemedSafeAreaView>
	);
}
