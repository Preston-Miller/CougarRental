# Cougar Rental — Security Scanner Test App

A minimal "cougar rental" web app used to test a security scanner. It contains **intentional** vulnerabilities that automated tools and coding agents often introduce.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000

## Intended vulnerabilities (for scanner testing)

- **Hardcoded secrets** — API keys, DB password, JWT secret, Stripe key, AWS keys in `server.js` and `public/app.js`.
- **.env exposure** — `.env` is present with realistic-looking secrets and is meant to be committed (do not do this in real projects). The `/api/debug/config` route reads and returns `.env` contents.
- **Vulnerable dependencies** — `package.json` pins known vulnerable versions:
  - `lodash@4.17.15` — prototype pollution (CVE-2019-10744, etc.)
  - `express@4.16.4` — older version with known issues
  - `jsonpath-plus@5.0.0` — RCE (CVE-2024-21534; fix in 10.2.0+)
  - `minimist@1.2.0` — prototype pollution
  - `dotenv@8.2.0` — outdated

Your scanner should flag hardcoded secrets, committed `.env`, and these dependency CVEs.

## Changelog

- **1.0.1** — Added `/api/health` endpoint for monitoring; no secrets exposed.
