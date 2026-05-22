#!/bin/bash

BACKEND_URL="http://12.24.5.100:8085"
USERS=("entreprise1@test.com" "entreprise2@test.com")
PASSWORD="luca1593"
ENDPOINTS=("v1/articles/all" "v1/client/all" "v1/fournisseur/all" "v1/category/all" "v1/entreprise/all")

echo "=== Test de session et chargement des données ==="
echo ""

for USER in "${USERS[@]}"; do
    echo "=== Test avec $USER ==="
    
    # Login
    TOKEN=$(curl -s -X POST "$BACKEND_URL/v1/auth/authenticate" \
        -H "Content-Type: application/json" \
        -d "{\"login\":\"$USER\",\"password\":\"$PASSWORD\"}" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('accessToken',''))")
    
    if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
        echo "❌ Login échoué pour $USER"
        continue
    fi
    
    echo "✅ Login réussi"
    
    # Test des endpoints
    for ENDPOINT in "${ENDPOINTS[@]}"; do
        RESPONSE=$(curl -s -X GET "$BACKEND_URL/$ENDPOINT" \
            -H "Authorization: Bearer $TOKEN" \
            -w "\n%{http_code}" 2>/dev/null)
        
        HTTP_CODE=$(echo "$RESPONSE" | tail -1)
        BODY=$(echo "$RESPONSE" | head -n -1)
        
        if [ "$HTTP_CODE" == "200" ]; then
            COUNT=$(echo "$BODY" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d) if isinstance(d,list) else 0)" 2>/dev/null)
            echo "  ✅ $ENDPOINT: OK (count: $COUNT)"
        else
            echo "  ❌ $ENDPOINT: HTTP $HTTP_CODE"
        fi
    done
    
    echo ""
done