#!/bin/bash
# Aperçu public sur GitHub Pages (noindex) : https://itshnaya.github.io/tree-identifier-landing/
# Construit le site dans un sous-dossier puis pousse dist/ sur la branche gh-pages.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/node22/bin:$PATH"
SITE_ORIGIN=https://itshnaya.github.io SITE_BASE=/tree-identifier-landing PREVIEW_NOINDEX=1 npx astro build
npm test
TMP=$(mktemp -d)
cp -R dist/ "$TMP/"
touch "$TMP/.nojekyll"   # sinon GitHub Pages ignore le dossier _astro
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="itshnaya" -c user.email="itshnaya@users.noreply.github.com" commit -q -m "Aperçu $(date +%Y-%m-%d\ %H:%M)"
git push -q -f https://github.com/itshnaya/tree-identifier-landing.git gh-pages
rm -rf "$TMP"
echo "Publié : https://itshnaya.github.io/tree-identifier-landing/"
