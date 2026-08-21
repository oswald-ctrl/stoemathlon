# 03 — Architecture technique

## Ce qui existe déjà (constaté dans le repo, donc pas de question à te poser)

- **React 19 + Vite 7**, JavaScript (pas TypeScript), `lucide-react` pour les icônes.
- **Tailwind CSS v4** installé — mais mal branché, à réparer (voir `docs/README.md`).
- **Firebase** projet `stoemathlon-2025`, région **europe-west1** (Belgique/Europe, parfait
  pour le RGPD), avec **Realtime Database** et **Storage** déjà provisionnés.
- Déploiement : rien de configuré (`firebase.json` absent). L'app tourne visiblement en local
  ou est déployée à la main.

## Stack cible recommandée

| Besoin | Choix | Pourquoi |
|---|---|---|
| Front | **React 19 + Vite**, en **PWA** | On garde l'existant. PWA = installable sur iPhone et Android, mise à jour instantanée, **pas de passage par l'App Store** |
| Langage | **TypeScript** | Sur une appli qui manipule heures, argent et stocks, le typage évite une classe entière de bugs. Migration progressive possible, fichier par fichier |
| UI | **Tailwind v4** + composants maison | Rapide, cohérent, adapté au design du doc 05 |
| Graphs | **Recharts** | Simple, léger, s'intègre bien à Tailwind |
| Routage | **React Router** | |
| Base de données | **Cloud Firestore** (et non la Realtime Database) | Requêtes filtrées (« les shifts de ce bar cette semaine »), règles de sécurité par document, **mode hors-ligne natif**, index. La RTDB actuelle convient à un tableau de tournoi, pas à une appli RH |
| Authentification | **Firebase Auth** (e-mail + mot de passe, + code PIN local) | Standard, gratuit, gère la réinitialisation de mot de passe |
| Fichiers | **Firebase Storage** | Photos de tâches, tickets Z, documents RH |
| Logique serveur | **Cloud Functions** | Clôture auto des pointages oubliés, envoi des notifications, calculs consolidés, exports. **Nécessite le plan Blaze** (payant à l'usage, quelques euros/mois à cette échelle) |
| Notifications | **Firebase Cloud Messaging** (web push) | Voir la limite iOS au doc 06 |
| Hébergement | **Firebase Hosting** | Gratuit, HTTPS et domaine personnalisé inclus, déploiement en une commande |
| CI | **GitHub Actions** | Build + lint + déploiement auto à chaque push sur `main` |

## Deux points de structure à trancher (voir doc 07)

1. **Même repo que Stoemathlon, ou nouveau repo ?**
   Ma recommandation : **même repo**, réorganisé en `src/apps/tournoi/` (l'existant, déplacé tel quel)
   et `src/apps/staff/` (le nouveau), avec un routage à la racine. Un seul déploiement, un seul
   pipeline, et le tournoi reste accessible. Coût : une petite réorganisation initiale.

2. **Même projet Firebase, ou un nouveau ?**
   Ma recommandation : **nouveau projet Firebase** (`stoema-staff` par exemple), toujours en
   europe-west1. Les données RH (contrats, IBAN, heures) n'ont rien à faire dans le même espace
   qu'un tableau de tournoi public, et les règles de sécurité seront radicalement différentes.
   On garde l'ancien projet intact pour le Stoemathlon.

## Sécurité — non négociable

- La clé Firebase du fichier `src/Firebase.js` est **publique par nature** (elle part dans le
  navigateur), ce n'est pas une fuite. **Ce qui protège les données, ce sont les règles de sécurité
  Firestore**, et elles seront écrites strictement : un serveur ne lit que sa propre fiche, ses
  propres pointages, et le planning de son établissement.
- Les données sensibles (IBAN, numéro national, taux horaire, notes du responsable) sont
  **isolées dans des sous-documents** à accès gérant uniquement.
- **Journal d'audit** sur toute modification d'heures, de recette ou de stock.
- Le code admin en dur du type `Lune` (présent dans l'app tournoi) **ne sera pas reproduit** :
  vrais comptes, vrais rôles.

## Hors-ligne

Firestore garde un cache local : consultation du planning, cochage des tâches et **pointage**
fonctionnent sans réseau, et se synchronisent au retour. Pour le pointage hors-ligne, l'heure
retenue est celle du téléphone, marquée comme telle et signalée au responsable si elle diverge
de l'heure serveur (protection anti-triche).

## Connexion à la caisse (POS)

À déterminer selon ta caisse (voir doc 07). Trois niveaux possibles :
1. **Saisie manuelle du Z + photo** — marche toujours, disponible dès le lot 1 ;
2. **Import de fichier** (CSV/export journalier de la caisse) — semi-automatique ;
3. **API temps réel** — seulement si ta caisse en propose une (Lightspeed, Zettle, SumUp, Odoo…).
On démarre au niveau 1, on améliore ensuite : c'est le chemin le plus court vers un outil utilisable.
