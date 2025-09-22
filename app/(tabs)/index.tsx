import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { ThemedSafeAreaView } from '@/components/Themed/ThemedSafeAreaView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { getCurrentTimezone } from '@/utils/getCurrentTimezone';
import { DateTime } from "luxon";
import { CitiesZone } from '@/components/home/CitiesZone';
import { StyleSheet } from 'react-native';


export default function HomeScreen() {
	const aperoStart = '18:00';
	const aperoEnd = '19:30';
	const [localTimezone, setLocalTimezone] = useState('');
	const [localTime, setLocalTime] = useState('');

	useEffect(() => {
		const tz = getCurrentTimezone();
		setLocalTimezone(tz);
		setLocalTime(moment().tz(tz).format('HH:mm'));

		const interval = setInterval(() => {
			setLocalTime(moment().tz(tz).format('HH:mm'));
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const timeZoneList: string[] = moment.tz.names();
		timeZoneList.forEach((timezone) => {
			const hourStr = DateTime.now().setZone(timezone).toFormat('HH:mm');
			if (hourStr >= aperoStart && hourStr <= '19:59') {
				console.log(`Il est l'heure de l'apéro à ${timezone} (${hourStr})`);
			}
		});
	}, []);

	return (
		<ThemedSafeAreaView style={styles.container} lightColor="#fff" darkColor="#000">
			<ThemedText style={styles.headerText}>
				Coucou ! Il est actuellement {localTime} sur le fuseau {localTimezone}
			</ThemedText>

			<CitiesZone localTimezone={localTimezone} />

			<ThemedText style={styles.subHeaderText}>
				Les villes où il est actuellement 18h00 :
			</ThemedText>
		</ThemedSafeAreaView>
	);
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
