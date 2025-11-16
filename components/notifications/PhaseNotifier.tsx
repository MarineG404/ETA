import React, { useEffect } from 'react';
import { getBACStatus } from '@/utils/alcoholCalculator';
import Constants from 'expo-constants';

// Pas d'import statique de expo-notifications
const isExpoGo = Constants.appOwnership === 'expo';

let Notifications: any = null;
if (!isExpoGo) {
    (async () => {
        try {
            const mod = await import('expo-notifications');
            Notifications = mod;
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                }),
            });
        } catch {
            console.log('⚠️ expo-notifications non disponible');
        }
    })();
}

type Prediction = { time: Date; bac: number };
type Props = { predictions?: Prediction[] };

export const PhaseNotifier: React.FC<Props> = ({ predictions }) => {
    useEffect(() => {
        let mounted = true;

        const schedulePhaseNotifications = async () => {
            if (isExpoGo) {
                console.log('🍺 Mode Expo Go: Notifications de phase simulées (dev)');
                if (predictions?.length) {
                    console.log(`📊 ${predictions.length} prédictions disponibles`);
                }
                return;
            }

            if (!Notifications) {
                console.log('⚠️ Notifications non disponibles');
                return;
            }

            try {
                // Demander permissions
                const { status } = await Notifications.requestPermissionsAsync();
                if (status !== 'granted') {
                    console.log('⚠️ Permission notifications refusée');
                    return;
                }

                // Annuler anciennes notifications
                await Notifications.cancelAllScheduledNotificationsAsync();

                if (!predictions?.length) return;

                // Regrouper par changement de statut
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

                // Planifier notifications pour chaque phase
                for (const seg of segs) {
                    const when = seg.start;
                    const deltaMs = when.getTime() - Date.now();
                    if (deltaMs <= 0) continue;

                    const seconds = Math.max(1, Math.ceil(deltaMs / 1000));

                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: `Phase : ${seg.status.text}`,
                            body: `Passage en ${seg.status.text} à ${when.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}`,
                            sound: true,
                            data: { type: 'phase_change', status: seg.status.text },
                        },
                        trigger: { seconds },
                    });

                    console.log(`✅ Notification planifiée: ${seg.status.text} dans ${Math.round(seconds / 60)}min`);
                }
            } catch (error) {
                console.log('⚠️ Erreur planification notifications:', error);
            }
        };

        if (mounted) {
            schedulePhaseNotifications();
        }

        return () => {
            mounted = false;
        };
    }, [predictions]);

    return null;
};
