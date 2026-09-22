# Synthèse complète — Projet « App Staff Bar »

> Document de transfert, autonome. Il résume **toute** la discussion de cadrage menée le 22/09/2026
> (session Claude, branche `claude/bar-staff-management-app-11l8ik`, repo `oswald-ctrl/stoemathlon`).
> Il peut être collé tel quel dans une autre conversation pour la mettre à niveau — aucune
> connaissance préalable n'est nécessaire.
>
> Version détaillée : dossier `docs/` de la branche `claude/bar-staff-management-app-11l8ik`
> (9 fichiers, commit `bf1b6b7`), déjà poussé sur GitHub.

---

## 1. La demande initiale

Créer une application pour les serveurs des bars d'Oswald, sur le modèle de **Connecteam** mais
**en français** et adaptée à l'Horeca belge :

- gestion RH, planning, to-do lists (ouverture / fermeture), stocks et consommables ;
- **pointage des heures depuis le téléphone** ;
- **saisie des recettes journalières** ;
- **fiche personnelle par serveur** avec connexion individuelle ;
- **point de départ du développement = un Dashboard personnel** où chaque serveur voit son agenda,
  ses to-do importantes, ses heures ;
- interface **claire**, avec **tableaux et graphiques**, et un **léger côté futuriste** évoquant le
  renouveau et le développement du bar ;
- discussion démarrée sur téléphone, développement prévu ensuite sur Mac ;
- tout doit être consigné sur le git.

---

## 2. État existant du repo (constaté, pas supposé)

Repo : `github.com/oswald-ctrl/stoemathlon`

- **App Stoemathlon** (tournois de bar : billard, etc.), `src/App.jsx`, ~1470 lignes, code admin
  en dur : `Lune`.
- **Stack** : React 19 + Vite 7 + Tailwind CSS v4 + `lucide-react`, en **JavaScript** (pas TS).
- **Firebase déjà provisionné** : projet `stoemathlon-2025`, **Realtime Database** en
  **europe-west1**, Storage `stoemathlon-2025.firebasestorage.app`. Config publique dans
  `src/Firebase.js`.
- **Pas de** `firebase.json`, pas de CI, pas de `.env`.

### 🔧 Bug à corriger en priorité
`tailwind.config.js` et `postcss.config.js` sont des **dossiers** contenant un fichier du même nom
→ jamais chargés. Et `src/index.css` utilise la syntaxe Tailwind **v3** (`@tailwind base;`) alors
que le projet installe **Tailwind v4**, qui attend `@import "tailwindcss";` et le plugin
`@tailwindcss/postcss`. ~10 minutes de correction.

---

## 3. Les trois utilisateurs

| Rôle | Ce qu'il fait | Support |
|---|---|---|
| **Serveur / barman** | Pointe, consulte son planning, coche ses tâches, saisit la recette, signale une rupture, pose ses congés | Téléphone perso (PWA) |
| **Responsable de salle** | Valide les heures, fait le planning, contrôle les checklists, inventaire, commandes | Téléphone + tablette du bar |
| **Gérant** | Voit tout sur tous les bars : masse horaire, CA, coût matière, RH | Mac / grand écran |

Les rôles sont **par établissement** : on peut être serveur au bar A et responsable au bar B.

---

## 4. Principes directeurs

1. **Le téléphone d'abord.** Un écran, pas trois, des boutons à la taille du pouce.
2. **Zéro double saisie.** Le pointage alimente la feuille d'heures, la recette alimente les graphs,
   la conso alimente le stock.
3. **Trois secondes pour pointer.** C'est l'action la plus fréquente, donc la plus optimisée.
4. **Rien de bloquant hors-ligne.** Cave, sous-sol, réseau saturé le vendredi : ça continue de marcher.
5. **Multi-bars dès le premier jour.** Oswald parle de « mes bars » au pluriel → la notion
   d'établissement doit être dans le modèle de données dès le début, sinon tout est à réécrire.
6. **L'appli n'est pas l'employeur.** Elle organise et trace ; elle ne remplace ni la Dimona,
   ni le secrétariat social, ni la caisse enregistreuse.

---

## 5. Le Dashboard personnel (premier écran à construire)

