# Braga Event

A youth-focused event discovery platform for Braga, Portugal. Public visitors
browse events and promoted local banners with no account needed; a private
admin dashboard at `/admin` lets the site owner manage everything.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Prisma
(PostgreSQL).

## Stack

- **Next.js 16** — App Router, Server Actions, Server Components
- **Prisma 6 + PostgreSQL** — `Event`, `Banner`, `Category`, `Admin` models
- **next-intl** — Portuguese / English / Arabic localization for the
  public site, with RTL support for Arabic
- **jose** — signed JWT session cookies for admin auth (no third-party auth
  provider)
- **bcryptjs** — password hashing
- **zod** — form validation on every Server Action
- **Tailwind CSS v4** — custom design tokens (colors, fonts) in
  `src/app/globals.css`

## Languages

The public site is available in three languages, selectable via the
language switcher in the header (desktop) or mobile menu:

- `/pt` — Português (default)
- `/en` — English
- `/ar` — العربية (rendered right-to-left)

Visiting `/` redirects to the browser's preferred language (falling back
to Portuguese). Translation strings live in `messages/{pt,en,ar}.json`.

The `/admin` dashboard is intentionally **not** localized — it always
renders in Portuguese, since it's only used by the site owner, and is
excluded from the locale routing entirely.

## Getting started

Install dependencies (already done if you're reading this after setup):

```bash
npm install
```

You need a PostgreSQL database. Options:

- **Local:** run Postgres via Docker: `docker run --name bragaevent-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`
- **Cloud (recommended for zero setup):** create a free database with
  [Prisma Postgres](https://www.prisma.io/postgres), [Neon](https://neon.tech),
  or [Supabase](https://supabase.com), and copy its connection string.

Update `.env` with your connection string:

```bash
DATABASE_URL="postgresql://user:password@host:5432/bragaevent"
SESSION_SECRET="<a long random string>"       # generate with: openssl rand -base64 32
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Important:** `SESSION_SECRET` signs admin session cookies. Use a strong,
unique value in production — never reuse the development default.

Run the initial migration (creates all tables in your Postgres database):

```bash
npx prisma migrate deploy
```

(Use `npm run db:migrate` instead if you plan to keep evolving the schema
locally — it runs `prisma migrate dev`, which also generates new migration
files when the schema changes.)

Seed sample Braga data (8 categories, 12 events, 4 banners, and an admin
account):

```bash
npm run db:seed
```

This prints and creates an admin login:

- **Email:** `admin@bragaevent.pt`
- **Password:** `BragaEvent#2026`

Change this password immediately after first login via
`/admin/configuracoes`, or edit `prisma/seed.ts` before seeding a real
deployment.

Start the dev server:

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)
  (redirects to `/admin/login` if not authenticated)

## Production build

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Import the GitHub repo in Vercel.
2. Add the **Prisma Postgres** integration from the "Optional Integrations"
   step (or Storage tab) — this automatically provisions a pooled
   `DATABASE_URL` for your project. Alternatively, use Neon/Supabase and
   set `DATABASE_URL` manually in Project Settings → Environment Variables.
3. Also set `SESSION_SECRET` (a strong random value) and
   `NEXT_PUBLIC_SITE_URL` (your production domain) as environment
   variables.
4. Deploy. The `postinstall` script runs `prisma generate` automatically
   on every build.
5. After the first deploy, run the migration against your production
   database once (from your machine, with `DATABASE_URL` pointed at
   production): `npx prisma migrate deploy`. Then seed it if you want the
   sample Braga data: `npm run db:seed`.

**Change the seeded admin password immediately** after your first deploy
if you seeded production data — see `npm run db:seed` output below.

## Project structure

```
messages/
  pt.json, en.json, ar.json   Translation strings for the public site
prisma/
  schema.prisma        Event / Banner / Category / Admin models
  seed.ts              Sample Braga data + admin account
src/
  i18n/
    routing.ts          Supported locales, default locale, RTL list
    navigation.ts        Locale-aware Link / useRouter / usePathname
    request.ts           next-intl request config (loads messages)
  app/
    [locale]/            Localized public site — its own root layout
                         (separate <html>, sets dir="rtl" for Arabic)
      (public)/          Route group sharing header/footer
        page.tsx          Homepage
        eventos/          Listing + filters, event detail pages
        categorias/       Category browser
        privacidade/      Privacy Policy
        termos/           Terms & Conditions
      opengraph-image.tsx Per-locale social preview image
    admin/               Non-localized, Portuguese-only. Separate root
                         layout, completely independent from [locale].
      login/              Login page (outside the authenticated shell)
      (dashboard)/         Sidebar layout + dashboard, events, banners,
                           categories, settings — all require a session
    api/banners/[id]/click/  Banner click tracking endpoint
    sitemap.ts, robots.ts
  components/           UI, home, events, admin, legal component folders
  lib/
    actions/            Server Actions (auth, events, banners, categories, settings)
    data/                Read queries used by public pages
    prisma.ts, session.ts, password.ts, utils.ts, categoryStyles.ts
  proxy.ts               Combines the admin auth guard with next-intl's
                         locale routing (Next 16 renamed "middleware" to
                         "proxy" — same mechanism, one file total).
```

## Security notes

- The public site never links to `/admin`, `/login`, or any dashboard route.
  It is only reachable by typing the URL directly.
- `/admin/*` is protected twice: `src/proxy.ts` redirects unauthenticated
  requests before rendering starts, and every admin Server Component /
  Server Action independently calls `getSession()` as the authoritative
  check (the same pattern Next.js recommends, since proxy matchers can
  silently stop covering a route after a refactor).
- Passwords are hashed with bcrypt (12 rounds), never stored in plain text.
  Login timing is constant regardless of whether the email exists.
- `robots.txt` disallows `/admin`, and the admin layout sets
  `robots: { index: false, follow: false }`.
- Session cookies are `httpOnly`, `sameSite: lax`, and `secure` in
  production, with an 8-hour expiry.

## Banner scheduling

Banners have a `startDate`/`endDate` and a derived status
(`DRAFT` / `SCHEDULED` / `ACTIVE` / `EXPIRED` / `DISABLED`). Every read of
active banners on the public homepage opportunistically "settles" any
banner whose scheduled start/end has arrived, so campaigns activate and
expire automatically without a cron job.
