// Static verification of the role-access matrix, first-login briefings, approvals and palette against the product brief.
// Run with: npm test
import { FEATURES, canAccess, featuresFor, groupFor } from '../src/data/features.js';
import { BRIEFINGS, USERS, ROLES } from '../src/data/roles.js';
import { canApprove } from '../src/lib/approvals.js';
import { readFileSync } from 'node:fs';

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error(`FAIL  ${msg}`); } else console.log(`ok    ${msg}`); };
const keys = FEATURES.map((f) => f.key);
const LEAD = ['fellow', 'hoc', 'hoo', 'core'];

// Shared by Fellow, Head of Operations, Head of Content and core team
for (const k of ['journey', 'help', 'team', 'branded', 'challenges']) {
  ok(LEAD.every((r) => canAccess(r, k)) && canAccess('admin', k) && !canAccess('community', k), `${k}: all leads + admin, not community`);
}
// Assign task: Fellow, HoC, HoO (and admin)
ok(['fellow', 'hoc', 'hoo', 'admin'].every((r) => canAccess(r, 'assigntask')) && !canAccess('core', 'assigntask') && !canAccess('community', 'assigntask'), 'assigntask: fellow, hoc, hoo, admin only');
ok(FEATURES.every((f) => f.roles.includes('admin')), 'admin can access every feature');
for (const k of ['database', 'applications', 'adminevents', 'submissions', 'credentials', 'drivelinks', 'care', 'agreements', 'spotlightadmin', 'leadership', 'calls', 'health', 'analytics', 'programcal', 'docs']) {
  ok(FEATURES.find((f) => f.key === k).roles.join() === 'admin', `${k}: admin only`);
}
// Tabs that were removed
for (const k of ['citymeetups', 'deadlines', 'checklists', 'eventguide', 'sessions', 'agreement', 'uploadphotos']) ok(!keys.includes(k), `${k}: removed`);
// Fellow-only content
for (const k of ['playbook', 'drills', 'awards']) ok(['fellow', 'admin'].every((r) => canAccess(r, k)) && !['hoc', 'hoo', 'core', 'community'].some((r) => canAccess(r, k)), `${k}: Fellow only (plus admin)`);
ok(canAccess('fellow', 'credform') && !['hoc', 'hoo', 'core', 'community'].some((r) => canAccess(r, 'credform')), 'club page login form: Fellow only');
ok(FEATURES.find((f) => f.key === 'credform').hidden, 'club page login form is reached from the task, not the sidebar');
ok(canAccess('hoc', 'hygiene') && !canAccess('fellow', 'hygiene'), 'club page hygiene check: HoC, not Fellow');
ok(canAccess('fellow', 'campusagreement') && !canAccess('hoc', 'campusagreement') && FEATURES.find((f) => f.key === 'partnernext').needs === 'partner' && canAccess('fellow', 'partnernext') && !canAccess('core', 'partnernext'), 'Campus Agreement and Campus Partner next steps: Fellow only, next steps need partner');
ok(!canAccess('fellow', 'talenthunt') && !canAccess('fellow', 'certificates') && !canAccess('fellow', 'join') && !canAccess('fellow', 'involve'), 'fellow: no Get involved pages');
ok(canAccess('fellow', 'suggestions') && groupFor(FEATURES.find((f) => f.key === 'suggestions'), 'fellow') !== 'involve', 'fellow keeps Suggestions, outside Get involved');
ok(groupFor(FEATURES.find((f) => f.key === 'suggestions'), 'community') === 'involve', 'community keeps Suggestions under Get involved');
ok(featuresFor('fellow').filter((f) => f.group === 'campus' && !f.hidden)[0].key === 'collegestatus', 'College status is first in My campus');
ok(['fellow', 'hoo'].every((r) => canAccess(r, 'insight')) && !canAccess('hoc', 'insight') && !canAccess('core', 'insight'), 'insight form: Fellow and HoO');
ok(['fellow', 'core'].every((r) => canAccess(r, 'nominate')) && !canAccess('community', 'nominate'), 'nominate successor: Fellow and core');
ok(canAccess('fellow', 'alumni') && !canAccess('hoc', 'alumni'), 'alumni connect: Fellow');
ok(['fellow', 'hoc', 'hoo', 'admin'].every((r) => canAccess(r, 'approvals')) && !canAccess('core', 'approvals') && !canAccess('community', 'approvals'), 'sign-up approvals: Fellow, HoC, HoO, admin');
ok(canAccess('fellow', 'weeklyhang') && canAccess('hoc', 'draftroom'), 'Weekly Hang Session is its own page; Draft Room stays');
// Community members only get updates, events, opportunities
const comm = featuresFor('community').map((f) => f.key);
ok(['updates', 'events', 'join', 'talenthunt'].every((k) => comm.includes(k)), 'community: updates, events, join the core team, talent hunt');
ok(!comm.includes('tasks') && !comm.includes('clubpage') && !comm.includes('database'), 'community: no tasks, club page or database');
ok(canAccess('hoc', 'contentideas') && !canAccess('hoo', 'contentideas') && canAccess('hoo', 'eventideas') && !canAccess('hoc', 'eventideas'), 'content ideas HoC only, event ideas HoO only');

