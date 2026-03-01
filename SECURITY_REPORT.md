# VibeSec Security Report
Repo: Preston-Miller/CougarRental
Scanned: 2026-03-01 01:25:35 UTC
Issues Found: 5

## [SEV-001] CRITICAL -- Generic secret

**File:** public/app.js
**Type:** JavaScript
**Line:** 3
**Evidence:** `API_KEY = 'REPLACE_ME_API_KEY_HARDCODED_IN_CLIENT'`
**Risk:** Sensitive information is hardcoded in the client-side code. An attacker views the source code and extracts the API key.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove hardcoded API keys and use environment variables instead.
**Verify:** Review the client-side code for hardcoded secrets.

## [SEV-002] CRITICAL -- Generic secret

**File:** public/app.js
**Type:** JavaScript
**Line:** 38
**Evidence:** `api_key=${encodeURIComponent(apiKey)}`,`
**Risk:** Sensitive information is hardcoded in the server-side code. An attacker accesses the server code and extracts secrets.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove hardcoded secrets and use environment variables.
**Verify:** Review the server-side code for hardcoded secrets.

## [SEV-003] CRITICAL -- Generic secret

**File:** server.js
**Type:** JavaScript
**Line:** 15
**Evidence:** `SECRET = 'REPLACE_ME_STRIPE_SECRET_HARDCODED'`
**Risk:** Multiple instances of hardcoded secrets in server-side code. An attacker accesses the server code and extracts multiple secrets.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove all hardcoded secrets and use environment variables.
**Verify:** Review the server-side code for hardcoded secrets.

## [SEV-004] CRITICAL -- .env: dotenv_not_gitignored

**File:** .env
**Type:** Environment file
**Detail:** .env is committed and not listed in .gitignore
**Risk:** .env file is committed to version control. An attacker accesses the version control system and retrieves sensitive information.

**OWASP Category:** Secrets in Configuration
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Add .env patterns to .gitignore and remove tracked sensitive files.
2. Purge sensitive values from repository history if previously committed.
3. Rotate credentials after cleanup.

**Fix Steps:**
1. Add .env to .gitignore to prevent it from being committed.
**Verify:** Check the .gitignore file and ensure .env is listed.

## [SEV-005] CRITICAL -- .env: dotenv_has_real_values

**File:** .env
**Type:** Environment file
**Detail:** Key NODE_ENV has a non-placeholder value
**Risk:** The .env file contains actual configuration values. An attacker accesses the .env file and retrieves real credentials.

**OWASP Category:** Secrets in Configuration
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Replace real .env credentials with runtime-injected secrets.
2. Store secret material outside source control.
3. Rotate exposed keys before redeploying.

**Fix Steps:**
1. Replace real values with placeholders and secure the file.
**Verify:** Review the .env file for real values.
