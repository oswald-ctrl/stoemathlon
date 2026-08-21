# 05 — Design system : « le bar qui se réinvente »

## L'intention

Tu veux du **clair**, du **chiffré**, et un **léger côté futuriste** qui raconte le renouveau.
La ligne : *sobriété technique + une touche de lumière*. Pas de néon partout, pas de
science-fiction — plutôt l'esthétique d'un tableau de bord haut de gamme : fond profond,
données lumineuses, mouvements discrets.

## Palette

**Mode sombre par défaut** (un bar, le soir, un téléphone à la main : le sombre est le bon choix),
mode clair disponible pour le gérant sur Mac.

| Rôle | Sombre | Clair |
|---|---|---|
| Fond | `#0A0E1A` bleu nuit profond | `#F7F8FC` |
| Surface / carte | `#131A2B` avec bordure `#1F2A44` | `#FFFFFF` |
| Texte principal | `#EAF0FF` | `#0A0E1A` |
| Texte secondaire | `#8FA0C0` | `#5A6785` |
| **Accent principal** | `#00E5C7` cyan-menthe électrique | idem |
| **Accent secondaire** | `#7B61FF` violet | idem |
| Succès | `#3DDC84` · Alerte `#FFB020` · Danger `#FF4D6A` | idem |

Le dégradé cyan → violet, utilisé **avec parcimonie** (bouton de pointage, jauges, titres de KPI),
porte tout le côté « futuriste » sans alourdir.

## Typographie

- Titres : **Space Grotesk** (géométrique, un peu tech, très lisible).
- Texte et chiffres : **Inter**, avec les chiffres tabulaires activés pour que les colonnes
  s'alignent (`font-variant-numeric: tabular-nums`).
- Les **grands chiffres** (CA du jour, heures du mois) sont l'élément graphique principal :
  gros, fins, lumineux.

## Composants signature

- **Carte en verre** : fond translucide, bordure 1 px lumineuse, ombre douce, coins 16–20 px.
- **Bouton de pointage** : grand disque central, anneau de progression animé pendant le service,
  passe du cyan (en service) au violet (pause) au gris (hors service). C'est l'objet emblématique
  de l'appli.
- **Jauges radiales** pour les heures du mois et l'avancement des checklists.
- **Sparklines** discrètes sous chaque KPI (tendance 7 jours).
- **Graphs Recharts** : lignes fines, points sur survol, grille très effacée, dégradé sous la courbe.
- **Animations** : transitions 150–250 ms, apparition en fondu-montée, aucun effet gratuit.
  Respect de `prefers-reduced-motion`.

## Règles d'ergonomie mobile

- Cible tactile minimum 44 px ; actions principales en bas de l'écran (zone du pouce).
- Navigation par barre inférieure : **Accueil · Planning · Tâches · Stock · Moi**.
- Une action primaire par écran, en évidence.
- Contraste vérifié AA (le cyan sur fond sombre est excellent ; ne jamais mettre du cyan sur blanc).
- Formats français partout : dates `lun. 14 août`, heures `18:30`, montants `1 250,00 €`,
  semaines commençant le lundi.
