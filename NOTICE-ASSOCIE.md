# Brancher le paiement Stripe — notice pour l'associé

Le site est en ligne sur **https://treeidentifierapp.pages.dev**. Il est prêt à vendre l'abonnement Premium par Stripe. Il ne manque que **vos liens de paiement Stripe**.

**Aucune clé secrète Stripe n'est nécessaire, et il ne faut jamais en mettre dans ces fichiers** (rien qui commence par `sk_` ou `rk_`). Le site utilise seulement des **liens de paiement Stripe** (Payment Links) : ce sont des adresses publiques, comme `https://buy.stripe.com/...`.

## Ce qui se passe une fois les liens ajoutés

1. Sur la page d'accueil, les badges App Store et Google Play sont remplacés par deux boutons : **« Get Premium for iPhone »** et **« Get Premium for Android »**. Le bouton de l'en-tête devient **« Get Premium »**.
   - Pourquoi pas les badges officiels : Apple et Google n'autorisent leurs badges que pour un lien vers leur store. Un badge qui ouvrirait un paiement Stripe ne respecterait pas leurs règles.
2. Ces boutons mènent à la page **/premium** : formule hebdomadaire à 6,99 $ ou annuelle à 34,99 $, avec un bouton « Continue to payment » qui ouvre votre page de paiement Stripe.
3. Après le paiement, Stripe renvoie l'acheteur vers **/premium/thanks**. Cette page lui dit de regarder ses e-mails pour récupérer ses identifiants, puis de télécharger l'app (avec les vrais badges des stores) et de s'y connecter.

**Tant qu'aucun lien n'est renseigné, le site garde les badges des stores et rien ne change pour les visiteurs.**

## Étape 1 — Dans Stripe (environ 10 minutes)

1. **Catalogue de produits** → créez le produit « Tree Identifier Premium » avec deux tarifs récurrents :
   - 6,99 USD par semaine ;
   - 34,99 USD par an.

   Si vous voulez d'autres prix ou une formule mensuelle, voyez l'étape 2.
2. **Liens de paiement** → créez **un lien par tarif**. Pour chaque lien :
   - **Après le paiement** : choisissez « Ne pas afficher la page de confirmation », puis « Rediriger vers votre site web » avec l'adresse
     `https://treeidentifierapp.pages.dev/premium/thanks/`
   - Activez la collecte de l'**adresse e-mail** (elle sert à envoyer les identifiants).
3. Facultatif, mais conseillé : **Paramètres → Portail client** → activez-le et copiez son lien. Il permet aux clients de résilier eux-mêmes.
4. Le site transmet à Stripe d'où vient l'acheteur :
   - `client_reference_id`, par exemple `bio_tiktok_ios` (série, réseau, téléphone) ;
   - les paramètres `utm_source` / `utm_campaign`.

   Vous les retrouvez dans chaque paiement, sur le tableau de bord Stripe.

## Étape 2 — Mettre les liens dans le site

Ouvrez le fichier **`content/site.json`** et cherchez la partie `"premium"` :

```json
"plans": [
  { "id": "weekly", "name": "Weekly", "price": "$6.99", "period": "per week",
    "stripe_payment_link": "https://buy.stripe.com/VOTRE-LIEN-HEBDO" },
  { "id": "yearly", "name": "Yearly", "price": "$34.99", "period": "per year",
    "stripe_payment_link": "https://buy.stripe.com/VOTRE-LIEN-ANNUEL" }
],
...
"manage_url": "https://billing.stripe.com/p/login/VOTRE-PORTAIL",
```

- Remplacez chaque `"[À CONFIRMER]"` par votre lien. Gardez bien les guillemets.
- Pour changer un prix affiché, ou ajouter une formule mensuelle, modifiez ou copiez une ligne `{ ... }` de `plans`. Le prix affiché sur la page doit être le même que celui réglé dans Stripe.

**Plus simple :** vous pouvez aussi envoyer les deux liens (et celui du portail) à Claire, qui les fera ajouter et mettre en ligne.

## Étape 3 — Vérifier et mettre en ligne

Il faut Node.js 22 ou plus.

```bash
npm install
npm run build     # construit le site dans dist/
npm test          # contrôles automatiques : ils doivent tous passer
```

- Pour voir le résultat sur votre ordinateur : `npm run preview`, puis ouvrez l'adresse affichée.
- Pour mettre en ligne : le site est hébergé sur le compte Cloudflare de Claire (projet `treeidentifierapp`). Elle peut lancer `npm run deploy:cloudflare`. Sinon, dans Cloudflare → Workers & Pages → treeidentifierapp → « Créer un déploiement », déposez le dossier `dist`.

## À vérifier de votre côté (le site ne peut pas le faire)

- **Les identifiants :** la page de remerciement annonce que les identifiants sont envoyés par e-mail à l'adresse saisie pendant le paiement. Si c'est votre système qui envoie cet e-mail, vérifiez qu'il réagit bien aux paiements Stripe (par exemple avec le webhook `checkout.session.completed`). Si les identifiants arrivent autrement, dites-le à Claire : le texte est dans `content/site.json` → `premium.thanks_steps`.
- **Les prix :** ils reprennent ceux de l'App Store (hebdomadaire à 6,99 $, annuel à 34,99 $). Sur Google Play, il existe aussi un mensuel à 6,99 $ et un essai gratuit de 7 jours sur l'annuel. À vous de choisir ce que vous proposez sur le web.
- **Les règles des stores :** vendre l'abonnement sur le web puis le débloquer dans l'app par un identifiant est encadré par Apple et Google. Les règles changent selon le pays et ont évolué récemment. Vérifiez que votre façon de faire est conforme pour les pays où vous vendez.
- Les conditions d'utilisation et la politique de confidentialité en bas de page (qualitechnologies.com) doivent couvrir la vente sur le web.

## Ce que contient le zip

- Le code source complet du site (Astro + Tailwind). Les textes sont dans `content/`, avec la traduction française de chaque texte dans `content/copy.md`.
- `README.md` : le guide complet du site.
- `CLAUDE.md` : les règles du projet (aucun faux avis, aucune fonctionnalité non confirmée, etc.).