Pour un **serveur** :
- Bandeau : bonjour + prénom, établissement en cours, **gros bouton d'état**
  (« Pointer mon arrivée » / « En service depuis 3 h 12 » / « Pointer ma sortie ») ;
- **Mon prochain service** : date, horaire, poste, avec qui ;
- **Mes tâches du jour** : 3–5 to-do prioritaires, cochables depuis le dashboard ;
- **Mes heures** : compteur du mois en jauge, comparé au contrat ;
- **Alertes** : shift à confirmer, échange proposé, document à signer, note non lue ;
- **Ma semaine** : mini-agenda 7 jours horizontal.

Pour le **gérant**, même écran en version pilotage : effectif présent en direct, CA du jour vs
semaine dernière, checklists d'ouverture non terminées, alertes stock.

---

## 6. Les 15 modules (P1 = lot 1, P2 = lot 2, P3 = plus tard)

1. **Dashboard personnel** — P1. Adaptatif selon le rôle.
2. **Pointage** — P1. Arrivée / pause / reprise / sortie horodatés. Preuve de présence : QR au bar,
   géoloc, ou bouton simple (à trancher). Détection des écarts, clôture auto des oublis de sortie,
   corrections manager tracées, feuille d'heures, validation mensuelle puis verrouillage et export paie.
3. **Planning** — P1. Vue semaine/mois, modèles de semaine dupliquables, postes colorés
   (bar/salle/cuisine/plonge/runner/responsable), disponibilités saisies par les serveurs, congés et
   absences, échanges de shifts avec validation, alertes (sous-effectif, conflit, dépassement d'heures,
   repos minimum), publication du planning + notification, export PDF.
4. **Tâches & checklists** — P1. Modèles récurrents (ouverture, fermeture, hebdo, mensuel), items de
   type case / valeur / **photo obligatoire** / signature, **blocage de la fermeture** si items
   critiques manquants, tâches ponctuelles assignées, historique « qui a fermé le 14 août ».
5. **Recettes journalières & caisse** — P1. CA total, ventilation espèces/carte/autres, nombre de
   tickets, panier moyen, fond de caisse, comptage, **écart de caisse** avec commentaire obligatoire
   au-delà d'un seuil, **photo du ticket Z**, pourboires, graphs (jour/semaine/mois, comparaison N-1,
   par jour de semaine, entre bars), verrouillage après validation.
6. **Stocks & consommables** — P1 base / P2 avancé. Catalogue (unité d'achat fût 30 L vs unité de
   vente 33 cl, prix, fournisseur, seuil), inventaire mobile ordonné par zone, mouvements (réception,
   transfert, **casse**, **offert**, conso staff) avec motif, alerte rupture en un clic par le serveur,
   commandes fournisseurs avec proposition automatique (P2), **coût matière** (P2), consommables
   non-boissons (serviettes, entretien, papier).
7. **Fiche personnelle & RH** — P1. Profil complet, contact d'urgence, taille d'uniforme ; contrat
   (CDI / CDD / étudiant / flexi-job / extra), heures, taux horaire, réf. Dimona ; **documents avec
   date d'expiration et alerte** ; compétences et habilitations ; historique (heures, ponctualité,
   absences, notes du responsable) ; **parcours d'onboarding** du nouveau serveur.
8. **Communication interne** — P1 léger / P2 complet. Annonces et notes de service avec **accusé de
   lecture**, épinglage, push. Chat direct en P2 seulement — piège classique de transformer l'appli
   en WhatsApp bis.
9. **Base de connaissances & formation** — P2. **Fiches cocktails** (photo, dosage, verre, garniture)
   consultables derrière le bar, procédures, mini-quiz, suivi de qui a validé quoi.
10. **HACCP & conformité** — P2. *(ajout proposé)* Relevés de **températures frigos** 2×/jour avec
    alerte hors seuil, registre de nettoyage horodaté, DLC, registre présentable à un contrôle AFSCA.
11. **Pourboires & primes** — P2. *(ajout)* Cagnotte par service, règle de répartition (parts égales /
    prorata des heures / pondérée par poste), objectifs et bonus — à doser pour ne pas virer au flicage.
12. **Incidents & maintenance** — P2. *(ajout)* Ticket en 20 s avec photo (tireuse HS, frigo qui monte,
    WC bouché), suivi ouvert → en cours → résolu, historique et coût par équipement.
