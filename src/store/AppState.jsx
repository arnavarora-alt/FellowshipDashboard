import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { USERS } from '../data/roles';
import { APPROVER_TEXT, canApprove } from '../lib/approvals';
import { TASKS, APPLICATIONS, EVENTS, SEED_SIGNUPS, SEED_REPORTS, SEED_AGREEMENTS, SEED_CRED, SPOTLIGHT_SEED, PARTNERS, PARTNER_LEADERS, PEOPLE } from '../data/mock';
import { instagramUrl } from '../data/links';
import { flushQueue, pushRow } from '../lib/sheet';

const KEY = 'u25.dashboard.v2';
const fresh = () => ({
  userId: null,
  introSeen: {},
  flags: {}, // generic toggles/values: rsvp:e1, check:hygiene:0, rec:r1 ...
  tasks: TASKS,
  applications: APPLICATIONS.map((a) => ({ ...a })),
  listedEvents: [], // submitted through the in-site event listing form
  reports: SEED_REPORTS, // executed-event reports, keyed by event id
  calls: [],
  submissions: [], // every form submit: {id,type,userId,data,at}
  accounts: [], // people who signed up and were approved
  signups: SEED_SIGNUPS.map((s) => ({ ...s })),
  outbox: [], // demo mailbox: emails the system would send
  credentials: SEED_CRED,
  agreements: SEED_AGREEMENTS,
  spotlight: SPOTLIGHT_SEED,
  photos: {}, // single profile photos keyed by structure node / person
  handles: {}, // public club page handle per college (from the Fellow's login form)
  eventAssign: [],
});

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch { /* storage may be blocked */ }
  return fresh();
};

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 8) || 'u25';
const PREFIX = { fellow: 'fellow', hoc: 'hoc', hoo: 'hoo', core: 'core', community: 'member' };
const pw = () => {
  const c = 'abcdefghjkmnpqrstuvwxyz23456789';
  const pick = () => c[Math.floor(Math.random() * c.length)];
  return `${pick().toUpperCase()}${Array.from({ length: 5 }, pick).join('')}@${Math.floor(10 + Math.random() * 89)}`;
};

