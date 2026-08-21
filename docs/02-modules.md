# 02 — Modules fonctionnels

Légende de priorité : **P1** = lot 1 (indispensable), **P2** = lot 2, **P3** = plus tard.

---

## 1. Dashboard personnel — P1

Décrit en détail dans le doc 01. Adaptatif selon le rôle (serveur / responsable / gérant).
Widgets réordonnables plus tard (P3).

---

## 2. Pointage (badgeuse téléphone) — P1

- Bouton unique **Arrivée / Pause / Reprise / Sortie**, horodaté à la seconde.
- **Preuve de présence** — 3 options, à choisir (voir questions ouvertes) :
  - **QR code affiché au bar** (autocollant derrière le comptoir) — le plus fiable, le moins intrusif ;
  - **géolocalisation** au moment du clic, avec rayon autour du bar ;
  - **simple bouton**, basé sur la confiance, avec contrôle a posteriori par le responsable.
  On peut combiner (QR + géoloc en secours).
- Détection des écarts : pointage hors du shift prévu, oubli de sortie (clôture auto à l'heure
  planifiée + alerte au responsable), pointage hors zone.
- **Correction manager** : toute modification manuelle est tracée (qui, quand, ancienne valeur).
- **Feuille d'heures** : par personne, par semaine/mois, avec heures normales, heures sup,
  jours fériés, pauses déduites.
- **Validation mensuelle** par le responsable → verrouillage → export paie.
- Photo optionnelle au pointage (« selfie badgeuse ») : possible, mais réfléchir RGPD (doc 06).

---

## 3. Planning / horaires — P1

- Vue **semaine** (grille équipe) et vue **mois** ; côté serveur, vue « mon agenda ».
- **Modèles de semaine** : tu construis une semaine type, tu la dupliques en un clic.
- **Postes** : bar, salle, cuisine, plonge, runner, responsable de shift — avec couleur.
- **Disponibilités** saisies par les serveurs (« je ne peux pas les mardis »), affichées au moment de planifier.
- **Demandes de congés / absences** : dépôt, validation, solde, motif (congé, maladie, récup).
- **Échange de shift** entre serveurs, avec validation du responsable.
- **Alertes** : sous-effectif sur un créneau, conflit de dispo, dépassement d'heures, repos
  minimum entre deux services non respecté.
- **Publication** du planning : tant qu'il n'est pas publié, les serveurs ne le voient pas.
  À la publication, notification à tout le monde.
- Export PDF « planning à afficher en salle ».

---

## 4. Tâches & checklists — P1

- **Checklists récurrentes** : ouverture, fermeture, hebdomadaire, mensuelle, par poste, par bar.
- Un modèle = une liste d'items ordonnés ; une exécution = une instance datée, avec qui l'a faite et quand.
- Types d'items : case à cocher, saisie de valeur (température, compteur), **photo obligatoire**
  (état des toilettes, terrasse rangée, frigo rempli), signature.
- **Blocage de fermeture** : la fermeture ne peut pas être validée si des items critiques manquent.
- Tâches ponctuelles assignées à une personne, avec échéance.
- Historique consultable : « qui a fait la fermeture du 14 août et à quelle heure ».

---

## 5. Recettes journalières & caisse — P1

- Saisie de fin de service : **CA total**, ventilation espèces / carte / autres, nombre de tickets,
  panier moyen calculé.
- **Fond de caisse** de départ, comptage de fin, **écart de caisse** calculé automatiquement,
  commentaire obligatoire si écart > seuil.
- **Photo du ticket Z** de la caisse en pièce jointe.
- Pourboires : montant, mode de répartition (voir module 11).
- **Graphs** : CA jour / semaine / mois, comparaison N-1, CA par jour de la semaine,
  répartition des moyens de paiement, courbe de tendance, comparaison entre bars.
