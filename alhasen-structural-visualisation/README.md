# Alhasen Structural Visualisation

> Sous-projet du grand projet **2S Construction**

## Description

Application web interactive de visualisation 3D haute fidélité pour la conception et l'analyse de structures métalliques industrielles (hangars).

Développée avec **React Three Fiber** et **Google AI Studio (Gemini)**, cette application permet :

- Visualisation 3D temps réel d'une structure hangar
- Calculs d'ingénierie automatiques (poids, inertie, charges)
- Support des profils : **PRS**, **HEA**, **IPE**, **Treillis**
- Paramétrage complet : Largeur, Longueur, Hauteur, Pente toiture, Espacement travées
- Estimation du coût total en F CFA
- Affichage du poids total acier et poids/m²

## Aperçu

![Alhasen Structural 3D](https://aistudio.google.com/apps/fdf281eb-cd00-44bf-8218-53d9b791b60e)

## Accès à l'application

[Ouvrir l'application en ligne](https://aistudio.google.com/apps/fdf281eb-cd00-44bf-8218-53d9b791b60e)

## Technologies utilisées

- React 19 + TypeScript
- React Three Fiber / Three.js
- Vite
- Google AI Studio (Gemini 3.1 Pro)
- TailwindCSS

## Structure du projet

```
alhasen-structural-visualisation/
├── components/
│   ├── HangarModel.tsx      # Modèle 3D de la structure
│   └── Logo3D.tsx           # Logo 3D animé
├── utils/
│   └── engineering.ts       # Calculs d'ingénierie
├── App.tsx                  # Composant principal
├── index.html               # Point d'entrée HTML
├── index.tsx                # Point d'entrée React
├── types.ts                 # Types TypeScript
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Profils Supportés

| Profil | Description |
|--------|-------------|
| PRS    | Profilé Reconstitué Soudé (section en I sur mesure) |
| HEA    | Profilé européen à larges ailes (H plus large que haut) |
| IPE    | Profilé européen à ailes étroites (H plus haut que large) |
| Treillis | Ferme en treillis (membrures + diagonales) |

## Auteur

**2S Construction** - Gestion, estimation et outils métier

---
*Projet créé avec Google AI Studio - Gemini 3.1 Pro Preview*