export { APPROVER_TEXT, canApprove };

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [state, setState] = useState(load);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota or blocked: keep working in memory */ }
  }, [state]);

  const toast = useCallback((msg) => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  useEffect(() => {
    flushQueue();
    const t = setInterval(flushQueue, 60000);
    return () => clearInterval(t);
  }, []);

  const everyone = useMemo(() => [...USERS, ...state.accounts], [state.accounts]);
  const user = useMemo(() => everyone.find((u) => u.id === state.userId) || null, [everyone, state.userId]);

  const api = useMemo(() => {
    const who = () => ({ userId: user?.id, name: user?.name, role: user?.role, college: user?.college, email: user?.email });
    const stamp = () => new Date().toISOString();
    const mail = (s, to, subject, body) => ({ ...s, outbox: [{ id: `m${Date.now()}${Math.random().toString(36).slice(2, 5)}`, to, subject, body, at: new Date().toISOString() }, ...s.outbox] });
    const makeAccount = (s, req) => {
      const base = `${PREFIX[req.role]}-${slug(req.college)}`;
      const n = s.accounts.filter((a) => a.id.startsWith(base)).length + 1;
      const acct = { id: `${base}-${String(n).padStart(2, '0')}`, password: pw(), name: req.name, role: req.role, college: req.college, city: req.city || '', email: req.email, phone: req.phone, photo: req.photo, team: req.team || '', joined: new Date().toISOString() };
      return acct;
    };
    const credsMail = (acct) => ({
      subject: 'Welcome to the Under25 community: your ID and password',
      body: `Hi ${acct.name.split(' ')[0]},\n\nYour Under25 Community Dashboard account is ready.\n\nUser ID: ${acct.id}\nPassword: ${acct.password}\n\nLog in and you will start with a short role briefing. Please change nothing in this email before using it.\n\nSafe, Seen and Celebrated,\nTeam Under25`,
    });
    return {
      state,
      user,
      everyone,
      toasts,
      toast,
      login(id, password) {
        const u = everyone.find((x) => x.id.toLowerCase() === String(id).trim().toLowerCase());
        if (!u) return { ok: false, error: 'We could not find that user ID. Pick one from the list or sign up.' };
        if (u.password !== password) return { ok: false, error: 'That password does not match this ID.' };
        setState((s) => ({ ...s, userId: u.id }));
        return { ok: true, user: u };
      },
      logout: () => setState((s) => ({ ...s, userId: null })),
      introSeen: (id) => !!state.introSeen[id],
      markIntro: (id, v = true) => setState((s) => ({ ...s, introSeen: { ...s.introSeen, [id]: v } })),
      flag: (k) => !!state.flags[k],
      val: (k) => state.flags[k],
      setFlag: (k, v) => setState((s) => ({ ...s, flags: { ...s.flags, [k]: v } })),
      toggle: (k) => setState((s) => ({ ...s, flags: { ...s.flags, [k]: !s.flags[k] } })),
      count: (prefix) => Object.keys(state.flags).filter((k) => k.startsWith(prefix) && state.flags[k]).length,
      submit(type, data, msg) {
        const id = `s${Date.now()}`;
        const at = stamp();
        pushRow(type, { id, at, ...who(), ...data });
        setState((s) => ({ ...s, submissions: [{ id, type, userId: s.userId, data, at }, ...s.submissions] }));
        toast(msg || 'Sent. Thank you!');
      },

      /* ----- sign-up and approvals ----- */
      signup(req) {
        const email = req.email.trim().toLowerCase();
        if ([...state.accounts, ...state.signups.filter((x) => x.status === 'pending')].some((x) => x.email.toLowerCase() === email)) {
          return { ok: false, error: 'That email already has an account or a request waiting for approval.' };
        }
        const entry = { id: `su${Date.now()}`, ...req, email, status: 'pending', at: new Date().toISOString() };
        pushRow('signup-request', { id: entry.id, at: entry.at, name: req.name, college: req.college, email, phone: req.phone, role: req.role, team: req.team, status: req.role === 'community' ? 'auto-approved' : 'pending' });
        if (req.role === 'community') {
          let acct;
          setState((s) => {
            acct = makeAccount(s, req);
            const m = credsMail(acct);
            return mail({ ...s, accounts: [...s.accounts, acct], signups: [{ ...entry, status: 'approved', acctId: acct.id }, ...s.signups] }, email, m.subject, m.body);
          });
          return { ok: true, instant: true, email };
        }
        setState((s) => mail({ ...s, signups: [entry, ...s.signups] }, email, 'We got your request to join Under25', `Hi ${req.name.split(' ')[0]},\n\nThanks for signing up as ${req.role === 'hoc' ? 'Head of Content' : req.role === 'hoo' ? 'Head of Operations' : req.role === 'core' ? `a core team member (${req.team})` : 'a Fellow'}. ${APPROVER_TEXT[req.role]}\n\nOnce you are approved we will email your user ID and password.\n\nTeam Under25`));
        return { ok: true, instant: false, email };
      },
      approveSignup(id, by) {
        { const r = state.signups.find((x) => x.id === id); if (r) pushRow('signup-decision', { id, at: stamp(), decision: 'approved', by, name: r.name, email: r.email, role: r.role, college: r.college }); }
        setState((s) => {
          const req = s.signups.find((x) => x.id === id);
          if (!req || req.status !== 'pending') return s;
          const acct = makeAccount(s, req);
          const m = credsMail(acct);
          return mail({ ...s, accounts: [...s.accounts, acct], signups: s.signups.map((x) => (x.id === id ? { ...x, status: 'approved', by, acctId: acct.id } : x)) }, req.email, m.subject, m.body);
        });
        toast('Approved. ID and password emailed.');
      },
      rejectSignup(id, by) {
        { const r = state.signups.find((x) => x.id === id); if (r) pushRow('signup-decision', { id, at: stamp(), decision: 'declined', by, name: r.name, email: r.email, role: r.role, college: r.college }); }
        setState((s) => {
          const req = s.signups.find((x) => x.id === id);
          if (!req) return s;
          return mail({ ...s, signups: s.signups.map((x) => (x.id === id ? { ...x, status: 'rejected', by } : x)) }, req.email, 'About your Under25 request', `Hi ${req.name.split(' ')[0]},\n\nThanks for your interest. We cannot approve this request right now. You are welcome to join as a community member and apply again later.\n\nTeam Under25`);
        });
        toast('Request declined. The applicant was emailed.');
      },
      sendMail: (to, subject, body) => setState((s) => mail(s, to, subject, body)),

      /* ----- tasks, events, reports ----- */
      addTask: (t) => setState((s) => ({ ...s, tasks: [{ ...t, id: `t${Date.now()}`, status: 'todo' }, ...s.tasks] })),
      setTaskStatus: (id, status) => setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
      addListedEvent: (form, ownerId) => { const id = `le${Date.now()}`; pushRow('event-listing', { id, at: stamp(), status: 'Pending review', ...who(), ...form }); return setState((s) => ({
        ...s,
        listedEvents: [{
          id, title: form.title, type: 'On-ground', when: new Date(`${form.date}T${form.start || '15:00'}`).toISOString(), where: form.venue,
          city: form.city, college: form.college, cap: Number(form.cap) || 100, going: 0, leaders: false, text: form.text, status: 'Pending review', ownerId, form, at: new Date().toISOString(),
        }, ...s.listedEvents],
      })); },
      setEventStatus: (id, status) => { pushRow('event-decision', { id, at: stamp(), status, by: user?.name, title: state.listedEvents.find((e) => e.id === id)?.title }); return setState((s) => ({ ...s, listedEvents: s.listedEvents.map((e) => (e.id === id ? { ...e, status } : e)) })); },
      saveReport: (eventId, report) => setState((s) => ({ ...s, reports: { ...s.reports, [eventId]: report } })),
      setApplication: (id, patch) => { pushRow('application-decision', { id, at: stamp(), by: user?.name, ...patch, name: state.applications.find((a) => a.id === id)?.name }); return setState((s) => ({ ...s, applications: s.applications.map((a) => (a.id === id ? { ...a, ...patch } : a)) })); },
      addCall: (c) => setState((s) => ({ ...s, calls: [{ ...c, id: `c${Date.now()}` }, ...s.calls] })),
      removeCall: (id) => setState((s) => ({ ...s, calls: s.calls.filter((c) => c.id !== id) })),
      addEventAssign: (a) => setState((s) => ({ ...s, eventAssign: [{ ...a, id: `ea${Date.now()}` }, ...s.eventAssign] })),

      /* ----- credentials, agreements, photos, spotlight ----- */
      saveCredential: (c) => { pushRow('credentials', { at: stamp(), userId: c.userId, fellow: c.fellow, college: c.college, handle: c.handle, platform: c.platform, login: c.login, password: c.pw }); return setState((s) => ({ ...s, handles: { ...s.handles, [c.college]: c.handle }, credentials: [{ ...c, id: `k${Date.now()}`, at: new Date().toISOString() }, ...s.credentials.filter((x) => x.userId !== c.userId)] })); },
      submitAgreement: (a) => { pushRow('campus-agreement', { at: stamp(), college: a.college, submittedBy: a.by, driveLink: a.link, status: 'pending' }); return setState((s) => ({ ...s, agreements: [{ ...a, id: `ag${Date.now()}`, status: 'pending', at: new Date().toISOString() }, ...s.agreements.filter((x) => x.college !== a.college)] })); },
      setAgreementStatus: (id, status) => { pushRow('agreement-decision', { id, at: stamp(), status, by: user?.name, college: state.agreements.find((a) => a.id === id)?.college }); return setState((s) => ({ ...s, agreements: s.agreements.map((a) => (a.id === id ? { ...a, status } : a)) })); },
      instagramFor: (college) => instagramUrl(state.handles[college] || PARTNER_LEADERS[college]?.fellow?.handle),
      leadersOf(college) {
        const find = (role, label) => {
          const a = everyone.find((u) => u.role === role && u.college === college);
          if (a) return { name: a.name, email: a.email, photo: a.photo || state.photos[`node:${role}`] };
          const seeded = PARTNER_LEADERS[college]?.[role];
          if (seeded) return seeded;
          const p = PEOPLE.find((x) => x.college === college && x.role === label);
          return p ? { name: p.name, email: p.email } : null;
        };
        const fellow = find('fellow', 'Fellow');
        if (fellow && !fellow.handle) fellow.handle = state.handles[college] || PARTNER_LEADERS[college]?.fellow?.handle;
        return { fellow, hoc: find('hoc', 'Head of Content'), hoo: find('hoo', 'Head of Operations') };
      },
      isPartner: (college) => PARTNERS.includes(college) || state.agreements.some((a) => a.college === college && a.status === 'approved'),
      setPhoto: (key, data) => setState((s) => ({ ...s, photos: { ...s.photos, [key]: data } })),
      addSpotlight: (b) => setState((s) => ({ ...s, spotlight: [{ ...b, id: `sp${Date.now()}` }, ...s.spotlight] })),
      removeSpotlight: (id) => setState((s) => ({ ...s, spotlight: s.spotlight.filter((b) => b.id !== id) })),

      resetDemo: () => { setState(fresh()); toast('Demo data reset'); },
    };
  }, [state, user, everyone, toasts, toast]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

// Events visible to everyone: listed events only go live once approved.
export const allEvents = (state) => [
  ...state.listedEvents.filter((e) => e.status === 'Approved'),
  ...EVENTS,
];
export const isDigital = (e) => e.type === 'Session';
