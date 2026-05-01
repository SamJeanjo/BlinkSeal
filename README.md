# BlinkSeal

Production-ready BlinkSeal rebuild using Next.js App Router, TypeScript, Tailwind CSS, Supabase, Clerk, and Vercel.

The Base44 export remains in the repo as visual and UX reference. The live app code is in `src/app`, `src/components/blinkseal`, and `src/lib`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Clerk authentication
- Supabase Postgres and private Storage
- Vercel hosting

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Create a Supabase project and run `supabase/migrations/001_initial_schema.sql`.

4. Confirm the Supabase Storage bucket named `documents` is private.

5. Create a Clerk application and add the Clerk keys to `.env.local`.

6. Start the app:

```bash
npm run dev
```

## Core Routes

- `/`
- `/dashboard`
- `/dashboard/documents`
- `/dashboard/documents/[id]`
- `/dashboard/upload`
- `/view/[token]`
- `/security`
- `/settings`

## Security Model

- Files are uploaded to a private Supabase Storage bucket.
- `SUPABASE_SERVICE_ROLE_KEY` is used only from server-only helpers, Server Actions, and the server-rendered public viewer route.
- Share links use high-entropy unique tokens.
- Public access always flows through `/view/[token]`.
- Valid views generate short-lived signed Supabase URLs.
- Expired or revoked links show a branded unavailable state.
- Every valid view is recorded in `view_events`.
- Owner identity is not exposed publicly.
- Public viewers never query Supabase tables directly.

## Supabase Setup

Create a new Supabase project, then run the initial migration:

```bash
supabase db push
```

If you are not using the Supabase CLI, open the Supabase SQL editor and paste the contents of:

```text
supabase/migrations/001_initial_schema.sql
```

The migration creates:

- `users`
- `documents`
- `share_links`
- `view_events`
- A private Storage bucket named `documents`
- RLS policies for owner-scoped user, document, share link, and view event access

The app currently performs privileged database and Storage operations from server-only code through the service role key. RLS remains enabled on all tables, and no anonymous table policies are created.

## Private Bucket

In Supabase, go to Storage and verify:

- Bucket name: `documents`
- Public bucket: off

Do not make this bucket public. The public viewer route creates short-lived signed URLs only after validating the share token server-side.

## Environment Variables

Set these in `.env.local` for local development and in Vercel Project Settings for production:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_APP_URL=

BLINKSEAL_CERT_PRIVATE_KEY_B64=
BLINKSEAL_CERT_PUBLIC_KEY_B64=
```

Treat `SUPABASE_SERVICE_ROLE_KEY` like a password. It bypasses RLS and must never be imported into client components or exposed with a `NEXT_PUBLIC_` prefix.
Treat `BLINKSEAL_CERT_PRIVATE_KEY_B64` the same way. It signs court-ready certificate payloads and must remain server-side only.

## Test Flow

1. Sign in with Clerk.
2. Open `/dashboard/upload`.
3. Upload a PDF or image.
4. Open the document detail page and generate a secure link.
5. Copy the `/view/[token]` link.
6. Open the link in a private browser session.
7. Confirm the file loads through a signed URL and a view event appears in the proof timeline.
8. Revoke the link from the document detail page.
9. Reopen the public link and confirm the branded “Link unavailable” page appears.

## Deployment

Deploy to Vercel and set the same environment variables from `.env.example`.

Set `NEXT_PUBLIC_APP_URL` to the deployed app URL, for example:

```bash
NEXT_PUBLIC_APP_URL=https://app.blinkseal.io
```
