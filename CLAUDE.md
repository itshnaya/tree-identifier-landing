# Landing Tree Identifier × Plant Tea — consignes permanentes

Site statique Astro + Tailwind. Page en anglais américain (marché US puis UK), échanges avec Claire en français.
Les consignes globales de Claire (`~/.claude/CLAUDE.md`) s'appliquent aussi.

## RÈGLES NON NÉGOCIABLES (valables pour toute modification future)

1. Aucun avis, témoignage, note, nombre de téléchargements, logo de presse, récompense ou statistique inventés. Aucune note (`aggregateRating`) ni prix (`offers`) dans les données structurées tant qu'il n'y a pas de vraie note ou de vrai prix.
2. Aucune fonctionnalité de l'app qui n'est pas confirmée. Confirmé à ce jour, et rien d'autre : ce qui figure dans la description officielle de la fiche App Store (id6752256800, relue le 23/11/2026) : identification d'arbres par photo (feuille, écorce, fleur, fruit, arbre entier ; écorce et bourgeons en hiver), fiche complète (reconnaissance, sosies, entretien, calendrier, sécurité, croissance), bilan de santé, expert IA, Mes arbres, outils gratuits (âge, hauteur, luxmètre, arrosage, encyclopédie de 160 arbres et arbustes), Premium, 12 langues. **Compte : Premium vendu sur le site donne un identifiant pour se connecter dans l.app (Claire, 23/11/2026)** ; la fiche App Store dit encore « No account needed ». **Plantes d'intérieur (Monstera, pothos…) sur l'app iPhone : confirmé par Claire le 23/11/2026** (la fiche App Store ne le dit pas encore). App Android = fiche Google Play com.identify.plant (toutes plantes). Pas de « best app », pas de nom de concurrent.
3. Toxicité : seulement les fiches de `/content/toxicity.json` qui ont une source et un champ `verified_at` rempli. Le mini-jeu ignore les autres fiches (filtre dans `src/lib/toxicity.js`, test `tests/toxicity.test.js`). Le mot « safe » n'apparaît que pour un statut `non_toxic` sourcé (seule exception : le titre « The Pet-Safe Plant Cheat Sheet » donné par Claire). Si le statut pour les enfants est inconnu, afficher « Keep out of reach of children and pets ». Ne jamais récupérer automatiquement le contenu du site de l'ASPCA : seulement un lien vers la fiche, vérifiée à la main par Claire (`verified_by`, `verified_at`).
4. La page dit clairement qu'elle vient de l'équipe Tree Identifier.
5. Ne jamais inviter à « chercher Tree Identifier » dans les stores (d'autres apps portent ce nom) : toujours des liens directs, via `/get`.
6. Aucun symbole protégé à l'image (croix rouge sur fond blanc). Aucun nom ni élément d'une marque existante (pas de « Love Island »).
7. Ne créer aucun compte, n'acheter aucun domaine, ne souscrire à aucun service : dire à Claire ce qu'il faut, elle s'en occupe.

## Autres règles du brief

- Information manquante → valeur `"[À CONFIRMER]"` dans `/content`, repère doré visible sur la page, et ligne dans la liste du README (un test le vérifie). Ne jamais remplacer par une supposition.
- Tous les textes, liens et identifiants vivent dans `/content` (site.json, cast.json, series.json, toxicity.json), jamais en dur dans le code. Chaque texte a sa traduction dans `/content/copy.md` (un test le vérifie).
- N'inventer aucune capture d'app. Aucune fausse interface de réseau social (compteurs de likes, vues, commentaires).
- Visages des personnages sur les pots, jamais sur les feuilles. Répliques du casting : du caractère, aucun conseil botanique.
- Badges App Store / Google Play : fichiers officiels, non modifiés (`public/badges/`).
- Mobile d'abord (375 px), contraste AA, textes alternatifs, clavier, `prefers-reduced-motion`. Très peu de JavaScript. Lighthouse mobile ≥ 90 (performance, accessibilité, SEO).
- Mesure d'audience sans cookies, désactivée tant que `analytics.enabled` est `false`.

## Assets (préparés par Codex le 14–15/11/2026)

- `assets/logo.png` : logo exact fourni par Claire. `assets/monty.png` : portrait exact de Monty. Ne pas les remplacer.
- `assets/app-screen-1..3.png` : visuels officiels de la fiche App Store (iOS). La page utilise des **recadrages sans les titres promotionnels** (`src/assets/screens/`), choix validé par Claire le 15/11/2026, car ces titres annoncent des fonctionnalités non confirmées. Le bouton « Ask Expert » de l'interface reste visible sur l'étape 3 : à ne pas mettre en avant dans les textes.
- `assets/android/` : visuels de l'app Google Play `com.identify.plant` (nom sur le store : « Identify Plants: Weeds & Care »). Lien Google Play **confirmé par Claire le 23/11/2026** (https://play.google.com/store/apps/details?id=com.identify.plant&gl=us), branché sur le bouton Google Play. Visuels Android toujours non utilisés.

## Commandes

Node : `~/.local/node22/bin` (ajouter au PATH). `node_modules` et `dist` sont des liens vers des dossiers `.nosync` (iCloud).

- `npm run dev` : serveur local. `npm run preview-quiz` : aperçu local du jeu avec les fiches NON vérifiées (bannière rouge ; refusé au build).
- `npm run build` puis `npm test` : à lancer avant tout commit. `npm run icons` : régénère favicons et image de partage.

## Hébergement

Site principal depuis le 23/11/2026 : **https://treeidentifierapp.pages.dev** (Cloudflare Pages, compte de Claire, projet `treeidentifierapp`, mode aperçu noindex). Mise à jour : `npm run deploy:cloudflare` (build + tests avant envoi). Version finale (indexée, [À CONFIRMER] masqués) : `PRODUCTION=1 npm run deploy:cloudflare`, uniquement sur demande de Claire.

Ancienne adresse GitHub Pages https://itshnaya.github.io/tree-identifier-landing/ : depuis le 23/11/2026, simple redirection vers treeidentifierapp.pages.dev (chemin et paramètres conservés), publiée par `npm run deploy:preview`. Lien court créé le 23/11/2026 avec l'accord de Claire : https://is.gd/treeidentifier → https://itshnaya.github.io/tree-identifier-landing/?p=tiktok&s=bio (is.gd : définitif, non modifiable ; à recréer si l'adresse du site change). Aucun domaine ni hébergement définitif : à confirmer avec Claire.

## Clarté (retour de Claire du 23/11/2026)

La page doit dire en 3 secondes ce que fait l'app (identifier un arbre à partir d'une photo). L'app passe avant Plant Tea. Aucun repère [À CONFIRMER] sur le site publié, aucune section vide (mini-jeu, épisodes, PDF) : elles n'apparaissent que lorsqu'elles ont du vrai contenu.
