#!/usr/bin/env python3

import urllib.request
import urllib.error
import json
import sys

BACKEND_URL = "http://12.24.5.100:8085"
USERS = ["entreprise1@test.com", "entreprise2@test.com"]
PASSWORD = "luca1593"
ENDPOINTS = [
    "v1/articles/all",
    "v1/client/all", 
    "v1/fournisseur/all",
    "v1/category/all",
    "v1/entreprise/all"
]

def login(email, password):
    url = f"{BACKEND_URL}/v1/auth/authenticate"
    data = json.dumps({"login": email, "password": password}).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers={
        "Content-Type": "application/json"
    })
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get('accessToken')
    except urllib.error.HTTPError as e:
        print(f"Login error: {e.code} - {e.read().decode()}")
        return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_endpoint(token, endpoint):
    url = f"{BACKEND_URL}/{endpoint}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {token}"
    })
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            return True, data
    except urllib.error.HTTPError as e:
        return False, str(e.code)
    except Exception as e:
        return False, str(e)

def main():
    print("=== Test de session et chargement des données ===\n")
    
    for user in USERS:
        print(f"=== Test avec {user} ===")
        
        token = login(user, PASSWORD)
        if not token:
            print(f"  ❌ Login échoué")
            continue
            
        print(f"  ✅ Login réussi")
        
        for endpoint in ENDPOINTS:
            success, data = test_endpoint(token, endpoint)
            name = endpoint.split('/')[-1]
            
            if success:
                count = len(data) if isinstance(data, list) else 0
                print(f"    ✅ {name}: OK (count: {count})")
            else:
                print(f"    ❌ {name}: {data}")
        
        print()

if __name__ == "__main__":
    main()