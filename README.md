# Stoemathlon

Dépôt regroupant les applications web du bar.

## Applications

- **Stoemathlon (tournois)** — application existante de gestion des tournois de bar
  (billard, etc.). Code actuel : `src/App.jsx`.
- **App Staff (RH / planning / tâches / stocks)** — en cours de cadrage.
  📄 **Toute la spécification est dans [`docs/`](./docs/README.md)** — commencer par
  [`docs/README.md`](./docs/README.md).

## Stack

React 19 · Vite 7 · Tailwind CSS · Firebase (Auth / Firestore / Storage / Hosting), région `europe-west1`.

## Démarrage

```bash
npm install
npm run dev
```

> ⚠️ À corriger avant de reprendre le développement : `tailwind.config.js` et `postcss.config.js`
> sont actuellement des *dossiers* contenant un fichier homonyme (donc jamais chargés), et
> `src/index.css` utilise la syntaxe Tailwind v3 alors que le projet installe Tailwind v4.
> Voir `docs/08-roadmap.md`, lot 0.