- Verrouillage : une fois validée par le responsable, la recette n'est plus modifiable
  (correction = écriture d'ajustement tracée).

---

## 6. Stocks & consommables — P1 (base) / P2 (avancé)

- **Catalogue produits** : nom, catégorie (bières, spiritueux, softs, food, consommables,
  entretien), unité d'achat (fût 30 L, casier 24) vs unité de vente (33 cl), prix d'achat,
  fournisseur, seuil d'alerte.
- **Inventaire** : saisie rapide sur téléphone (liste ordonnée par zone : cave, frigo bar,
  réserve), comparaison avec l'inventaire précédent, calcul de la consommation.
- **Mouvements** : réception de livraison, transfert entre bars, **casse**, **offert maison**,
  consommation staff — chaque sortie a un motif.
- **Alertes de rupture** : le serveur signale en un clic « plus de Gin X », ça remonte au responsable.
- **Commandes fournisseurs** : proposition automatique basée sur seuils + consommation moyenne,
  bon de commande PDF / e-mail (P2).
- **Coût matière** : ratio conso/CA par période et par catégorie — l'indicateur clé de rentabilité (P2).
- Consommables non-boissons : serviettes, sous-bocks, gel, produits d'entretien, papier toilette.

---

## 7. Fiche personnelle & RH — P1

- **Profil serveur** : photo, prénom/nom, téléphone, e-mail, date de naissance, adresse,
  contact d'urgence, taille d'uniforme, IBAN (chiffré / accès gérant seul), numéro national
  (accès très restreint — voir RGPD).
- **Contrat** : type (CDI, CDD, étudiant, flexi-job, extra), heures/semaine, date d'entrée,
  taux horaire (visible du gérant uniquement), référence Dimona.
- **Documents** : contrat signé, carte d'identité, attestation, certificat médical, permis —
  avec **date d'expiration et alerte** avant échéance.
- **Compétences / habilitations** : sait faire les cocktails, gère la caisse, forme les nouveaux,
  peut ouvrir/fermer seul.
- **Historique** : heures cumulées, ponctualité, absences, entretiens, notes du responsable
  (visibles du gérant uniquement).
- **Onboarding nouveau serveur** : parcours de premier jour automatique (checklist d'accueil,
  documents à fournir, formations à suivre).

---

## 8. Communication interne — P1 (léger) / P2 (complet)

- **Annonces / notes de service** avec **accusé de lecture** (tu vois qui a lu quoi).
- Fil par établissement, épinglage des messages importants.
- Notifications push (planning publié, tâche assignée, shift à confirmer).
- Chat direct léger (P2). Attention : ne pas transformer l'appli en WhatsApp bis, c'est un piège
  classique — un fil d'annonces suffit souvent.

---

## 9. Base de connaissances & formation — P2

- **Fiches recettes cocktails** avec photo, dosage, verre, garniture — consultables derrière le bar.
- Procédures : ouverture de caisse, gestion d'un client difficile, protocole de nettoyage,
  que faire si la tireuse mousse.
- Mini-quiz de validation, suivi de qui a lu/validé quoi.
- Très fort effet « professionnalisation » pour un coût faible.

---

## 10. HACCP & conformité — P2 *(ajout de ma part, très pertinent en Horeca)*

- **Relevés de températures** frigos / congélateurs, deux fois par jour, avec alerte hors seuil.
- **Registre de nettoyage** horodaté.
- Traçabilité des DLC pour la food.
- Génère le registre à présenter en cas de contrôle AFSCA. Aujourd'hui c'est un classeur papier
  souvent mal tenu ; là, c'est automatique et infalsifiable.

---

## 11. Pourboires & primes — P2 *(ajout)*

- Cagnotte de pourboires par service, règle de répartition (parts égales, au prorata des heures,
  pondérée par poste), historique par personne.
- Objectifs et primes : objectif de CA sur un service, bonus atteint, classement bienveillant.
  À doser — la gamification motive mais peut crisper si elle devient un flicage.

---

## 12. Incidents & maintenance — P2 *(ajout)*

- Ticket en 20 secondes depuis le téléphone : photo + description + urgence
  (tireuse HS, frigo qui ne tient plus la température, WC bouché, ampoule).
- Suivi : ouvert → en cours → résolu, avec l'artisan/fournisseur concerné.
- Historique par équipement : tu vois que la machine à glaçons t'a coûté 4 interventions cette année.

---

## 13. Notes de frais & petits achats — P3 *(ajout)*

Le serveur qui achète des citrons en urgence : photo du ticket, montant, remboursement suivi.

---

## 14. Espace gérant / pilotage multi-bars — P2

- Tableau de bord consolidé : CA, masse horaire, ratio masse salariale/CA, coût matière,
  écarts de caisse, taux de complétion des checklists, absentéisme.
- Comparaison entre établissements.
- Exports : heures (paie), CA (comptable), stocks (inventaire), au format CSV / Excel / PDF.

---

## 15. Administration — P1

- Gestion des établissements, des utilisateurs, des rôles et permissions.
- Paramètres par bar : horaires d'ouverture, seuils d'écart de caisse, rayon de géolocalisation,
  modèles de checklists, catégories de produits.
- Journal d'audit : qui a modifié quoi (obligatoire dès qu'on touche aux heures et à l'argent).
