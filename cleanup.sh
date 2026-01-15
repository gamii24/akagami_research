#!/bin/bash
# Cleanup script for production deployment

echo "Starting cleanup..."

# Remove backup files
find . -name "*.backup*" -o -name "*.bak" | xargs rm -f
echo "✓ Backup files removed"

# Clean wrangler temp files
rm -rf .wrangler/tmp
echo "✓ Wrangler temp files removed"

# Clean node_modules (will be reinstalled)
# Uncomment if needed: rm -rf node_modules
# echo "✓ node_modules removed"

# Clean dist folder
rm -rf dist
echo "✓ dist folder removed"

# Remove PM2 logs and ecosystem files (production doesn't use PM2)
rm -f ecosystem.config.cjs
rm -rf .pm2
echo "✓ PM2 files removed"

echo "Cleanup complete!"
