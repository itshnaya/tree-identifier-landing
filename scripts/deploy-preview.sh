#!/bin/bash
# L'ancienne adresse GitHub Pages (https://itshnaya.github.io/tree-identifier-landing/)
# et le lien court is.gd/treeidentifier (qui pointe dessus, non modifiable) renvoient
# désormais vers le site principal https://treeidentifierapp.pages.dev, en gardant
# le chemin et les paramètres (?p=tiktok&s=bio, /get/…).
set -euo pipefail
TARGET=https://treeidentifierapp.pages.dev
TMP=$(mktemp -d)
page() { cat <<HTML
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="robots" content="noindex"><link rel="canonical" href="$TARGET/">
<title>Tree Identifier</title>
<script>location.replace('$TARGET' + location.pathname.replace(/^\/tree-identifier-landing/, '') + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=$TARGET/">
</head><body><p><a href="$TARGET/">Tree Identifier</a></p></body></html>
HTML
}
mkdir -p "$TMP/get"
page > "$TMP/index.html"; page > "$TMP/404.html"; page > "$TMP/get/index.html"
touch "$TMP/.nojekyll"
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="itshnaya" -c user.email="itshnaya@users.noreply.github.com" commit -q -m "Redirection vers $TARGET ($(date +%Y-%m-%d))"
git push -q -f https://github.com/itshnaya/tree-identifier-landing.git gh-pages
rm -rf "$TMP"
echo "Redirection publiée : https://itshnaya.github.io/tree-identifier-landing/ → $TARGET"
