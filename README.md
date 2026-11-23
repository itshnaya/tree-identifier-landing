# Landing Tree Identifier × Plant Tea

Landing page de l'app mobile **Tree Identifier** et « lien en bio » de **Plant Tea** (TikTok, Instagram, YouTube).
Site statique (Astro + Tailwind), textes en anglais américain, tout le contenu modifiable dans `/content`.

Les règles à respecter pour toute modification sont dans `CLAUDE.md`.

---

## Lancer le site sur l'ordinateur

```bash
export PATH="$HOME/.local/node22/bin:$PATH"
npm install        # une seule fois
npm run dev        # http://localhost:4321
npm run build      # fabrique le site final dans dist/
npm test           # tests automatiques (après le build)
```

Aperçu du mini-jeu avec les fiches **pas encore vérifiées** (sur votre ordinateur uniquement, avec une bannière rouge) : `npm run preview-quiz`. Ce mode est refusé lors du build : il ne peut jamais partir en ligne.

## Changer un texte

1. Ouvrez `content/copy.md` pour retrouver le texte et voir dans quel fichier il se trouve (indiqué dans chaque titre de section, par ex. `site.json → hero`).
2. Modifiez-le dans ce fichier JSON (`content/site.json`, `cast.json` ou `series.json`). Gardez les guillemets `"…"` et les virgules.
3. Mettez à jour la ligne correspondante dans `content/copy.md` (anglais + français). Le test `npm test` signale tout texte du site absent de copy.md.

## Changer un lien

Tout est dans `content/site.json` :

| Quoi | Où |
|---|---|
| Lien App Store | `stores.ios_url` |
| Lien Google Play | `stores.android_url` |
| Jeton de campagne Apple (`pt`) | `stores.apple_provider_token` (App Store Connect → App Analytics → Campagnes) |
| TikTok, Instagram, YouTube | `social.tiktok.url` / `.handle`, etc. |
| Confidentialité, conditions, contact | `footer.privacy_url`, `footer.terms_url`, `footer.contact_url` |
| Adresse du site (sitemap, image de partage) | `site_url`, par ex. `"https://www.exemple.com"` |
| Mesure d'audience | `analytics.enabled` → `true`, `analytics.domain` → votre domaine |

## [À CONFIRMER] et propositions : aperçu ou production

- `"[À CONFIRMER]"` seul : information manquante.
- `"[À CONFIRMER] texte…"` : **proposition** de Claude, en attente de votre « oui ». Pour l'accepter, supprimez simplement `[À CONFIRMER] ` au début du texte.

