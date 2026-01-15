#!/bin/bash
# This script attempts to clear Pages project bindings via CLI
# Note: This may not work as Pages bindings are typically managed via Dashboard

echo "Attempting to clear project bindings..."
npx wrangler pages project list --project-name akagami-research 2>&1 || echo "Command may not be supported"
