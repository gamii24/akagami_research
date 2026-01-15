#!/bin/bash
source ~/.bashrc
API_TOKEN="${CLOUDFLARE_API_TOKEN}"
ACCOUNT_ID="8631e5fcf72157a9586099eb02763955"
PROJECT_NAME="akagami-net"
DB_ID="c5d4dce7-e94e-489a-880f-36e6056f74c6"

echo "Force updating D1 binding for ${PROJECT_NAME}..."

curl -X PATCH "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "deployment_configs": {
      "production": {
        "d1_databases": {
          "DB": {
            "id": "'"${DB_ID}"'"
          }
        },
        "compatibility_date": "2024-01-01",
        "compatibility_flags": ["nodejs_compat"]
      },
      "preview": {
        "d1_databases": {
          "DB": {
            "id": "'"${DB_ID}"'"
          }
        },
        "compatibility_date": "2024-01-01",
        "compatibility_flags": ["nodejs_compat"]
      }
    }
  }' | jq -r '.success'

echo ""
echo "Redeploying..."
npx wrangler pages deploy dist --project-name akagami-net
