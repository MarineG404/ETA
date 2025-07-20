import { useEffect, useState } from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import moment from 'moment-timezone';
import { ThemedSafeAreaView } from '@/components/Themed/ThemedSafeAreaView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { getCurrentTimezone } from '@/utils/getCurrentTimezone';


export default function HomeScreen() {
	const [timezone, setTimezone] = useState('');
	const [localTime, setLocalTime] = useState('');
	useEffect(() => {
		const tz = getCurrentTimezone();
		console.log('Fuseau:', tz);

		console.log('Heure locale (moment local):', moment().format('HH:mm'));
		console.log('Heure en tz:', moment().tz(tz).format('HH:mm'));

		setTimezone(tz);
		setLocalTime(moment().tz(tz).format('HH:mm'));
	}, []);


	const containerStyle: ViewStyle = {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	};

	return (
		<ThemedSafeAreaView style={containerStyle} lightColor="#fff" darkColor="#000">
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ThemedText>Coucou ! Il est {localTime} sur le fuseau {timezone}</ThemedText>
			</ScrollView>
		</ThemedSafeAreaView>
	);
}