// Sign-up approvals
const su = (role, team = '', college = 'BNMIT') => ({ role, team, college, status: 'pending' });
const u = (role, college = 'BNMIT') => ({ role, college });
ok(canApprove(u('admin'), su('fellow')) && !canApprove(u('fellow'), su('fellow')), 'Fellow sign-ups are approved by admin only');
ok(canApprove(u('fellow'), su('hoc')) && canApprove(u('fellow'), su('hoo')) && canApprove(u('fellow'), su('core', 'Content')), 'Fellow approves HoC, HoO and core');
ok(canApprove(u('hoc'), su('core', 'Content')) && !canApprove(u('hoc'), su('core', 'Operations')) && !canApprove(u('hoc'), su('hoc')), 'HoC approves Content core members only');
ok(canApprove(u('hoo'), su('core', 'Operations')) && !canApprove(u('hoo'), su('core', 'Content')), 'HoO approves Operations core members only');
ok(!canApprove(u('fellow', 'DSCE'), su('hoc')), 'approvers only act on their own college');
ok(!canApprove(u('core'), su('core', 'Content')) && !canApprove(u('community'), su('community')), 'core and community cannot approve');

// First-login briefing content
const titles = (r) => BRIEFINGS[r].map((b) => b.title.toLowerCase()).join(' | ');
ok(['playbook', 'drills', 'club page resources', 'on-ground event'].every((t) => titles('fellow').includes(t)), 'fellow briefing: playbook, drills, club page resources, list on-ground event');
ok(['hygiene', 'ideas bank', 'team launch post'].every((t) => titles('hoc').includes(t)) && BRIEFINGS.hoc.length === 4, 'hoc briefing: hygiene check, ideas bank, team launch post + 1 upcoming task');
ok(['event ideas', 'event calendar', 'list your event'].every((t) => titles('hoo').includes(t)), 'hoo briefing: event ideas, event calendar, list your event');
ok(['what', 'city meetup', 'first task'].every((t) => titles('core').includes(t)), 'core briefing: what’s new, city meetup, first task');
ok(['community updates', 'join the core team'].every((t) => titles('community').includes(t)) && BRIEFINGS.community.length === 3, 'community briefing: updates, events, join the core team');
for (const r of Object.keys(BRIEFINGS)) {
  for (const b of BRIEFINGS[r]) {
    const path = b.to.split('?')[0];
    const f = FEATURES.find((x) => x.path === path);
    ok(!!f && canAccess(r, f.key), `${r} briefing link ${b.to} is reachable`);
  }
}
ok(ROLES.fellow.abilities.length === 5 && ROLES.fellow.abilities.every((a) => a[2]), 'fellow role highlights: the five things a Fellow runs, each with a line of explanation');
ok(new Set(USERS.map((u2) => u2.id)).size === USERS.length && Object.keys(ROLES).every((r) => USERS.some((x) => x.role === r)), 'one demo login per role, unique IDs');

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
