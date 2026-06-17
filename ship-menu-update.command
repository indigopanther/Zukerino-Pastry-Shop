#!/bin/bash
# Ships the Zukerino menu update: commits the changed files and pushes to GitHub.
# Vercel auto-builds from GitHub, so the site updates ~1 minute after the push.
# Double-click this file in Finder, or run it from Terminal.

cd "$(dirname "$0")" || exit 1
echo "Shipping Zukerino menu update from: $(pwd)"
echo

# Clear any stale git lock left by an interrupted process.
rm -f .git/index.lock

git add -A

git commit -m "Menu fixes, nav drawer fix, start on Cakes, remove DSC_1820"
git push

echo
echo "Pushed. Vercel will build and deploy automatically (about a minute)."
read -n 1 -s -r -p "Press any key to close."
echo