13. **Notes de frais** — P3. *(ajout)* Le serveur qui achète des citrons en urgence : photo du ticket,
    montant, remboursement suivi.
14. **Pilotage multi-bars** — P2. CA, masse horaire, ratio masse salariale/CA, coût matière, écarts de
    caisse, complétion des checklists, absentéisme, comparaison entre établissements, exports CSV/Excel/PDF.
15. **Administration** — P1. Établissements, utilisateurs, rôles, paramètres par bar (horaires, seuils,
    rayon de géoloc, modèles de checklists), **journal d'audit**.

---

## 7. Architecture technique recommandée

| Besoin | Choix | Pourquoi |
|---|---|---|
| Front | React 19 + Vite, en **PWA** | Installable sur iPhone/Android, **sans App Store**, mise à jour instantanée |
| Langage | **TypeScript**, migration progressive | Heures + argent + stocks : le typage évite une classe entière de bugs |
| UI | Tailwind v4 + composants maison | |
| Graphs | **Recharts** | Léger, s'intègre bien à Tailwind |
| Routage | React Router | |
| Base | **Cloud Firestore** (et non la Realtime Database) | Requêtes filtrées, règles par document, **hors-ligne natif**. La RTDB actuelle convient à un tableau de tournoi, pas à une appli RH |
| Auth | Firebase Auth (e-mail + mot de passe, puis code PIN) | |
| Fichiers | Firebase Storage | Photos de tâches, tickets Z, documents RH |
| Serveur | **Cloud Functions** | Clôture auto des pointages oubliés, notifications, exports. **Exige le plan Blaze** (quelques €/mois à cette échelle) |
| Push | Firebase Cloud Messaging | Voir la limite iOS plus bas |
| Hébergement | Firebase Hosting | Gratuit, HTTPS + domaine perso, déploiement en une commande |
| CI | GitHub Actions | Build + lint + déploiement auto |

**Hors-ligne :** Firestore garde un cache local → consultation du planning, cochage des tâches et
**pointage** fonctionnent sans réseau. Pour un pointage hors-ligne, l'heure retenue est celle du
téléphone, marquée comme telle et signalée si elle diverge de l'heure serveur (anti-triche).

**Sécurité :** la clé Firebase dans `src/Firebase.js` est **publique par nature** (elle part dans le
navigateur), ce n'est pas une fuite — ce qui protège les données, ce sont les **règles Firestore**.
Données sensibles (IBAN, numéro national, taux horaire, notes du responsable) isolées dans un
sous-document à accès gérant uniquement. Pas de code admin en dur du type `Lune` : vrais comptes,
vrais rôles. Journal d'audit sur toute modification d'heures, de recette ou de stock.

**Caisse (POS) :** 3 niveaux — (1) saisie manuelle du Z + photo, marche toujours, disponible lot 1 ;
(2) import de fichier CSV ; (3) API temps réel si la caisse en propose une. On démarre au niveau 1.
*(Caisse probablement **Posbel** — à confirmer.)*

---

## 8. Modèle de données Firestore (proposition)

