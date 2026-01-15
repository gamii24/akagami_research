#!/bin/bash
# Get Cloudflare API token from environment
API_TOKEN="${CLOUDFLARE_API_TOKEN}"
ACCOUNT_ID="8631e5fcf72157a9586099eb02763955"
PROJECT_NAME="akagami-net"
DB_ID="c5d4dce7-e94e-489a-880f-36e6056f74c6"

# Add D1 binding via API
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
        }
      }
    }
  }'
