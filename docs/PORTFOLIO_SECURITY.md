# OBHASH Portfolio Security & Privacy Architecture

## 1. Core Principles: Private by Default

All user data, assessment diagnostic results, coaching conversation logs, and challenge drafts are **strictly private by default**. A learner’s growth profile is never indexed, discovered, or shared unless the user explicitly executes a publication action.

---

## 2. Row Level Security (RLS) Policies

Every Phase 7 table in PostgreSQL has RLS explicitly enabled:

```sql
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_publication_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.independence_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.independence_measurement_snapshots ENABLE ROW LEVEL SECURITY;
```

### 2.1 Owner Privileges
Learners possess exclusive mutation and read privileges over their own portfolio and observations:
```sql
CREATE POLICY "Users can manage their own portfolio"
    ON public.portfolios FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

### 2.2 Controlled Public Read Policy
Public access (for both anonymous visitors and authenticated peers) is strictly scoped to published portfolios:
```sql
CREATE POLICY "Public can view published portfolios"
    ON public.portfolios FOR SELECT
    TO anon, authenticated
    USING (is_published = true AND visibility IN ('public', 'unlisted'));
```

---

## 3. Server-Side Data Filtering & Sanitization

Even if an unauthorized caller attempts to query the public route `/p/[publicSlug]`:
1. `getPublicPortfolioBySlug(slug)` enforces server-side validation:
   - If `!portfolio.isPublished` or `portfolio.visibility === 'private'`, the server immediately returns `null`, triggering a Next.js `notFound()` 404 response.
2. Internal database IDs (such as `user_id`, `portfolio_id`, internal authentication tokens) are filtered out before sending data to the client.
3. Private coaching conversation transcripts and raw diagnostic assessment items are never transmitted via the public showcase API.
4. Users can instantly unpublish their portfolio at any time via a single click (**Unpublish (Make Private)**), which immediately revokes public access and revalidates Next.js cached routes.