```
etablissements/{barId}      nom, adresse, coordonnees, rayonPointageM, horaires,
                            seuilEcartCaisse, actif
users/{uid}                 prenom, nom, email, telephone, photoUrl, contactUrgence,
                            tailleUniforme, competences[], dateEntree, actif,
                            roles: { [barId]: 'serveur'|'responsable'|'gerant'|'comptable' }
  /prive/rh                 ← gérant uniquement : iban, numeroNational, tauxHoraire,
                              typeContrat, heuresContrat, refDimona, notesResponsable
  /documents/{docId}        type, nom, url, dateExpiration, ajoutePar
shifts/{id}                 barId, userId, debut, fin, poste, publie, statut, confirmePar
disponibilites/{id}         userId, barId, recurrence|dates, type: dispo|indispo
absences/{id}               userId, barId, type, dates, statut, motif, valideePar, justificatif
pointages/{id}              barId, userId, shiftId?, arrivee{ts, methode, coords?, horsZone?,
                            horsLigne?}, pauses[], sortie{}, dureeMin, statut,
                            corrections[{par, le, champ, avant, apres, motif}], verrouille
checklistModeles/{id}       barId, nom, type, recurrence, bloquantFermeture,
                            items[{libelle, type: case|valeur|photo|signature, critique, min, max}]
checklistRuns/{id}          barId, modeleId, date, statut, reponses[{itemId, fait, valeur,
                            photoUrl, par, le}]
recettes/{barId_YYYY-MM-DD} ca, especes, carte, autres, nbTickets, panierMoyen, fondCaisseDebut,
                            comptageFin, ecart, commentaireEcart, pourboires, ticketZUrl,
                            saisiePar, valideePar, verrouillee
produits/{id}               barId|global, nom, categorie, fournisseurId, uniteAchat,
                            contenanceUnite, uniteVente, prixAchatHT, seuilAlerte
stockMouvements/{id}        barId, produitId, type: reception|inventaire|casse|offert|staff|
                            transfert, quantite, motif, par, le
inventaires/{id}            barId, date, statut, lignes[{produitId, comptee, theorique, ecart}]
fournisseurs/{id}           nom, contact, email, delaiLivraison, jourCommande, minCommande
commandes/{id}              barId, fournisseurId, statut, lignes[], totalHT, recuLe
annonces/{id}               barId|tous, titre, corps, auteur, epinglee, lecteurs[{userId, le}]
temperatures/{id}           barId, equipement, valeur, seuilMin, seuilMax, horsSeuil, par, le
incidents/{id}              barId, titre, description, photoUrl, urgence, statut, assigneA, cout
auditLog/{id}               collection, docId, action, par, le, avant, apres
```

**Règles :** aucune écriture client directe sur `pointages.valideLe`, `recettes.verrouillee` ni
`users.roles` → passage obligé par Cloud Function. Tout document porte un `barId`, la règle vérifie
que l'utilisateur a un rôle sur ce `barId`. Rien n'est jamais supprimé physiquement sur les heures
et l'argent : on marque `annule` + audit.

---

## 9. Design system — « le bar qui se réinvente »

Ligne directrice : **sobriété technique + une touche de lumière**. Pas de néon partout —
l'esthétique d'un tableau de bord haut de gamme : fond profond, données lumineuses, mouvements discrets.

**Mode sombre par défaut** (un bar, le soir, un téléphone), mode clair pour le gérant sur Mac.

| Rôle | Sombre | Clair |
|---|---|---|
| Fond | `#0A0E1A` | `#F7F8FC` |
| Surface | `#131A2B`, bordure `#1F2A44` | `#FFFFFF` |
| Texte / secondaire | `#EAF0FF` / `#8FA0C0` | `#0A0E1A` / `#5A6785` |
| **Accent 1** | `#00E5C7` cyan-menthe | idem |
| **Accent 2** | `#7B61FF` violet | idem |
| Succès / Alerte / Danger | `#3DDC84` · `#FFB020` · `#FF4D6A` | idem |

Le dégradé cyan → violet, **avec parcimonie** (bouton de pointage, jauges, titres de KPI), porte tout
le côté futuriste.

**Typo :** titres en **Space Grotesk**, texte et chiffres en **Inter** avec
`font-variant-numeric: tabular-nums`. Les grands chiffres (CA du jour, heures du mois) sont l'élément
graphique principal : gros, fins, lumineux.

**Composants signature :** cartes en verre (fond translucide, bordure 1 px lumineuse, coins 16–20 px) ;
**bouton de pointage** = grand disque central avec anneau de progression animé pendant le service,
cyan en service / violet en pause / gris hors service ; jauges radiales ; sparklines sous chaque KPI ;
graphs Recharts à lignes fines et grille effacée. Transitions 150–250 ms, respect de
`prefers-reduced-motion`.

**Ergonomie mobile :** cibles tactiles ≥ 44 px, actions principales en bas (zone du pouce), barre de
navigation **Accueil · Planning · Tâches · Stock · Moi**, contraste AA (jamais de cyan sur blanc),
formats FR (`lun. 14 août`, `18:30`, `1 250,00 €`, semaine commençant le lundi, fuseau Europe/Bruxelles).

---

## 10. Faisable / pas faisable — LE point à connaître avant de coder

### ✅ Sans problème
Tous les modules ci-dessus ; appli installable sur l'écran d'accueil iPhone et Android sans store ;
fonctionnement hors-ligne ; photos depuis l'appareil photo ; scan de QR par la caméra ;
géolocalisation ponctuelle au clic ; multi-établissements ; exports.
Coût d'hébergement : de l'ordre de **quelques euros par mois** à cette échelle.

