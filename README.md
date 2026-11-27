# Under25 Community Dashboard (Campus Fellowship 2026-27)

A role-based, interactive dashboard for the Under25 community. Frontend only: all data is demo data and every
interaction (RSVPs, tasks, forms, sign-ups, approvals) is saved in the browser's `localStorage`, so it deploys anywhere
as static files and can be swapped to a real backend later.

## See it right now

Double-click **`Under25-Dashboard.html`**. It is the whole app in one file (no server needed).
Live site: https://arnavarora-alt.github.io/FellowshipDashboard/

## Run and build

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # deployable site in dist/
npm run build:single   # one-file build in dist-single/index.html
npm test               # verifies roles, approvals, first-login briefings and the colour palette
```

Hash routing and relative asset paths, so `dist/` works on GitHub Pages, Netlify, Vercel or any static host. A GitHub Actions
workflow (`.github/workflows/deploy.yml`) publishes to GitHub Pages on every push to `main`.

## One login, six experiences, plus sign-up

Log in with a user ID and password; the ID decides the experience. The login page lists every demo account and has a
**New to the community? Sign up!** link.

| Role | User ID | Password |
| --- | --- | --- |
| Under25 Team (admin / backend) | `u25-admin` | `Under25@Admin` |
| Fellow | `fellow-bnmit` | `Fellow@2026` |
| Head of Content | `hoc-bnmit` | `Content@2026` |
| Head of Operations | `hoo-bnmit` | `Events@2026` |
| Core team member | `core-bnmit` | `Core@2026` |
| Community member | `member-bnmit` | `Member@2026` |

These are demo credentials baked into the bundle. Replace the login with real authentication before going live.

### Sign-up and approvals

New people give name, college, email, phone and a photo, and pick what they are joining as.

| Joining as | Approved by |
| --- | --- |
| Community member | Nobody. ID and password are issued straight away |
| Core team member | Head of Content (Content team) or Head of Operations (Operations team), or the Fellow, of the same college |
| Head of Content, Head of Operations | The Fellow of the same college |
| Fellow | The Under25 admin team |

On approval an ID and password are generated and emailed. There is no mail server in this prototype, so every email lands in the
**Demo mailbox** (`#/mailbox`, linked from the login page). Wire `sendMail` in `src/store/AppState.jsx` to a real service later.

## First-login "agent select" entry

Every user's first login opens a Valorant-style sequence: role reveal (a Fellow's five roles are shown large), hold to lock in,
then a mission briefing. It can be replayed from the profile menu.

| Role | Sees first |
| --- | --- |
| Fellow | Playbook, Drills, Club page resources, List your on-ground event |
| Head of Content | Club page hygiene check, Content ideas bank, Team launch post task, one more upcoming task |
| Head of Operations | Event ideas, Event calendar, List your event |
| Core team | What's new, City meetup, First task |
| Community member | Community updates, Upcoming events, Opportunity to join the core team |
| Admin | Applications, Fellow health, Events to review, Full database |

## Home

Every Home opens with the greeting, then big colour **standing tiles** (a Fellow sees followers, core team built, events run and unlocks
earned, with progress and the current semester), then a **Spotlight** carousel of pinned banners (modelled on the Under25 app): next digital
sessions, upcoming community events, MVPs of the month (Instagram link), community standouts, challenge of the month. Admins manage
the banners under **Spotlight banners**. Below: stats, quick actions, tasks, coming up, what other campuses are hosting, Campus
Partners (tap one to meet its Fellow, Head of Content and Head of Operations), RSVP links to the Under25 app, photos from recent events that
open Instagram, and a coloured, clickable What's new.

## Events and forms

- **RSVPs.** On-ground events: only community members RSVP. Digital sessions (Weekly Hang Session, Draft Room, Townhall, Academy):
  everyone RSVPs on Google Calendar. City meetups and the talent hunt: RSVP in the app.
- **Executed events.** Fellows and Heads of Operations mark an on-ground event executed with attendees, a description, a Drive
  link to all the photos, an Instagram post link and one small cover JPG. It only counts as executed once that report is filed.
- **No photo uploads.** Photos are not stored on the dashboard. Teams share Drive links (all collected in the admin *Drive links sheet*,
  CSV download) plus one limited-size JPG per event for Home. Fresh from campus tiles open the campus's Instagram post.
- **List an event** is an in-site form (page 1 mirrors the Under25 Google Form). Admin reviews it under *Events and RSVPs*; approving
  makes it live. Every form on the site shows under *Form submissions* with a CSV download (opens in Excel).
- Other in-site forms: Summit slot request (with a Drive link to auditorium photos), club page login (Fellow task, admin-only log), Campus Agreement
  upload, monthly insight form (a mandatory task on the 25th for Fellows and Heads of Operations), successor nomination, Campus
  Awards nomination (opens in March).
- **Campus Agreement.** A Fellow uploads the signed agreement; on admin approval the college gets a **Campus Partner** tag shown to
  everyone, and the Fellow unlocks *Campus Partner next steps* (content to be announced).

Form definitions live in `src/data/forms.js`.

## Access rules

All routing and navigation come from one registry: [`src/data/features.js`](src/data/features.js).

- Assign task: Fellow, Head of Content, Head of Operations (and admin).
- Your team, Team structure, College journey, Milestones, Challenges, Branded opportunities, Need help: Fellow, Head of Content, Head of Operations, Core team.
- Fellow only: Playbook (PDF embedded), Drills (embedded), Campus Awards, Campus Agreement, Summit slot request, club recruitment, alumni of their own college.
- Admin sees every page plus the backend tools: full database (CSV), applications, events and RSVPs, form submissions, credentials log,
  campus agreements, spotlight banners, leadership directory, team calls, Fellow health, analytics, program calendar. `Ctrl K` searches everything.

## Design

Colours come only from the two PDFs: ink `#121A17`, yellow `#FFD12F`, orange `#FF5A00`, purple `#4D298E`, green `#085939`, plus their
tints (checked by `npm test`). Each role gets one accent. Type is Archivo (display) and Inter (body). Motion follows Emil Kowalski's
principles: ease-out curves, press feedback, springs only for decorative 3D tilt, and `prefers-reduced-motion` respected.

## Layout

```
src/data/        roles, access registry, forms, program content, demo data
src/store/       app state + localStorage persistence
src/lib/         approvals, tasks, image helpers
src/components/  shell, command palette, Spotlight, UI kit (tilt cards, forms, tables, charts)
src/pages/       Login, Signup, RoleIntro, Home and one module per area
scripts/verify.mjs   access, approvals and palette checks (npm test)
```
