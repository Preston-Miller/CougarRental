# VibeSec Security Report
Repo: Preston-Miller/CougarRental
Scanned: 2026-03-01 01:26:27 UTC
Issues Found: 4

## [SEV-001] CRITICAL -- Generic secret

**File:** public/app.js
**Type:** JavaScript
**Line:** 3
**Evidence:** `API_KEY = 'REPLACE_ME_API_KEY_HARDCODED_IN_CLIENT'`
**Risk:** Sensitive information is hardcoded in the client-side JavaScript. An attacker can view the source code and extract secrets.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove hardcoded secrets and use environment variables or secure storage.
**Verify:** Review the client-side code to ensure no secrets are present.

## [SEV-002] CRITICAL -- Generic secret

**File:** public/app.js
**Type:** JavaScript
**Line:** 38
**Evidence:** `api_key=${encodeURIComponent(apiKey)}`,`
**Risk:** Sensitive information is hardcoded in the server-side JavaScript. An attacker with server access can read these secrets.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove hardcoded secrets and use environment variables or secure storage.
**Verify:** Review the server-side code to ensure no secrets are present.

## [SEV-003] CRITICAL -- .env: dotenv_not_gitignored

**File:** .env
**Type:** Environment file
**Detail:** .env is committed and not listed in .gitignore
**Risk:** .env file is not listed in .gitignore. Anyone with repository access can view sensitive information.

**OWASP Category:** Secrets in Configuration
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Add .env patterns to .gitignore and remove tracked sensitive files.
2. Purge sensitive values from repository history if previously committed.
3. Rotate credentials after cleanup.

**Fix Steps:**
1. Add .env to .gitignore and remove it from the repository.
**Verify:** Check the repository to ensure .env is not committed.

## [SEV-004] CRITICAL -- .env: dotenv_has_real_values

**File:** .env
**Type:** Environment file
**Detail:** Key NODE_ENV has a non-placeholder value
**Risk:** The .env file has actual configuration values. Exposed .env file allows attackers to use real values for unauthorized access.

**OWASP Category:** Secrets in Configuration
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Replace real .env credentials with runtime-injected secrets.
2. Store secret material outside source control.
3. Rotate exposed keys before redeploying.

**Fix Steps:**
1. Replace real values with placeholders and secure the file.
**Verify:** Review the .env file to ensure it has no real values.
