// Static verification of the role-access matrix and first-login briefings against the product brief.
// Run with: npm test
import { FEATURES, canAccess, featuresFor } from '../src/data/features.js';
import { BRIEFINGS, USERS, ROLES } from '../src/data/roles.js';
import { readFileSync } from 'node:fs';

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error(`FAIL  ${msg}`); } else console.log(`ok    ${msg}`); };

const LEAD = ['fellow', 'hoc', 'hoo', 'core'];
// Shared by Fellow, Head of Operations, Head of Content and core team (brief)
for (const k of ['citymeetups', 'journey', 'help', 'team', 'branded', 'challenges']) {
  ok(LEAD.every((r) => canAccess(r, k)) && canAccess('admin', k) && !canAccess('community', k), `${k}: all leads + admin, not community`);
}
// Assign task: Fellow, HoC, HoO (and admin)
ok(['fellow', 'hoc', 'hoo', 'admin'].every((r) => canAccess(r, 'assigntask')), 'assigntask: fellow, hoc, hoo, admin');
ok(!canAccess('core', 'assigntask') && !canAccess('community', 'assigntask'), 'assigntask: not core, not community');
// Admin sees everything
ok(FEATURES.every((f) => f.roles.includes('admin')), 'admin can access every feature');
// Admin tools are admin only
for (const k of ['database', 'applications', 'adminevents', 'leadership', 'calls', 'health', 'analytics', 'programcal', 'docs']) {
  ok(FEATURES.find((f) => f.key === k).roles.join() === 'admin', `${k}: admin only`);
}
// Community members only get updates, events, opportunities
const comm = featuresFor('community').map((f) => f.key);
ok(['updates', 'events', 'join', 'talenthunt'].every((k) => comm.includes(k)), 'community: updates, events, join the core team, talent hunt');
ok(!comm.includes('tasks') && !comm.includes('clubpage') && !comm.includes('database'), 'community: no tasks, club page or database');
// Role-specific pages
ok(canAccess('hoc', 'contentideas') && !canAccess('hoo', 'contentideas'), 'content ideas: HoC not HoO');
ok(canAccess('hoo', 'eventideas') && !canAccess('hoc', 'eventideas'), 'event ideas: HoO not HoC');
ok(canAccess('fellow', 'onground') && canAccess('fellow', 'summit') && canAccess('fellow', 'awards'), 'fellow: on-ground, summit, awards');
// First-login briefing content
const titles = (r) => BRIEFINGS[r].map((b) => b.title.toLowerCase()).join(' | ');
ok(['playbook', 'drills', 'club page resources', 'on-ground event'].every((t) => titles('fellow').includes(t)), 'fellow briefing: playbook, drills, club page resources, list on-ground event');
ok(['hygiene', 'ideas bank', 'team launch post'].every((t) => titles('hoc').includes(t)) && BRIEFINGS.hoc.length === 4, 'hoc briefing: hygiene check, ideas bank, team launch post + 1 upcoming task');
ok(['event ideas', 'event checklists', 'event guidelines'].every((t) => titles('hoo').includes(t)), 'hoo briefing: event ideas, checklists, guidelines');
ok(['what', 'city meetup', 'first task'].every((t) => titles('core').includes(t)), 'core briefing: what’s new, city meetup, first task');
ok(['community updates', 'join the core team'].every((t) => titles('community').includes(t)) && BRIEFINGS.community.length === 3, 'community briefing: updates, events, join the core team');
// Every briefing link points to a route the role can actually open
for (const r of Object.keys(BRIEFINGS)) {
  for (const b of BRIEFINGS[r]) {
    const path = b.to.split('?')[0];
    const f = FEATURES.find((x) => x.path === path);
    ok(!!f && canAccess(r, f.key), `${r} briefing link ${b.to} is reachable`);
  }
}
// Login accounts: one per role, unique IDs
ok(new Set(USERS.map((u) => u.id)).size === USERS.length && Object.keys(ROLES).every((r) => USERS.some((u) => u.role === r)), 'one demo login per role, unique IDs');
// Every feature has a page component wired in App.jsx
const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
for (const f of FEATURES) ok(new RegExp(`\\b${f.key}:`).test(app), `route component wired for ${f.key}`);
// Palette: only colours from the PDFs (hex literals in the stylesheets)
const allowed = new Set(['#121a17', '#2e3532', '#ffffff', '#ffd12f', '#ff5a00', '#4d298e', '#085939', '#f1ecfa', '#ffede2', '#fff5cc', '#e6f2ec', '#8a8a8a', '#a0a8a6', '#fff', '#000']);
const css = ['tokens', 'base', 'components', 'shell', 'login', 'intro', 'pages'].map((n) => readFileSync(new URL(`../src/styles/${n}.css`, import.meta.url), 'utf8')).join('\n');
const strays = [...new Set((css.match(/#[0-9a-fA-F]{3,8}\b/g) || []).map((h) => h.toLowerCase()))].filter((h) => !allowed.has(h));
ok(strays.length === 0, `stylesheet hex colours all from the PDF palette${strays.length ? ` (stray: ${strays.join(', ')})` : ''}`);

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
