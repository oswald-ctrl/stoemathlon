# 07 — Questions ouvertes

## Déjà répondu par le repo (je ne te le redemande pas)

- Hébergement : **Firebase**, projet `stoemathlon-2025`, région **europe-west1**.
- Stack : **React 19 + Vite + Tailwind**, JavaScript, `lucide-react`.
- Dépôt : `github.com/oswald-ctrl/stoemathlon`, branche de travail `claude/bar-staff-management-app-11l8ik`.
- Tu es déjà à l'aise avec une app React déployée en interne (le Stoemathlon tourne).

## Ce dont j'ai besoin — bloquant pour démarrer

1. **Combien de bars**, et combien de personnes au total (serveurs + responsables) ?
2. **Nom de l'appli** et nom des établissements ?
3. **Téléphones** : plutôt iPhone, Android, ou mélange ? Y a-t-il une **tablette au bar** ?
4. **Pointage** : QR au bar / géolocalisation / bouton simple ? (voir doc 06 pour les limites)
5. **Firebase** : nouveau projet dédié (ma reco) ou on réutilise `stoemathlon-2025` ?
6. **Repo** : on garde tout dans `stoemathlon` (ma reco, avec réorganisation) ou nouveau repo ?

## Ce dont j'ai besoin — important, mais pas bloquant

7. **Connexion des serveurs** : e-mail + mot de passe ? Ou tu crées les comptes et ils reçoivent
   un lien d'invitation ? (ma reco : invitation par le gérant, puis code PIN à 6 chiffres
   pour les réouvertures rapides)
8. **Quelle caisse** utilises-tu (marque/modèle) ? Sort-elle un export CSV ?
9. **Secrétariat social** : lequel, et sous quel format veut-il les heures ?
10. **Types de contrats** présents dans l'équipe : CDI, étudiants, flexi-jobs, extras ?
11. **Langue** : français seul, ou faut-il prévoir NL/EN pour une partie de l'équipe ?
12. **Nom de domaine** souhaité (ex. `staff.tonbar.be`) ?
13. **Fournisseurs** principaux et catégories de produits, pour préremplir le catalogue.
14. Tes **checklists actuelles** d'ouverture et de fermeture (même une photo d'un papier suffit)
    et un exemple de **ticket Z**, pour caler les écrans sur la réalité.
15. Ton **plan Firebase** actuel : Spark (gratuit) ou Blaze ? Les Cloud Functions exigent Blaze.

## Décisions que je propose par défaut si tu ne tranches pas

- TypeScript activé progressivement.
- Mode sombre par défaut.
- Semaine commençant le lundi, formats et fuseau Europe/Bruxelles.
- Rétention : photos de tâches 6 mois, positions de pointage 3 mois, heures 5 ans.
- Pas de photo ni de biométrie au pointage au démarrage.
