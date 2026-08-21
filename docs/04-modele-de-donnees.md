# 04 — Modèle de données (Firestore)

Version de travail. À affiner au moment de coder, mais la structure est posée.

## Rôles

| Rôle | Portée |
|---|---|
| `serveur` | Ses propres données + le planning et les tâches de son/ses établissement(s) |
| `responsable` | Tout l'opérationnel d'un établissement : planning, validation des heures, checklists, stocks, recettes |
| `gerant` | Tout, sur tous les établissements, y compris RH sensible et paramétrage |
| `comptable` | Lecture seule des recettes et des exports |

Les rôles sont **par établissement** : quelqu'un peut être serveur au bar A et responsable au bar B.

## Collections

```
etablissements/{barId}
  nom, adresse, coordonnees{lat,lng}, rayonPointageM, fuseau,
  horairesOuverture, seuilEcartCaisse, actif

users/{uid}
  prenom, nom, email, telephone, photoUrl, dateNaissance,
  contactUrgence{nom, tel}, tailleUniforme, actif, dateEntree,
  roles: { [barId]: 'serveur' | 'responsable' | 'gerant' | 'comptable' }
  competences: [string]

  /prive/rh          ← sous-document, accès gérant uniquement
      iban, numeroNational, tauxHoraire, typeContrat, heuresContrat,
      refDimona, notesResponsable

  /documents/{docId}
      type, nom, url, dateExpiration, dateAjout, ajoutePar

shifts/{shiftId}
  barId, userId, debut, fin, poste, publie, statut,
  confirmePar, note, creePar, creeLe

disponibilites/{dispoId}
  userId, barId, recurrence | dateDebut, dateFin, type: 'dispo'|'indispo', motif

absences/{absenceId}
  userId, barId, type: 'conge'|'maladie'|'recup'|'autre',
  dateDebut, dateFin, statut: 'demande'|'accepte'|'refuse',
  motif, valideePar, justificatifUrl

pointages/{pointageId}
  barId, userId, shiftId?,
  arrivee{ts, methode:'qr'|'geo'|'manuel', coords?, horsZone?, horsLigne?},
  pauses: [{debut, fin}],
  sortie{...},
  dureeMin, statut: 'en_cours'|'termine'|'clot_auto',
  corrections: [{par, le, champ, avant, apres, motif}],
  valideLe, validePar, verrouille

checklistModeles/{modeleId}
  barId, nom, type: 'ouverture'|'fermeture'|'hebdo'|'mensuel'|'custom',
  recurrence, poste?, bloquantFermeture,
  items: [{id, libelle, type:'case'|'valeur'|'photo'|'signature',
           critique, unite?, min?, max?, ordre}]

checklistRuns/{runId}
  barId, modeleId, date, statut, ouvertPar, ouvertLe, termineLe,
  reponses: [{itemId, fait, valeur?, photoUrl?, par, le}]

recettes/{barId_YYYY-MM-DD}
  barId, date, ca, especes, carte, autres, nbTickets, panierMoyen,
  fondCaisseDebut, comptageFin, ecart, commentaireEcart,
  pourboires, ticketZUrl, saisiePar, valideePar, verrouillee

produits/{produitId}
  barId | 'global', nom, categorie, fournisseurId,
  uniteAchat, contenanceUnite, uniteVente, prixAchatHT, seuilAlerte, actif

stockMouvements/{mvtId}
  barId, produitId, type:'reception'|'inventaire'|'casse'|'offert'|'staff'|'transfert',
  quantite, motif, par, le, commandeId?

inventaires/{inventaireId}
  barId, date, statut, par,
  lignes: [{produitId, quantiteComptee, quantiteTheorique, ecart}]

fournisseurs/{fournisseurId}
  nom, contact, email, telephone, delaiLivraison, jourCommande, minCommande

commandes/{commandeId}
  barId, fournisseurId, statut, lignes:[{produitId, quantite, prix}],
  totalHT, creeLe, creePar, recuLe

annonces/{annonceId}
  barId | 'tous', titre, corps, auteur, le, epinglee, pieceJointeUrl,
  lecteurs: [{userId, le}]

temperatures/{releveId}          ← HACCP
  barId, equipement, valeur, seuilMin, seuilMax, horsSeuil, par, le

incidents/{incidentId}
  barId, titre, description, photoUrl, urgence, statut,
  signalePar, le, assigneA, resoluLe, cout?

auditLog/{logId}
  collection, docId, action, par, le, avant, apres, ip?
```

## Principes de règles de sécurité

- Aucune écriture directe côté client sur `pointages.valideLe`, `recettes.verrouillee`,
  `users.roles` → passage obligé par Cloud Function.
- Un `serveur` lit `users/{uid}` seulement si `uid == request.auth.uid` (sauf annuaire
  restreint : prénom + photo + poste des collègues de son bar).
- `users/{uid}/prive/rh` : lecture/écriture `gerant` uniquement.
- Tout document porte un `barId` ; la règle vérifie que l'utilisateur a un rôle sur ce `barId`.
- Rien n'est jamais supprimé physiquement sur les heures et l'argent : on marque `annule` + audit.
