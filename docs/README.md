# Dossier de cadrage — Application Staff Bar

Ce dossier est la **mémoire du projet**. Toute la discussion produit/technique y est
consignée pour qu'on puisse reprendre le travail n'importe où (téléphone → Mac)
sans jamais repartir de zéro.

| Doc | Contenu |
|---|---|
| [01 — Vision & périmètre](./01-vision-et-perimetre.md) | À quoi sert l'appli, pour qui, principes directeurs |
| [02 — Modules fonctionnels](./02-modules.md) | Le détail de chaque brique (dashboard, pointage, planning, tâches, stocks, RH…) |
| [03 — Architecture technique](./03-architecture-technique.md) | Stack, hébergement, auth, hors-ligne, notifications |
| [04 — Modèle de données](./04-modele-de-donnees.md) | Collections Firestore, rôles, règles de sécurité |
| [05 — Design system](./05-design-system.md) | Direction artistique « futuriste sobre », couleurs, composants |
| [06 — Faisable / pas faisable](./06-faisable-vs-pas-faisable.md) | Les limites réelles, techniques et légales, à connaître avant de coder |
| [07 — Questions ouvertes](./07-questions-ouvertes.md) | Ce que j'ai besoin de savoir de ta part |
| [08 — Roadmap](./08-roadmap.md) | Découpage en lots livrables |

## État existant du repo (constaté le 21/08/2026)

- App **Stoemathlon** (tournois de bar : billard, etc.) — React 19 + Vite 7, `src/App.jsx` (~1470 lignes), code admin `Lune`.
- **Firebase déjà en place** : projet `stoemathlon-2025`, Realtime Database en `europe-west1`,
  Storage `stoemathlon-2025.firebasestorage.app`. Config en clair dans `src/Firebase.js`.
- Tailwind **v4** installé mais **mal configuré** : `tailwind.config.js` et `postcss.config.js`
  sont des *dossiers* contenant un fichier du même nom (donc jamais chargés), et `src/index.css`
  utilise la syntaxe v3 (`@tailwind base;`) alors que v4 attend `@import "tailwindcss";`
  et le plugin `@tailwindcss/postcss`. → **à corriger au premier commit sur le Mac**.
- Pas de `firebase.json`, pas de CI, pas de `.env`.