### ⚠️ Faisable avec une contrainte

| Sujet | Contrainte |
|---|---|
| **Push sur iPhone** | Uniquement si l'appli a été **ajoutée à l'écran d'accueil** (iOS 16.4+). Sinon aucune notification → soigner l'onboarding, prévoir un SMS/e-mail de secours |
| **Géoloc en arrière-plan** | **Impossible en web.** On ne peut pas pointer quelqu'un automatiquement à son arrivée : le clic est obligatoire. Le geofencing auto exigerait une appli native |
| **Anti-triche** | Un QR statique se photographie, une géoloc se falsifie. Parade réaliste : **QR tournant** (code qui change toutes les 60 s sur une tablette au bar) ou contrôle croisé géoloc + horaires planifiés. Rien n'est infalsifiable à 100 % |
| **NFC / badge** | Web NFC fonctionne sur Android Chrome, **pas sur iPhone**. À écarter |
| **Connexion caisse** | Dépend du modèle ; beaucoup de caisses Horeca belges n'ouvrent pas d'API |
| **Reconnaissance faciale** | Techniquement possible mais **données biométriques** : RGPD très lourd, consentement salarié difficile, analyse d'impact obligatoire. **Fortement déconseillé** — le QR fait le même travail |
| **Photo « selfie » au pointage** | Plus léger que la biométrie mais reste de la donnée personnelle : à justifier, conserver peu, annoncer à l'équipe |
| **Import de l'historique** | Reprendre les anciens plannings Excel est un chantier à part → démarrer à une date propre |

### ❌ Hors périmètre
- **Ce n'est pas une caisse** : ne remplace ni la caisse, ni le système de caisse enregistrée
  (SCE / « boîte noire ») là où il est requis, ni le ticket TVA client.
- **Ce n'est pas un logiciel de paie** : pas de calcul de salaire ni de fiche de paie → on **exporte**
  des heures propres vers le secrétariat social.
- **Ne remplace pas la Dimona** ni les déclarations ONSS. On peut stocker la référence Dimona et
  préparer les données, rien de plus.
- Pas de suivi de localisation continu des employés.
- Pas de messagerie sociale complète, pas de réservations clients, pas de comptabilité.

### 🇧🇪 Points RGPD / droit du travail à valider avec le secrétariat social — **avant** le lancement
1. **Document d'information à l'équipe** : quelles données, pourquoi, combien de temps, qui y accède.
   À faire signer à l'arrivée. *(peut être rédigé par Claude)*
2. **Proportionnalité de la géolocalisation** : acceptable limitée au moment du pointage, à bannir en continu.
3. **Durées de conservation** : heures plusieurs années (valeur de preuve), photos et positions très peu de temps.
4. **Registre du personnel et horaires des temps partiels** : obligations d'affichage et de conservation
   — l'appli doit produire un document conforme, pas juste un écran.