| Mode | Commande | [À CONFIRMER] et propositions |
|---|---|---|
| Développement | `npm run dev` | affichés avec le badge doré |
| Site en ligne (Cloudflare, noindex tant que `PRODUCTION=1` n'est pas utilisé) | `npm run deploy:cloudflare` | **masqués** (les visiteurs ne voient jamais de repère « à confirmer ») |
| Relecture locale | `SHOW_TBC=1 npm run build && npm run preview` | affichés avec le badge doré |
| Production (futur domaine) | `npm run build` | **masqués** (l'élément entier disparaît : question de FAQ, lien, bouton Google Play, section PDF…) |

Une proposition n'est **jamais** utilisée pour une redirection : `/get` n'envoie que vers des liens confirmés. Un test vérifie qu'aucun [À CONFIRMER] n'apparaît dans un build de production.

## Ajouter ou modifier une série

Dans `content/series.json`, copiez un bloc `{ … }` et changez :
- `id` : identifiant court en minuscules avec tirets (sert aussi dans les liens `/get?s=<id>`) ;
- `title`, `pitch` : titre et phrase de présentation ;
- `tiktok_video_url` : lien complet d'une vidéo TikTok (`https://www.tiktok.com/@compte/video/123…`). Le bouton « Play an episode » apparaît automatiquement ; la vidéo n'est chargée que si le visiteur clique.

Ajoutez la traduction dans `content/copy.md`.

## Ajouter une image de personnage

Placez l'image (PNG ou JPG carré, au moins 600 × 600) dans `src/assets/cast/`, par ex. `dr-spike.png`, puis dans `content/cast.json` mettez `"image": "dr-spike"`. L'emplacement provisoire disparaît tout seul.

## Ajouter ou vérifier une fiche de toxicité

Dans `content/toxicity.json`, chaque fiche contient :

| Champ | Valeurs |
|---|---|
| `species_scientific`, `common_name` | nom scientifique, nom courant (anglais) |
| `toxic_cats`, `toxic_dogs`, `toxic_children` | `toxic`, `non_toxic`, `mild` ou `unknown` |
| `note` | précision en anglais (facultatif) |
| `source_url` | lien direct vers la fiche source (ASPCA, FDA…), ouvert et lu à la main |
| `verified_by`, `verified_at` | votre nom, et la date de vérification au format `2026-11-20` |

**Une fiche n'apparaît dans le jeu que si `source_url` est un vrai lien et que `verified_at` est une date.** Les fiches dont le statut chats ou chiens est `unknown` sont aussi écartées (pas de bonne réponse possible). Les deux fiches de départ (Monstera, lys de Pâques) attendent votre vérification : tant que `verified_at` est vide, le jeu affiche « No plants to show yet… ».

## Lien intelligent /get

`/get?s=<série>&p=<réseau>`, par exemple `/get?s=plant-er&p=tiktok`.

- iPhone / iPad → App Store avec `pt=<jeton Apple>` et `ct=<série>_<réseau>` (sans `pt` tant que le jeton est à confirmer).
- Android → Google Play avec `referrer=utm_source%3D<réseau>%26utm_medium%3Dorganic%26utm_campaign%3D<série>`. Lien Google Play donné par Claire le 23/11/2026 : `com.identify.plant`.
- Ordinateur → page avec les deux badges et un QR code.
- `&to=ios` ou `&to=android` force un store (utilisé par les badges).
- Lien en bio conseillé : `https://<votre-domaine>/?p=tiktok&s=bio` (idem `p=instagram`, `p=youtube`). Les badges de la page reprennent automatiquement `s` et `p`.

Mesure envoyée (sans cookies, sans ralentir) : `store_click` (os, series, network, from), `quiz_answer`, `cheatsheet_download`.

## Adresse du site

**https://treeidentifierapp.pages.dev** (Cloudflare Pages, gratuit). Lien en bio conseillé : `https://treeidentifierapp.pages.dev/?p=tiktok&s=bio`. Mise à jour du site : `npm run deploy:cloudflare`. Aperçu de secours sur GitHub Pages : `npm run deploy:preview`.

## Lien court (bio TikTok)

**https://is.gd/treeidentifier** → `https://itshnaya.github.io/tree-identifier-landing/?p=tiktok&s=bio` (créé le 23/11/2026). Un lien is.gd ne peut pas être modifié : si l'adresse du site change (nom de domaine), il faudra en créer un nouveau.

## Fiche PDF gratuite

Déposez le fichier sous `public/downloads/pet-safe-plant-cheat-sheet.pdf`. Le bouton de téléchargement direct s'active tout seul au build suivant.
Option e-mail (désactivée) : dans `site.json → cheatsheet.email_capture`, renseignez `form_action` (adresse fournie par l'outil d'e-mailing choisi) et passez `enabled` à `true`. La case de consentement est décochée par défaut et obligatoire.

## Déployer (hébergement statique)

Rien n'est en ligne pour l'instant. Les trois options marchent pareil ; **Cloudflare Pages** est mon conseil (gratuit, rapide aux États-Unis et au Royaume-Uni). C'est à vous de créer le compte :

1. Mettez ce dossier sur un dépôt GitHub (privé possible).
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → choisissez le dépôt.
3. Réglages de build : *Framework preset* `Astro`, *Build command* `npm run build`, *Output directory* `dist`, variable d'environnement `NODE_VERSION` = `22`.
4. Déployez, puis ajoutez votre domaine (Custom domains) et renseignez-le dans `site.json → site_url`.

Netlify (même réglages : `npm run build`, dossier `dist`) et Vercel (preset Astro) fonctionnent aussi.

## Captures et vérifications

- Les captures par section (téléphone 375 px et ordinateur 1280 px) ont été faites avec un Chrome sans interface, en se présentant comme le navigateur intégré de TikTok sur iPhone.
- Tests : `npm test` (filtre de toxicité, liens /get iPhone / Android / ordinateur et navigateurs intégrés TikTok / Instagram, présence des [À CONFIRMER] ici, copy.md complet, mots interdits).

---

## Sources des informations remplies (vérifiées le 16/11/2026)

| Info sur la page | Valeur | Source |
|---|---|---|
| FAQ « Is Tree Identifier free? » | Gratuite au téléchargement ; identification, bilan de santé et expert IA dans Premium (abonnement hebdomadaire ou annuel) | API iTunes Lookup (`price: 0`, `formattedPrice: "Free"`) + description App Store (section PREMIUM) + page apps.apple.com (achats intégrés : Weekly Subscription 6,99 $, Yearly Subscription 34,99 $ et 17,49 $) |
| FAQ « Which plants can it identify? » | Arbres, arbustes, palmiers, conifères, arbres fruitiers ; feuille, écorce, fleur, fruit ou arbre entier ; écorce et bourgeons en hiver ; encyclopédie de 160 arbres et arbustes | Description officielle App Store (sections IDENTIFY ANY TREE et FREE TOOLS) |
| Lien « Privacy » | https://qualitechnologies.com/privacy-policy | Fiche App Store, lien « Developer's Privacy Policy » (et description) |
| Lien « Terms » | https://qualitechnologies.com/terms-of-use | Description officielle App Store (« Terms of Use ») |
| Lien « Contact » | https://qualitechnologies.com/contact | Fiche App Store, lien « Support » du développeur |
| Données structurées : prix | `0` USD | API iTunes Lookup (`price`, `currency`) |
| Lien App Store | https://apps.apple.com/us/app/tree-identifier-id/id6752256800 | Fourni par Claire |

Développeur sur l'App Store : vendeur « Qualitech Solutions Ltd », nom affiché « Qualitech » (id 1833549754). Les prix des abonnements ne sont pas affichés sur la page, car ils peuvent changer.

**Google Play** : aucune fiche trouvée avec exactement le même nom de développeur. L'app `com.identify.plant` (« Identify Plants: Weeds & Care ») est publiée par « Qualitech Apps LLC » : elle reste une proposition [À CONFIRMER], jamais utilisée pour rediriger.

**Non utilisé** : la note App Store (4,9 sur 13 avis au 16/11/2026, voir la question à Claire) ; « Available in 12 languages » (la fiche technique n'indique que l'anglais).

## Liste de tous les [À CONFIRMER]

Chaque ligne correspond à un endroit précis de `/content` (le test `npm test` vérifie qu'aucun n'est oublié).

**Liens et identifiants**
- `site.json → site_url` : adresse définitive du site (domaine).
- `site.json → premium.plans[0].stripe_payment_link` : lien de paiement Stripe de la formule hebdomadaire (à créer par l'associé, voir NOTICE-ASSOCIE.md).
- `site.json → premium.plans[1].stripe_payment_link` : lien de paiement Stripe de la formule annuelle.
- `site.json → premium.manage_url` : lien du portail client Stripe (gérer ou résilier l'abonnement).
- `site.json → stores.apple_provider_token` : jeton fournisseur Apple pour les campagnes (`pt`).
- `site.json → social.tiktok.handle`, `site.json → social.tiktok.url` : compte TikTok de Plant Tea.
- `site.json → social.instagram.handle`, `site.json → social.instagram.url` : compte Instagram.
- `site.json → social.youtube.handle`, `site.json → social.youtube.url` : chaîne YouTube.
- `series.json → [0].tiktok_video_url` : vidéo TikTok de Plant ER.
- `series.json → [1].tiktok_video_url` : vidéo TikTok de Plant Therapy.
- `series.json → [2].tiktok_video_url` : vidéo TikTok de Toxic or Not?.
- `series.json → [3].tiktok_video_url` : vidéo TikTok de Windowsill Villa.
- `series.json → [4].tiktok_video_url` : vidéo TikTok de Who's That Tree?.

**Propositions de texte**
- `site.json → quiz.safety_note` : **proposition** « Every tree report in the app has a safety section… » sous l'invitation à scanner du mini-jeu (source : description App Store, rubrique Safety ; doute : nouvelle phrase marketing que vous n'avez pas demandée).

**Services à choisir**
- `site.json → analytics.domain` : outil de mesure sans cookies (prévu : Plausible, ou équivalent) et domaine déclaré.
- `site.json → cheatsheet.email_capture.provider_name`, `site.json → cheatsheet.email_capture.form_action` : outil d'e-mailing si l'option e-mail est activée.

**Fichiers et vérifications hors /content**
- Fichier PDF `public/downloads/pet-safe-plant-cheat-sheet.pdf` (contenu à rédiger).
- `verified_by` et `verified_at` des 2 fiches de `toxicity.json` (Monstera, lys de Pâques), après lecture des sources.
- Images des personnages Dr. Spike, Cally, Pothos Pete et Dr. Whiskers (`src/assets/cast/`).
- Captures brutes de l'app (les visuels actuels sont les visuels de l'App Store recadrés).
