import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types/alcohol';

type ProfileContextType = {
	profile: UserProfile;
	setProfile: (profile: UserProfile) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
	const [profile, setProfileState] = useState<UserProfile>({
		gender: null,
		weight: null,
		height: null,
		age: null,
	});

	// Charger le profil sauvegardé au démarrage
	useEffect(() => {
		const loadProfile = async () => {
			try {
				const savedProfile = await AsyncStorage.getItem('userProfile');
				if (savedProfile) {
					const parsed = JSON.parse(savedProfile);
					setProfileState(parsed);
				}
			} catch (error) {
				console.error('Erreur chargement profil:', error);
			}
		};
		loadProfile();
	}, []);

	// Sauvegarder le profil quand il change
	const setProfile = (newProfile: UserProfile) => {
		setProfileState(newProfile);
		AsyncStorage.setItem('userProfile', JSON.stringify(newProfile)).catch((error) => {
			console.error('Erreur sauvegarde profil:', error);
		});
	};

	return (
		<ProfileContext.Provider value={{ profile, setProfile }}>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfile = () => {
	const context = useContext(ProfileContext);
	if (!context) {
		throw new Error('useProfile must be used within ProfileProvider');
	}
	return context;
};
