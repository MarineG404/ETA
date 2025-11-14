import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { getBACStatus } from '@/utils/alcoholCalculator';

type Prediction = { time: Date; bac: number };
type Props = { predictions?: Prediction[] };

export const PhaseNotifier: React.FC<Props> = ({ predictions }) => {
	useEffect(() => {
		let mounted = true;
		const registerAndSchedule = async () => {
			try {
				const { status: existing } = await Notifications.getPermissionsAsync();
				let finalStatus = existing;
				if (existing !== 'granted') {
					const { status } = await Notifications.requestPermissionsAsync();
					finalStatus = status;
				}
				if (finalStatus !== 'granted') return;

				// Annule les notifications planifiées créées précédemment
				await Notifications.cancelAllScheduledNotificationsAsync();

				if (!predictions?.length) return;

				// Groupe par changement de statut et schedule
				const segs: { status: { text: string; color: string }; start: Date }[] = [];
				let prevStatus = getBACStatus(predictions[0].bac);
				let start = predictions[0].time;
				for (let i = 1; i < predictions.length; i++) {
					const s = getBACStatus(predictions[i].bac);
					if (s.text !== prevStatus.text) {
						segs.push({ status: prevStatus, start });
						prevStatus = s;
						start = predictions[i].time;
					}
				}
				segs.push({ status: prevStatus, start });

				for (const seg of segs) {
					const when = seg.start;
					const deltaMs = when.getTime() - Date.now();
					if (deltaMs <= 0) continue;

					// schedule in seconds to satisfy expo-notifications typings
					const seconds = Math.max(1, Math.ceil(deltaMs / 1000));

					await Notifications.scheduleNotificationAsync({
						content: {
							title: `Phase : ${seg.status.text}`,
							body: `Passage en ${seg.status.text} à ${when.toLocaleTimeString('fr-FR', {
								hour: '2-digit',
								minute: '2-digit',
							})}`,
							data: { type: 'phase_change', status: seg.status.text },
						},
						trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, repeats: false }, // include required 'type'
					});
				}
			} catch (e) {
				// silent
			}
		};

		if (mounted) registerAndSchedule();
		return () => {
			mounted = false;
		};
	}, [predictions]);

	return null;
};
