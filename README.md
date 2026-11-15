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
| Confidentialité, conditions, contact | `footer.privacy_url`, `footer.terms_url`, `footer.contact_email` |
| Adresse du site (sitemap, image de partage) | `site_url`, par ex. `"https://www.exemple.com"` |
| Mesure d'audience | `analytics.enabled` → `true`, `analytics.domain` → votre domaine |

Tant qu'une valeur vaut `"[À CONFIRMER]"`, la page affiche un repère doré à sa place.

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
- Android → Google Play avec `referrer=utm_source%3D<réseau>%26utm_medium%3Dorganic%26utm_campaign%3D<série>`. **Tant que `stores.android_url` est à confirmer, Android voit la page avec les badges.**
- Ordinateur → page avec les deux badges et un QR code.
- `&to=ios` ou `&to=android` force un store (utilisé par les badges).
- Lien en bio conseillé : `https://<votre-domaine>/?p=tiktok&s=bio` (idem `p=instagram`, `p=youtube`). Les badges de la page reprennent automatiquement `s` et `p`.

Mesure envoyée (sans cookies, sans ralentir) : `store_click` (os, series, network, from), `quiz_answer`, `cheatsheet_download`.

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

## Liste de tous les [À CONFIRMER]

Chaque ligne correspond à un endroit précis de `/content` (le test `npm test` vérifie qu'aucun n'est oublié).

**Liens et identifiants**
- `site.json → site_url` : adresse définitive du site (domaine).
- `site.json → stores.android_url` : lien Google Play de Tree Identifier.
- `site.json → stores.apple_provider_token` : jeton fournisseur Apple pour les campagnes (`pt`).
- `site.json → social.tiktok.handle`, `site.json → social.tiktok.url` : compte TikTok de Plant Tea.
- `site.json → social.instagram.handle`, `site.json → social.instagram.url` : compte Instagram.
- `site.json → social.youtube.handle`, `site.json → social.youtube.url` : chaîne YouTube.
- `series.json → [0].tiktok_video_url` : vidéo TikTok de Plant ER.
- `series.json → [1].tiktok_video_url` : vidéo TikTok de Plant Therapy.
- `series.json → [2].tiktok_video_url` : vidéo TikTok de Toxic or Not?.
- `series.json → [3].tiktok_video_url` : vidéo TikTok de Windowsill Villa.
- `series.json → [4].tiktok_video_url` : vidéo TikTok de Who's That Tree?.
- `site.json → footer.privacy_url` : page de confidentialité.
- `site.json → footer.terms_url` : conditions d'utilisation.
- `site.json → footer.contact_email` : adresse de contact.

**Informations sur l'app**
- `site.json → faq.items[0].a` : l'app est-elle gratuite ? (prix, abonnement, essai)
- `site.json → faq.items[1].a` : quelles plantes l'app identifie-t-elle ?
- Toute autre fonctionnalité (non affichée tant qu'elle n'est pas confirmée).

**Services à choisir**
- `site.json → analytics.domain` : outil de mesure sans cookies (prévu : Plausible, ou équivalent) et domaine déclaré.
- `site.json → cheatsheet.email_capture.provider_name`, `site.json → cheatsheet.email_capture.form_action` : outil d'e-mailing si l'option e-mail est activée.

**Fichiers et vérifications hors /content**
- Fichier PDF `public/downloads/pet-safe-plant-cheat-sheet.pdf` (contenu à rédiger).
- `verified_by` et `verified_at` des 2 fiches de `toxicity.json` (Monstera, lys de Pâques), après lecture des sources.
- Images des personnages Dr. Spike, Cally, Pothos Pete et Dr. Whiskers (`src/assets/cast/`).
- Captures brutes de l'app (les visuels actuels sont les visuels de l'App Store recadrés).
