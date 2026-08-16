# Suleiman — Portfolio + Content Studio

A React + TypeScript portfolio with a private `/admin` content studio built
on top of it. There is still **no backend and no database** — this is a
static site you can host anywhere, and the "CMS" is a real, working admin
UI backed by your browser's storage. Read the "How content actually works"
section below before you assume this behaves like a hosted CMS (WordPress,
Contentful, etc.) — it doesn't, and the differences matter.

---

## Quick start

```bash
npm install
cp .env.example .env    # then open .env and set a real admin password
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173) for the
public site, and http://localhost:5173/admin/login for the content studio.

Build for production:

```bash
npm run build
```

This outputs a static `dist/` folder — deploy it anywhere that serves
static files (Vercel, Netlify, GitHub Pages, S3, or the Docker setup below).

---

## Environment variables

This project talks to zero third-party services — no Supabase, no Firebase,
no analytics, no payment provider, nothing. So there is exactly **one**
environment variable, defined in `.env.example`:

| Variable | Required? | What it does |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | No (defaults to `changeme123`) | The password the `/admin/login` screen checks against. |

To set it locally:

```bash
cp .env.example .env
# then edit .env:
VITE_ADMIN_PASSWORD=something-only-you-know
```

**Important — read this before you rely on it for anything:** Vite only
reads `VITE_`-prefixed variables at **build time** and bakes the value
directly into the JavaScript bundle every visitor downloads. There is no
server here to keep it secret. Anyone who opens their browser's dev tools
and looks at the bundled source can read the password out of it directly.

What this setup *does* give you:
- You're not hardcoding a password in source control (`.env` is
  gitignored; only `.env.example` — with a placeholder — is committed).
- You can build the same code with a different password per deployment
  (see the Docker section below) without touching a single line of code.

What it does **not** give you: real authentication. If you ever want
`/admin` to be genuinely secure (not just "not casually stumbled into"),
you need an actual backend that checks the password server-side and issues
a session — e.g. a small serverless function plus a hashed password that
only that server ever sees. That's a real architecture change, not a
config tweak, and is out of scope for a backend-free static site.

---

## How content actually works (read this before editing anything)

Everything you manage from `/admin` — projects, blog posts, creative work,
pricing, the pipeline steps, your bio, contact links, site settings — is
stored in **your browser's `localStorage`**, not a database. Concretely:

- Editing something in `/admin` on your laptop does **not** appear on your
  phone, in anyone else's browser, or on your actual deployed site — only
  in the exact browser you edited from.
- The file `src/cms/defaultContent.ts` is what every *fresh* visitor (and
  every fresh browser, including yours after a cache clear) actually sees.
  That file is the real source of truth for the deployed site.
- To make an edit permanent for everyone: open `/admin/settings`, click
  **Export data (.json)**, open the downloaded file, and paste its
  contents into `src/cms/defaultContent.ts`, then rebuild/redeploy.

This is the honest ceiling of a CMS with no server. It's a deliberate
trade-off for a project with no hosting budget — see `src/cms/ContentContext.tsx`
for the full reasoning, and the note at the end of this README for what a
real (paid or self-hosted) backend upgrade path would look like.

### Where each content type lives

All of it is edited from `/admin` now — you shouldn't need to touch source
code for routine content changes. For reference, this is what backs each
admin section:

| Admin section | Powers | CMS file |
|---|---|---|
| Projects | The Work grid | `src/cms/types.ts` → `ProjectItem` |
| Creative Work | The Creative gallery | `GalleryItemCMS` |
| Blog | The Blog section | `BlogPostCMS` |
| Services | The 5-step numbered pipeline | `ServiceItem` |
| Pricing | The Hire Me tiers + booking form's package dropdown | `TierItem` |
| About & Hero | Name, tagline, bio, stats, closing CTA copy | `HeroContent` |
| Settings → Site | Browser tab title, footer tagline, top-bar location | `SiteSettings` |
| Settings → Contact channels | WhatsApp / LinkedIn / email everywhere on the site | `ContactLinksContent` |

**Left out of the CMS on purpose:** the Games section's rules text, the
marquee's four value-words, and the code-playground's snippets. These are
decorative/dev-flavor content, not marketing copy that changes — editing
them means editing `src/components/Games.tsx`, `src/components/MarqueeBand.tsx`,
and `src/data/snippets.ts` directly.

### Uploading images/videos

The `ImageUploader` used throughout `/admin` gives you two options, because
there's no real upload server behind it:

1. **Pick or drop a file** — read as base64 and stored directly in
   localStorage. Fine for a quick local preview; doesn't exist anywhere
   else (see the localStorage note above). Past a few hundred KB per file
   this fills up the ~5–10MB localStorage budget fast — you'll see a
   warning if a file's getting large.
2. **Paste a URL, or a `/media/...` path** — for a file you've actually
   placed in `public/media/` and committed to the repo. This is the only
   option that works for every visitor once deployed.

---

## Docker

Runs the whole thing in a container: a Node stage builds the static site,
then an nginx stage serves it — no Node.js or source code in the final
image, just compiled HTML/CSS/JS and a web server.

### Option A — docker compose (easiest)

```bash
cp .env.example .env      # set VITE_ADMIN_PASSWORD in it first
docker compose up --build
```

Visit http://localhost:8080. Compose reads `VITE_ADMIN_PASSWORD` from your
`.env` file automatically and passes it through as a build arg.

### Option B — plain Docker

```bash
docker build --build-arg VITE_ADMIN_PASSWORD=your-real-password -t suleiman-portfolio .
docker run -p 8080:80 suleiman-portfolio
```

Visit http://localhost:8080.

**Remember:** `VITE_ADMIN_PASSWORD` is baked into the image at *build*
time (see the Environment variables section above for why). Changing it
later means rebuilding the image, not just restarting the container —
`docker run -e VITE_ADMIN_PASSWORD=...` will NOT change it, because by the
time the container runs, the JS bundle is already compiled.

`nginx.conf` includes the one thing a plain static file server gets wrong
for a client-side-routed app: it falls back to `index.html` for any path
that isn't a real file on disk, so refreshing the browser on `/admin/projects`
(or any other in-app route) works instead of 404ing.

---

## Feature notes

### The booking modal
Clicking "Book a slot" on any tier card, or "Start a booking" in the
Contact section, opens a modal form (`src/components/BookingModal.tsx`)
instead of jumping to a plain contact block. It asks a few quick questions
and — since there's no backend — submitting it builds a pre-filled
`mailto:` link so the request lands directly in your inbox. The
destination email and the package dropdown options both come from the CMS
now (Settings → Contact channels, and Pricing).

### The shrinking nav bar
The bottom pill nav (`src/components/BottomNav.tsx`) starts fully
expanded. Click any link and it collapses down to just your logo + that
one link — click the logo again to bring the full nav back. Deliberate,
not a bug: keeps the nav out of the way once someone's committed to a
section, especially on small phone screens.

### Real contact channels (WhatsApp / LinkedIn / Email)
Set these once at `/admin/settings` → "Contact channels" — no code
editing needed. They power the `QuickContact` buttons in the top bar, the
Contact section, and the footer.

### Dark / light theme
A toggle in the top bar (`ThemeToggle.tsx`) flips the whole site. The
choice is saved to `localStorage` and defaults to the visitor's OS-level
preference on first visit. See `src/context/ThemeContext.tsx`. Colors are
split into two layers in `src/index.css`: fixed brand colors (`--cream`,
`--ink`, the pastel set) that never change with the theme, and flipping
chrome tokens (`--surface`, `--surface-2`, `--text`, `--accent-text`) that
do. If you add a new section, decide which layer it belongs to before
picking a color variable.

### Games
`src/components/Games.tsx` shows all three mini-games in one grid, nothing
behind tabs: **Tic-Tac-Toe** (full local 2-player logic), **Darts**
(click-to-throw SVG dartboard), and **Chess** (real legal-move validation
via `chess.js` — check, checkmate, castling, en passant all work; no AI,
two people share one board; pawns always promote to a queen).

### Loading screen
`src/components/LoadingScreen.tsx` shows a brief full-screen splash on
first load and fades itself out — nothing real is being loaded, it's a
fixed ~1.3s entrance moment. Only shown on the public site, not `/admin`.

### View counter
The footer shows a small "views on this device" count
(`src/cms/useLocalViewCount.ts`). Read that file's comment before assuming
it's real traffic analytics — it counts page loads in each visitor's own
browser (once per tab session), not unique visitors across everyone who's
ever come to the site. A real visitor counter needs a server to tally
requests from everyone, which this project doesn't have.

### The code playground
`src/components/CodePlayground.tsx` renders editable text snippets from
`src/data/snippets.ts` — a visual/interactive touch, not a real
interpreter. Nothing executes; it shows visitors how you write code and
lets them tinker with it.

---

## The admin login itself

`/admin/login` is a password gate, not real authentication — see the
Environment variables section above, and the comment at the top of
`src/admin/AdminAuthContext.tsx`, for exactly what that does and doesn't
protect against.

---

## If you outgrow the localStorage CMS

The honest next step, when "export JSON and paste it into a file" stops
being enough, is adding a real backend. The architecture here is already
set up to make that a swap, not a rewrite: `ContentContext.tsx` is the one
place every component reads content from — replacing its localStorage
read/write with `fetch()` calls to a real API (or a free-tier service like
Supabase, which bundles a Postgres database, real authentication, and file
storage on one free plan) means no component outside `cms/` has to change.
That's future work, not something this build includes.

---

## Notes

- `npm run build` runs `tsc -b` before `vite build` — a type error fails
  the build, which is deliberate.
- Blog posts, projects, etc. seeded in `src/cms/defaultContent.ts` are
  starter/placeholder content — replace them with your real work via
  `/admin`, then export and paste back into that file to make it stick.
- No API keys, third-party accounts, or paid services required to run
  this anywhere, containerized or not.
