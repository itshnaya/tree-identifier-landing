#!/bin/bash
# Publie le site sur Cloudflare Pages : https://treeidentifierapp.pages.dev/
# Prérequis (une seule fois) : compte Cloudflare + `npx wrangler login`.
# Mode aperçu (noindex, repères [À CONFIRMER] visibles) tant que Claire n'a pas validé la version finale.
# Pour la version finale : PRODUCTION=1 npm run deploy:cloudflare
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/node22/bin:$PATH"
PROJECT=treeidentifierapp
if [ "${PRODUCTION:-0}" = "1" ]; then
  SITE_ORIGIN=https://$PROJECT.pages.dev npx astro build
else
  SITE_ORIGIN=https://$PROJECT.pages.dev PREVIEW_NOINDEX=1 npx astro build
fi
npm test
# Projet Cloudflare Pages "treeidentifierapp" créé le 23/11/2026 (compte Cloudflare de Claire).
npx --yes wrangler@4 pages deploy dist.nosync --project-name "$PROJECT" --branch main --commit-dirty=true
echo "Publié : https://$PROJECT.pages.dev/"
