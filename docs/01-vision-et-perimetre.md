# 01 — Vision & périmètre

## L'idée en une phrase

Un **Connecteam en français, taillé pour l'Horeca**, où chaque serveur ouvre l'appli
sur son téléphone et voit *immédiatement* : son prochain service, ses tâches du jour,
ses heures du mois — et où le gérant voit en temps réel le pointage, les recettes,
les stocks et l'état des checklists, sur un ou plusieurs bars.

## Les 3 utilisateurs

| Rôle | Ce qu'il fait | Support principal |
|---|---|---|
| **Serveur / barman** | Pointe, consulte son planning, coche ses tâches, saisit la recette du soir, signale une rupture de stock, pose ses congés | Téléphone perso (PWA) |
| **Responsable de salle** | Valide les heures, construit le planning, contrôle les checklists, fait l'inventaire, passe commande | Téléphone + tablette du bar |
| **Gérant (toi)** | Voit tout, sur tous les bars : masse horaire, CA, coût matière, écarts de caisse, RH | Mac / grand écran |

## Principes directeurs

1. **Le téléphone d'abord.** Tout ce qu'un serveur fait doit tenir dans un écran, sans scroller trois pages, avec des boutons gros comme le pouce. Le desktop, c'est le confort du gérant.
2. **Zéro double saisie.** Ce qui est pointé alimente la feuille d'heures ; ce qui est saisi en recette alimente les graphs ; ce qui est consommé alimente le stock.
3. **Trois secondes pour pointer.** Le pointage est l'action la plus fréquente de l'appli. Elle doit être la plus rapide.
4. **Rien de bloquant hors-ligne.** Une cave, un sous-sol, un réseau saturé un vendredi soir : l'appli continue de fonctionner et se resynchronise seule.
5. **Multi-bars dès le premier jour.** Tu parles de « mes bars » au pluriel : la notion d'établissement est dans le modèle de données dès le début, même si on n'en active qu'un seul au départ. La rajouter après, c'est tout réécrire.
6. **L'appli n'est pas l'employeur.** Elle organise, elle trace, elle prépare les exports — elle ne remplace ni la Dimona, ni le secrétariat social, ni la caisse enregistreuse (voir doc 06).

## Ce qu'on livre en premier : le Dashboard personnel

C'est l'écran d'accueil et le cœur du projet. Pour un serveur qui se connecte :

- **Bandeau haut** : bonjour + son prénom, l'établissement en cours, un gros bouton d'état
  (« Pointer mon arrivée » / « Je suis en service depuis 3 h 12 » / « Pointer ma sortie »).
- **Mon prochain service** : date, horaire, poste, avec qui il bosse.
- **Mes tâches du jour** : les 3–5 to-do prioritaires, cochables directement depuis le dashboard.
- **Mes heures** : compteur du mois en cours, en jauge, comparé au contrat.
- **Alertes** : shift à confirmer, échange de shift proposé, document à signer, note de service non lue.
- **Ma semaine** : mini-agenda 7 jours en bandeau horizontal.

Le gérant voit sur le même écran une version « pilotage » : effectif présent en direct,
CA du jour vs semaine dernière, checklists d'ouverture non terminées, alertes stock.

## Hors périmètre (assumé)

- Caisse / encaissement client : ce n'est pas une caisse, c'est un outil staff.
- Calcul de paie et fiches de paie : on **exporte** vers ton secrétariat social.
- Réservations de tables / clients : autre métier, autre appli.
- Comptabilité complète : on exporte, on ne tient pas les livres.
