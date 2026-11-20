# OBHASH Environment Configuration Reference

**Phase:** 1 of 8  
**Scope:** Environment Variables & Security Segregation

---

## 1. Principles of Environment Security

1. **No Hardcoded Secrets**: Secrets must never be committed into Git or hardcoded in source files.
2. **Server-Side Confinement**: Keys that bypass permissions (e.g. `SUPABASE_SERVICE_ROLE_KEY`) or cost-bearing tokens (`GEMINI_API_KEY`) must NEVER use the `NEXT_PUBLIC_` prefix.
3. **Graceful Degradation**: The application and health check endpoints must safely report missing configuration rather than crashing unexpectedly.

---

## 2. Environment Variables Catalog

| Variable Name | Scope | Default / Example | Required | Purpose |
|---|---|---|---|---|
| `NODE_ENV` | Server | `development` | No | Node execution mode (`development`, `test`, `production`) |
| `PORT` | Server | `3000` | No | Local web server listening port |
| `NEXT_PUBLIC_APP_URL` | Client / Server | `http://localhost:3000` | Yes | Base URL used for canonical links and redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Client / Server | `https://xyz.supabase.co` | Required for DB | Supabase project API gateway endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client / Server | `eyJhbGci...` | Required for DB | Public client anonymous JWT key for Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server Only (SECRET)** | `eyJhbGci...` | For Admin Tasks | Privileged key bypassing RLS. Must NEVER reach the browser |
| `AI_PROVIDER` | Server | `gemini` | No | Active LLM adapter (`gemini` or `openai`) |
| `AI_MODEL_NAME` | Server | `gemini-2.5-flash` | No | Target model identifier |
| `AI_TIMEOUT_MS` | Server | `30000` | No | Max timeout in milliseconds for AI requests |
| `GEMINI_API_KEY` | **Server Only (SECRET)** | `AIzaSy...` | If using Gemini | Google Gemini API key for server-side AI calls |
| `OPENAI_API_KEY` | **Server Only (SECRET)** | `sk-...` | If using OpenAI | OpenAI API key for server-side AI calls |

---

## 3. Git Exclusion Verification

The `.gitignore` file enforces that secrets are excluded:
```gitignore
# env files
.env*.local
.env
!.env.example
```

Run this command anytime to verify no secret files are tracked:
```bash
git ls-files | grep "\.env"
```
The ONLY file returned must be `.env.example`.