5. **Droit d'accès et de rectification** du salarié à ses propres données : prévu par design.
6. **Flexi-jobs, étudiants, extras** : règles d'horaires et de déclaration différentes → le champ
   « type de contrat » doit piloter les contrôles (ex. quota d'heures étudiant).

*(Ces points ne sont pas un avis juridique : à faire confirmer par le secrétariat social.)*

---

## 11. Roadmap — des lots qui fonctionnent à chaque étape

- **Lot 0 — Fondations (½ journée).** Réparer Tailwind v4 ; réorganiser le repo (app tournoi /
  app staff) ; nouveau projet Firebase (Firestore + Auth + Storage) + règles de base ; squelette PWA
  + thème ; Firebase Hosting + déploiement auto GitHub Actions.
- **Lot 1 — Dashboard & pointage.** Connexion, rôles, **dashboard personnel**, pointage complet,
  feuille d'heures, validation, fiche personnelle. → *remplace le cahier des heures.*
- **Lot 2 — Planning.** Grille équipe, modèles de semaine, publication + notifications, disponibilités,
  congés, échanges, alertes. → *le planning WhatsApp disparaît.*
- **Lot 3 — Tâches & recettes.** Checklists avec photos et blocage de fermeture ; recettes journalières,
  écarts de caisse, graphs de CA.
- **Lot 4 — Stocks.** Catalogue, inventaire mobile, mouvements, alertes, commandes, coût matière.
- **Lot 5 — Pilotage & confort.** Dashboard gérant multi-bars, exports paie/compta, annonces avec
  accusé de lecture, fiches cocktails, HACCP, incidents, pourboires.

**Ordre à respecter si le temps manque :** pointage → planning → checklists → recettes → stocks.

---

## 12. Questions ouvertes (réponses attendues d'Oswald)

**Bloquantes :**
1. Combien de bars, combien de personnes au total ?
2. Nom de l'appli et noms des établissements ?
3. Téléphones : iPhone, Android, mélange ? Y a-t-il une tablette au bar ?
4. **Pointage : QR au bar / géolocalisation / bouton simple ?**
5. **Firebase : nouveau projet dédié (recommandé) ou réutiliser `stoemathlon-2025` ?**
6. **Repo : garder `stoemathlon` réorganisé (recommandé) ou nouveau repo ?**

**Importantes, non bloquantes :**
7. Connexion des serveurs : e-mail + mot de passe, ou invitation par le gérant puis code PIN à
   6 chiffres (recommandé) ?
8. Quelle caisse exactement (Posbel ?), sort-elle un export CSV ?
9. Quel secrétariat social, et sous quel format veut-il les heures ?
10. Types de contrats présents : CDI, étudiants, flexi-jobs, extras ?
11. Français seul, ou prévoir NL/EN ?
12. Nom de domaine souhaité (ex. `staff.tonbar.be`) ?
13. Fournisseurs principaux et catégories de produits, pour préremplir le catalogue.
14. Les checklists actuelles d'ouverture/fermeture (une photo du papier suffit) et un exemple de
    ticket Z, pour caler les écrans sur la réalité.
15. Plan Firebase actuel : Spark (gratuit) ou Blaze ? Les Cloud Functions exigent Blaze.

**Valeurs par défaut retenues si rien n'est tranché :** TypeScript progressif ; mode sombre ; semaine
au lundi, fuseau Europe/Bruxelles ; rétention photos 6 mois / positions 3 mois / heures 5 ans ;
ni photo ni biométrie au pointage.

---

## 13. Recommandations structurantes

1. **Nouveau projet Firebase dédié** (ex. `stoema-staff`), toujours en `europe-west1` : les données RH
   n'ont rien à faire dans le même espace qu'un tableau de tournoi public, et les règles de sécurité
   sont radicalement différentes.
2. **Même repo, réorganisé** : `src/apps/tournoi/` (l'existant, déplacé tel quel) et `src/apps/staff/`
   (le nouveau), routage à la racine. Un seul déploiement, un seul pipeline.
3. **Multi-bars dans le modèle de données dès le lot 0.**
4. **Commencer par le pointage**, pas par le planning : c'est le gain de temps quotidien immédiat.

---

## 14. État des sessions Claude (contexte d'organisation, constaté le 22/09/2026)

- Deux sessions portent le **même titre** « Application gestion bars serveurs », créées à 40 s d'écart
  le 21/08/2026 :
  - branche **`claude/bar-staff-management-app-11l8ik`** → celle qui a produit ce cadrage,
    **poussé sur GitHub** (commit `bf1b6b7`, dossier `docs/`) ;
  - branche **`claude/bar-staff-management-app-ypable`** → **rien n'a été poussé sur GitHub**, sa
    branche n'existe pas sur le dépôt distant ; son travail vit uniquement dans son conteneur et sera
    perdu au recyclage. ⚠️ **À faire commiter et pousser.** Elle a par ailleurs dérivé vers un autre
    sujet (slot dropdown, réservations Bokun, événements Mons — app Éclipseurs).
- Une troisième session, « Analyse concurrentielle et fonctionnalités app » (03/09/2026), contient deux
  artefacts directement liés : **« Benchmark Apps Équipe Horeca »** et **« Le Central face à Connecteam »**.
  Elle est en attente d'un choix de nom de domaine.
- **Les sessions Claude ne partagent pas leur mémoire.** Le seul canal commun est le git — d'où ce document.

---

*Fin de la synthèse. Détail complet dans `docs/` sur la branche `claude/bar-staff-management-app-11l8ik`.*
