# Under25 Campus Fellowship Dashboard 2026-27

A role-based, interactive dashboard for the Under25 Campus Fellowship. Frontend only: all data is demo data and every
interaction (RSVPs, tasks, forms, checklists) is saved in the browser's `localStorage`, so it can be deployed anywhere
as static files and swapped to a real backend later.

## See it right now

Double-click **`Under25-Dashboard.html`**. It is the whole app in one file (no server needed).

## Run and build

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # deployable site in dist/
npm run build:single   # one-file build in dist-single/index.html
npm test               # verifies the role-access matrix, first-login briefings and palette
```

Uses hash routing and relative asset paths, so `dist/` works on GitHub Pages, Netlify, Vercel or any static host.
A GitHub Actions workflow (`.github/workflows/deploy.yml`) publishes to GitHub Pages on every push to `main`
(set **Settings > Pages > Source** to **GitHub Actions** once).

## One login, six experiences

Log in with a user ID and password; the ID decides the experience. The login page lists every demo account.

| Role | User ID | Password |
| --- | --- | --- |
| Under25 Team (admin / backend) | `u25-admin` | `Under25@Admin` |
| Fellow | `fellow-bnmit` | `Fellow@2026` |
| Head of Content | `hoc-bnmit` | `Content@2026` |
| Head of Operations | `hoo-bnmit` | `Events@2026` |
| Core team member | `core-bnmit` | `Core@2026` |
| Community member | `member-bnmit` | `Member@2026` |

These are demo credentials baked into the bundle. Replace the login with real authentication before going live.

## First-login "agent select" entry

Every user's first login opens a Valorant-style sequence: role reveal, hold to lock in, then a mission briefing.
It can be replayed from the profile menu.

| Role | Sees first |
| --- | --- |
| Fellow | Playbook, Drills, Club page resources, List your on-ground event |
| Head of Content | Club page hygiene check, Content ideas bank, Team launch post task, one more upcoming task |
| Head of Operations | Event ideas, Event checklists, Event guidelines |
| Core team | What's new, City meetup, First task |
| Community member | Community updates, Upcoming events, Opportunity to join the core team |
| Admin | Applications, Fellow health, Events to review, Full database |

## Access rules

All routing and navigation come from one registry: [`src/data/features.js`](src/data/features.js).

- City meetups, College journey, Need help, Your team, Branded opportunities, Challenges: Fellow, Head of Content, Head of Operations, Core team (and admin).
- Assign task: Fellow, Head of Content, Head of Operations (and admin).
- Admin sees every page, plus the backend tools: full database (CSV export), fellowship applications (accept, reject, interview),
  events and RSVPs, assign events, assign tasks, leadership directory, team calls, credentials log, branded missions listing,
  Fellow health (MIA check-in script), program analytics and the program calendar. Press `Ctrl K` for search across everything.

## Added beyond the spreadsheet (from the Playbook and Operator Guide)

Six-semester roadmap and unlocks, Under25 Plaque tiers (3k, 10k, 20k followers), Summit at Campus eligibility
(1,000 followers and 100 members), Campus Awards (6 categories, 25 awards) with a proof tracker and nominations,
the seven golden rules and rituals, the four recurring sessions, the Under25 Care team directory, the 12-month program
calendar, Fellow recruitment pipeline, MIA check-in scripts, batch analytics, and the Fellow Notion drills and resources.

## Design

Colours come only from the two PDFs: ink `#121A17`, yellow `#FFD12F`, orange `#FF5A00`, purple `#4D298E`, green `#085939`,
plus their tints. Each role gets one accent. Type is Archivo (display) and Inter (body). Motion follows Emil Kowalski's
principles: ease-out curves, press feedback, springs only for decorative 3D tilt, and `prefers-reduced-motion` respected.

## Layout

```
src/data/        roles, access registry, program content, demo data
src/store/       app state + localStorage persistence
src/components/  shell, command palette, UI kit (tilt cards, forms, tables, charts)
src/pages/       Login, RoleIntro, Home and one module per area
scripts/verify.mjs   access-matrix and palette checks (npm test)
```
