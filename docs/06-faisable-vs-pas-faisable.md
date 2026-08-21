# 06 — Ce qui est faisable, et ce qui ne l'est pas

C'est le document le plus important de la phase de discussion : il évite les mauvaises surprises
à trois semaines du lancement.

## ✅ Largement faisable

- Toute la partie fonctionnelle du doc 02 : dashboard, planning, pointage, tâches, recettes,
  stocks, fiches RH, annonces, graphs, exports.
- **Appli installable sur l'écran d'accueil** de l'iPhone et d'Android, avec icône, plein écran,
  sans passer par les stores (PWA). Mise à jour instantanée pour tout le monde.
- **Fonctionnement hors-ligne** (consultation + pointage + cochage de tâches).
- **Photos** (ticket Z, tâche, incident, document RH) prises depuis l'appareil photo du téléphone.
- **Scan de QR code** par la caméra pour le pointage au bar.
- **Géolocalisation ponctuelle** au moment du clic de pointage.
- **Notifications push** sur Android sans réserve, et sur iOS **à condition que l'appli ait été
  ajoutée à l'écran d'accueil** (iOS 16.4+). En dehors de ça, pas de push sur iPhone.
- Multi-établissements, multi-rôles, exports CSV/Excel/PDF.
- Coût d'hébergement très faible à cette échelle : de l'ordre de quelques euros par mois
  (plan Blaze de Firebase, facturé à l'usage).

## ⚠️ Faisable, mais avec une contrainte à connaître

| Sujet | La contrainte |
|---|---|
| **Push sur iPhone** | Uniquement si le serveur a ajouté l'appli à son écran d'accueil. Il faut donc soigner l'onboarding (« Partager → Sur l'écran d'accueil ») et prévoir un SMS/e-mail de secours pour les infos critiques |
| **Géolocalisation en arrière-plan** | Impossible en web. On ne peut pas pointer quelqu'un automatiquement quand il arrive au bar : le clic de l'utilisateur est obligatoire. Le geofencing automatique exigerait une vraie appli native |
| **Anti-triche du pointage** | Un QR statique peut être photographié ; une géolocalisation peut être falsifiée sur un téléphone bidouillé. La bonne parade réaliste : QR **tournant** (le code change toutes les 60 s sur une tablette au bar) ou contrôle croisé géoloc + horaires planifiés. Aucun système grand public n'est infalsifiable à 100 % |
| **NFC / badge physique** | Web NFC fonctionne sur Android Chrome, **pas sur iPhone**. À écarter, sauf à passer par une tablette du bar |
| **Connexion à la caisse** | Dépend entièrement du modèle de caisse. Beaucoup de caisses Horeca belges n'ouvrent pas d'API. On démarre par la saisie du Z + photo (fiable, 30 secondes) |
| **Reconnaissance faciale au pointage** | Techniquement possible, mais ce sont des **données biométriques** : régime RGPD très lourd, consentement libre difficile à obtenir d'un salarié, analyse d'impact obligatoire. **Je te le déconseille fermement** — le QR fait le même travail sans le risque |
| **Photo « selfie » au pointage** | Beaucoup plus léger que la biométrie, mais reste de la donnée personnelle : à justifier, à conserver peu de temps, à annoncer clairement à l'équipe |
| **Import de l'historique** | Reprendre les anciens plannings/heures depuis Excel est possible mais c'est un chantier à part. Recommandation : on démarre à une date propre |

## ❌ À exclure du périmètre

- **Ce n'est pas une caisse enregistreuse.** L'appli ne remplace ni ta caisse, ni le système de
  caisse enregistrée (SCE / « boîte noire ») là où il est requis, ni le ticket TVA client.
- **Ce n'est pas un logiciel de paie.** Elle ne calcule pas les salaires, ne produit pas de fiche
  de paie, ne fait pas de déclaration. Elle **exporte** des heures propres vers ton secrétariat social.
- **Elle ne remplace pas la Dimona** ni les obligations de déclaration ONSS. Le pointage interne
  est un outil de gestion ; les déclarations officielles restent à faire dans les canaux prévus.
  On peut en revanche stocker la référence Dimona sur la fiche du serveur et préparer les données.
- **Pas de suivi de localisation continu** des employés : disproportionné, et juridiquement
  très exposé.
- **Pas de messagerie sociale complète** (réactions, stories, fil d'actu). Le fil d'annonces suffit.

## 🇧🇪 Points RGPD / droit du travail à valider avec ton conseil

Je ne suis pas ton juriste, et ces points ont un vrai impact sur le produit — à faire confirmer
par ton secrétariat social **avant** le lancement, pas après :

1. **Information de l'équipe** : un document écrit expliquant quelles données sont collectées
   (heures, position au moment du pointage, photos de tâches), pourquoi, combien de temps elles
   sont conservées, et qui y accède. À faire signer à l'arrivée. *(Je peux le rédiger.)*
2. **Proportionnalité de la géolocalisation** : autorisée si limitée au moment du pointage et
   justifiée par un besoin réel. À bannir en continu.
3. **Durées de conservation** : les données de pointage servant de preuve, on garde généralement
   plusieurs années les heures, mais très peu de temps les photos/positions. À paramétrer.
4. **Registre du personnel et horaires des temps partiels** : des obligations d'affichage et de
   conservation existent ; l'appli doit produire un document conforme, pas juste un écran.
5. **Droit d'accès et de rectification** du salarié à ses propres données : prévu par design
   (chacun voit sa fiche et ses heures).
6. **Flexi-jobs, étudiants, extras** : leurs règles d'horaires et de déclaration diffèrent ;
   le champ « type de contrat » doit piloter les contrôles (ex. quota d'heures étudiant).
