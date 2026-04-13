#!/usr/bin/env python3

import urllib.request
import urllib.error
import json
import http.cookiejar
import time

BACKEND_URL = "http://12.24.5.100:8085"
LOGIN_URL = f"{BACKEND_URL}/v1/auth/authenticate"
USERS = [
    {"email": "entreprise1@test.com", "password": "luca1593"},
    {"email": "entreprise2@test.com", "password": "luca1593"}
]

PAGES = [
    {"name": "Articles", "endpoint": "v1/articles/all"},
    {"name": "Clients", "endpoint": "v1/client/all"},
    {"name": "Fournisseurs", "endpoint": "v1/fournisseur/all"},
    {"name": "Categories", "endpoint": "v1/category/all"},
    {"name": "Entreprises", "endpoint": "v1/entreprise/all"},
    {"name": "Ventes", "endpoint": "v1/vente/all"},
    {"name": "Dashboard", "endpoint": "v1/dashboard/stats"},
    {"name": "Utilisateurs", "endpoint": "v1/utilisateur/all"}
]

def login_and_test(email, password, test_num):
    print(f"\n{'='*60}")
    print(f"TEST {test_num}: {email}")
    print(f"{'='*60}")
    
    # Step 1: Login
    print("\n[1] Login...")
    login_data = json.dumps({"login": email, "password": password}).encode('utf-8')
    req = urllib.request.Request(LOGIN_URL, data=login_data, headers={
        "Content-Type": "application/json"
    })
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode('utf-8'))
            token = result.get('accessToken')
            if not token:
                print(f"  ❌ Login failed: No token")
                return False, {}
            print(f"  ✅ Login successful, token: {token[:50]}...")
    except urllib.error.HTTPError as e:
        print(f"  ❌ Login HTTP error: {e.code}")
        return False, {}
    except Exception as e:
        print(f"  ❌ Login error: {e}")
        return False, {}
    
    # Step 2: Get user info
    print("\n[2] Get user info...")
    user_info = {}
    try:
        user_url = f"{BACKEND_URL}/v1/utilisateur/email/{email}"
        req = urllib.request.Request(user_url, headers={
            "Authorization": f"Bearer {token}"
        })
        with urllib.request.urlopen(req, timeout=10) as response:
            user_info = json.loads(response.read().decode('utf-8'))
            print(f"  ✅ User: {user_info.get('nom')} {user_info.get('prenom')}")
            print(f"      Email: {user_info.get('email')}")
            print(f"      Entreprise: {user_info.get('entreprise')}")
            print(f"      Rôle: {user_info.get('role')}")
    except Exception as e:
        print(f"  ⚠️ Get user error: {e}")
    
    # Step 3 & 4: Test all pages
    success_count = 0
    total_pages = len(PAGES)
    
    for page in PAGES:
        print(f"\n[TEST PAGE: {page['name']}]")
        try:
            url = f"{BACKEND_URL}/{page['endpoint']}"
            req = urllib.request.Request(url, headers={
                "Authorization": f"Bearer {token}"
            })
            with urllib.request.urlopen(req, timeout=15) as response:
                data = json.loads(response.read().decode('utf-8'))
                if isinstance(data, list):
                    count = len(data)
                    print(f"  ✅ {page['name']}: {count} enregistrements")
                    if count > 0:
                        success_count += 1
                        # Show first record
                        first = data[0]
                        print(f"      Sample: {str(first)[:100]}...")
                elif isinstance(data, dict):
                    print(f"  ✅ {page['name']}: {list(data.keys())}")
                    success_count += 1
                else:
                    print(f"  ✅ {page['name']}: OK")
                    success_count += 1
        except urllib.error.HTTPError as e:
            print(f"  ❌ {page['name']}: HTTP {e.code}")
        except Exception as e:
            print(f"  ❌ {page['name']}: {e}")
    
    print(f"\n{'='*60}")
    print(f"RÉSUMÉ - TEST {test_num} ({email})")
    print(f"{'='*60}")
    print(f"Pages avec données: {success_count}/{total_pages}")
    
    return True, user_info

def main():
    print("="*60)
    print("TEST COMPLET DE SESSION ET CHARGEMENT DES DONNÉES")
    print("="*60)
    
    all_results = []
    
    # Run tests multiple times for each user
    for user in USERS:
        for i in range(1, 3):  # 2 tests per user
            email = user["email"]
            password = user["password"]
            
            success, user_info = login_and_test(email, password, f"{email} - Test {i}")
            all_results.append({
                "user": email,
                "test_num": i,
                "success": success,
                "user_info": user_info
            })
            
            print("\n" + "="*60)
            print(f"Pausing 2 seconds before next test...")
            print("="*60 + "\n")
            time.sleep(2)
    
    # Print final summary
    print("\n" + "="*60)
    print("RÉSUMÉ FINAL")
    print("="*60)
    for r in all_results:
        status = "✅" if r["success"] else "❌"
        print(f"{status} {r['user']} - Test {r['test_num']}")
        if r.get('user_info'):
            ui = r['user_info']
            print(f"   User: {ui.get('nom')} {ui.get('prenom')} ({ui.get('entreprise')})")

if __name__ == "__main__":
    main()