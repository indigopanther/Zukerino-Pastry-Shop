#!/bin/bash
# Ships the Zukerino menu update: commits the changed files and pushes to GitHub.
# Vercel auto-builds from GitHub, so the site updates ~1 minute after the push.
# Double-click this file in Finder, or run it from Terminal.

cd "$(dirname "$0")" || exit 1
echo "Shipping Zukerino menu update from: $(pwd)"
echo

# Clear any stale git lock left by an interrupted process.
rm -f .git/index.lock

git add \
  index.html \
  src/main.jsx \
  src/components/Admin.jsx \
  src/components/Menu.jsx \
  src/hooks/useReveal.js \
  src/index.css \
  src/menuData.js \
  src/menuStore.js

git commit -m "Menu loads immediately on mobile; fix category bar; Cakes & Cheesecakes, add/delete, remove lock"
git push

echo
echo "Pushed. Vercel will build and deploy automatically (about a minute)."
read -n 1 -s -r -p "Press any key to close."
echo
