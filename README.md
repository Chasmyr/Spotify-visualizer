# Spotify Visualizer

Visualisation en temps réel des caractéristiques audio d'un morceau Spotify — BPM, énergie, tonalité, valence et plus.

## Aperçu

> _Ajoute une capture d'écran ici après le premier lancement_

## Features

- Affichage en temps réel du morceau en cours de lecture
- Audio features : BPM, énergie, tonalité, valence, danceability
- Radar chart des 6 dimensions sonores
- Couleur d'accent dynamique selon l'énergie du morceau
- Mini player persistant en bas de l'écran
- Authentification OAuth 2.0 PKCE (sans backend)

## Stack

| Outil | Rôle |
|---|---|
| React 18 + Vite | UI + bundler |
| TypeScript strict | Typage complet, zéro `any` |
| React Router v6 | Navigation + route protégée |
| Tailwind CSS | Styles |
| Recharts | Radar chart |
| Zustand | State management global |
| Spotify Web API | Données player |

## Installation

```bash
git clone https://github.com/ton-user/spotify-visualizer
cd spotify-visualizer
npm install
```

Crée un fichier `.env` à la racine :

```
VITE_SPOTIFY_CLIENT_ID=ton_client_id
VITE_REDIRECT_URI=http://127.0.0.1:5173/callback
```

> Obtiens ton `Client ID` sur [developer.spotify.com](https://developer.spotify.com/dashboard) et ajoute `http://127.0.0.1:5173/callback` comme Redirect URI.

```bash
npm run dev
```

## Déploiement

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Déploie sur Vercel
2. Ajoute les variables d'environnement dans le dashboard Vercel
3. Ajoute l'URL de prod comme Redirect URI dans ton Spotify Dashboard

## Ce que j'ai appris

- Flow OAuth 2.0 PKCE sans backend (Proof Key for Code Exchange)
- TypeScript strict : types génériques, unions, type guards sur les réponses API
- Polling optimisé : progression mise à jour sans re-render complet grâce à Zustand
- Simulation déterministe de données : même ID → mêmes valeurs via un générateur pseudo-aléatoire seedé
- Visualisation de données avec Recharts (radar chart responsive)
