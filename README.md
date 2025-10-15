# 📌 ETA - Estimate Time of Apero

## 📖 Description

Application mobile React Native qui détermine en temps réel les villes du monde où il est actuellement l'heure de l'apéro (18h00 - 19h30) !

L'app utilise une base de données SQLite avec des fuseaux horaires internationaux et affiche pour chaque ville :
- L'heure locale actuelle
- Le cocktail, mocktail et plat typique du pays
- Mise à jour automatique toutes les minutes

Parfait pour savoir où trinquer virtuellement avec le monde entier ! 🍻

---

## 🚀 Fonctionnalités

- [x] Affichage des villes en heure d'apéro (18h00-19h30)
- [x] Base de données SQLite avec 20+ villes internationales
- [x] Spécialités locales par pays (cocktails, mocktails, plats)
- [x] Mise à jour temps réel des heures locales
- [x] Interface avec thèmes clair/sombre/auto
- [x] Navigation par onglets (Home/Settings)
- [x] Gestion des fuseaux horaires avec Luxon
- [ ] Paramètres de personnalisation des heures d'apéro

---

## 🛠️ Technologies utilisées

- **React Native** + **Expo** - Framework mobile
- **TypeScript** - Typage statique
- **SQLite** (expo-sqlite) - Base de données locale
- **Luxon** - Gestion des dates/fuseaux horaires
- **Expo Router** - Navigation
- **React Navigation** - Thèmes et navigation
- **AsyncStorage** - Stockage des préférences

---

## 📂 Structure du projet

```bash
EstimatedTimeofApero/
│── app/ 		        # Pages Expo Router
│   │── (tabs)/         # Navigation par onglets
│   │   │── index.tsx   # Page d'accueil (villes apéro)
│   │   │── settings.tsx# Paramètres thème
│   │   └── _layout.tsx # Layout onglets
│   └── _layout.tsx     # Layout racine
│── assets/		        # Fichiers statiques
│   │── full_seed.sql   # Seed SQL complet
│   └── timezones_*.json# Données fuseaux horaires
│── components/ 	    # Composants réutilisables
│   │── Cities/         # Cartes des villes
│   └── home/           # Composants page d'accueil
│── constants/          # Constantes (couleurs, thèmes)
│── context/            # Context React (ThemeProvider)
│── utils/ 		        # Logique métier
│   │── apero.ts        # Logique heure apéro
│   │── aperoDb.ts      # Interface base de données
│   │── db.ts           # Gestion SQLite
│   └── getCurrentTimezone.ts # Utils timezone
└── README.md 	        # Cette documentation
```

---

## ⚙️ Installation & utilisation

### 1. Cloner le projet

```bash
git clone https://github.com/MarineG404/ETA
cd EstimatedTimeofApero
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Lancer le projet

```bash
npx expo start
```

**Note :** La base de données SQLite se crée automatiquement au premier lancement avec toutes les données nécessaires (villes, pays, fuseaux horaires, spécialités).

### 4. Tests sur appareil

- **iOS :** Scanner le QR code avec l'app Appareil photo
- **Android :** Scanner avec l'app Expo Go
- **Web :** Appuyer sur `w` dans le terminal

---

## 🌍 Villes incluses

L'app couvre **20+ villes** dans **10 pays** :
- 🇫🇷 France (Paris, Lyon)
- 🇺🇸 États-Unis (New York, Los Angeles)
- 🇬🇧 Royaume-Uni (London, Manchester)
- 🇩🇪 Allemagne (Berlin)
- 🇯🇵 Japon (Tokyo, Osaka)
- 🇮🇳 Inde (Mumbai, Delhi)
- 🇦🇺 Australie (Sydney)
- 🇧🇷 Brésil (São Paulo, Rio)
- 🇿🇦 Afrique du Sud (Johannesburg, Cape Town)
- 🇨🇦 Canada (Toronto, Montreal)

Chaque ville affiche ses spécialités locales (ex: French 75 🍸, Croissant 🥐 pour la France).

---

## 📸 Captures d'écran

À venir

---

## 👥 Auteurs / contributeurs

- **GONNORD Marine** : Développement Full-Stack (Backend SQLite + Frontend React Native)

---

## 📜 Licence

À venir

---

## 🔧 Développement

### Reset de la base de données
```typescript
// Dans l'app, la fonction resetDatabase() recrée toute la DB
import { resetDatabase } from '@/utils/aperoDb';
await resetDatabase();
```

### Ajouter une nouvelle ville
Modifier [`utils/aperoDb.ts`](utils/aperoDb.ts) dans la section seed cities et specials.

### Personnaliser l'heure d'apéro
Modifier les constantes dans [`utils/apero.ts`](utils/apero.ts) :
```typescript
const aperoStart = '18:00'; // Début apéro
const aperoEnd = '19:30';   // Fin apéro
```
