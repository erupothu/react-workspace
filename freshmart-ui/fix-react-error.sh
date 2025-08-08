#!/bin/bash

echo "🔧 Fixing React useState error..."

# Step 1: Remove problematic Three.js packages if they exist
echo "📦 Removing Three.js packages..."
npm uninstall @react-three/drei @react-three/fiber @types/three three 2>/dev/null || true

# Step 2: Clear all caches
echo "🧹 Clearing caches..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

# Step 3: Clear npm cache
echo "🗑️ Clearing npm cache..."
npm cache clean --force

# Step 4: Remove node_modules and package-lock.json
echo "🗂️ Removing node_modules..."
rm -rf node_modules
rm -f package-lock.json

# Step 5: Reinstall dependencies
echo "⬇️ Reinstalling dependencies..."
npm install

echo "✅ Fix complete! Restart the dev server."
