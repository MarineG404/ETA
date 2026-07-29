# 📌 ETA - Estimate Time of Apero

## 📖 Description

Application mobile React Native (Expo) avec deux fonctionnalités principales :

1. **🌍 Apéro dans le monde** — affiche en temps réel les villes où c'est actuellement l'heure de l'apéro (18h00 - 19h30), avec l'heure locale et la spécialité (cocktail, mocktail, plat) du pays.
2. **🍺 Calculateur d'alcoolémie** — estime le taux d'alcool dans le sang (BAC) à partir des boissons consommées et du profil de l'utilisateur, avec pic prévu, heure de sobriété estimée et notifications de changement de phase.

⚠️ Le calculateur est indicatif, basé sur des formules pharmacocinétiques standard (Watson, Widmark) — il ne remplace pas un éthylotest et ne doit jamais être utilisé pour décider de prendre le volant.

---

## 🚀 Fonctionnalités

- [x] Villes en heure d'apéro (18h00-19h30), mise à jour automatique
- [x] 62 villes dans 43 pays, avec spécialités locales (cocktails, mocktails, plats)
- [x] Calculateur de taux d'alcoolémie (BAC) basé sur le profil utilisateur (genre, poids, taille, âge)
- [x] Modélisation de l'absorption par boisson + élimination hépatique réaliste
- [x] Prédiction du BAC sur les prochaines heures, avec pic et heure de sobriété estimée
- [x] Notifications de changement de phase (via `expo-notifications`, hors Expo Go)
- [x] Historique des boissons persistant (AsyncStorage)
- [x] Profil utilisateur et thème (clair/sombre/auto) persistants
- [x] Navigation par onglets (Accueil / Calculateur / Paramètres)
- [ ] Paramètres de personnalisation des heures d'apéro

---

## 🛠️ Technologies utilisées

- **React Native** + **Expo** (Expo Router) - Framework mobile
- **TypeScript** - Typage statique
- **Luxon** - Gestion des dates/fuseaux horaires
- **React Navigation** - Thèmes et navigation par onglets
- **AsyncStorage** - Persistance locale (profil, thème, boissons)
- **expo-notifications** - Notifications de changement de phase BAC

Les données de villes (fuseaux, spécialités) sont statiques — pas de base de données embarquée, elles ne changent jamais à l'exécution.

---

## 📂 Structure du projet

```bash
ETA/
│── app/                        # Pages Expo Router
│   │── (tabs)/
│   │   │── index.tsx           # Accueil : villes à l'heure de l'apéro
│   │   │── calculator.tsx      # Calculateur d'alcoolémie
│   │   │── settings.tsx        # Profil + thème
│   │   └── _layout.tsx         # Layout des onglets
│   └── _layout.tsx             # Layout racine (thème, providers)
│── components/
│   │── Cities/CitiesCard.tsx   # Carte d'une ville (heure + spécialités)
│   │── alcohol/                # DrinkForm, DrinksList, BACResults
│   │── notifications/          # PhaseNotifier (notifications de phase BAC)
│   │── settings/                # ProfileForm, ThemedSwicher
│   └── ui/header.tsx           # Header commun aux écrans
│── constants/Colors.ts         # Palette clair/sombre
│── context/                    # ThemeContext, ProfileContext (AsyncStorage)
│── types/                       # Types partagés (alcohol.ts, city.ts)
│── utils/
│   │── apero.ts                # Filtre des villes à l'heure de l'apéro
│   │── alcoholCalculator.ts    # Modèle de calcul du BAC
│   │── citiesData.ts           # Données statiques villes/fuseaux/spécialités
│   └── getCurrentTimezone.ts   # Utilitaire fuseau horaire local
└── README.md
```

---

## ⚙️ Installation & utilisation

### 1. Cloner le projet

```bash
git clone https://github.com/MarineG404/ETA
cd ETA
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le projet

```bash
npx expo start
```

### 4. Tests sur appareil

- **iOS :** Scanner le QR code avec l'app Appareil photo
- **Android :** Scanner avec l'app Expo Go
- **Web :** Appuyer sur `w` dans le terminal

**Note :** les notifications de changement de phase (`expo-notifications`) ne fonctionnent pas dans Expo Go — il faut un build de développement (`expo run:android` / `expo run:ios`).

---

## 🌍 Villes incluses

L'app couvre **62 villes** dans **43 pays**, sur tous les continents (Europe, Amériques, Asie, Océanie, Afrique) — voir [`utils/citiesData.ts`](utils/citiesData.ts) pour la liste complète.

Chaque ville affiche sa spécialité locale (ex : French 75 🍸 et Croissant 🥐 pour la France).

---

## 🍺 Calculateur d'alcoolémie

Renseigne ton profil (genre, poids, taille, âge) dans **Paramètres**, puis ajoute tes boissons dans **Calculateur** (volume, degré d'alcool, heure de début/fin, ou via les préréglages rapides). L'app affiche :

- Le taux actuel (g/L) et son statut
- Le pic estimé et l'heure à laquelle il sera atteint
- Les phases prévues sur les prochaines heures
- L'heure de sobriété estimée

Le modèle simule le pool total d'alcool dans le corps : chaque boisson suit sa propre courbe d'absorption, mais l'élimination hépatique (~0,15 g/L/h) est appliquée une seule fois sur le total, comme le ferait réellement le foie.

---

## 📸 Captures d'écran

À venir

---

## 👥 Auteurs / contributeurs

- **GONNORD Marine** : Développement Full-Stack

---

## 📜 Licence

À venir

---

## 🔧 Développement

### Ajouter une nouvelle ville
Ajouter une entrée dans le tableau `CITIES` de [`utils/citiesData.ts`](utils/citiesData.ts) (ville, pays, fuseau IANA, spécialités cocktail/mocktail/food).

### Personnaliser l'heure d'apéro
Modifier les constantes dans [`utils/apero.ts`](utils/apero.ts) :
```typescript
const aperoStart = '18:00'; // Début apéro
const aperoEnd = '19:30';   // Fin apéro
```

### Ajuster le modèle de calcul du BAC
Les constantes physiologiques (densité de l'alcool, taux d'élimination, temps d'absorption) sont en tête de [`utils/alcoholCalculator.ts`](utils/alcoholCalculator.ts).
