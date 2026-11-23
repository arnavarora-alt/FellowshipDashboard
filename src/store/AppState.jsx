import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { USERS } from '../data/roles';
import { TASKS, APPLICATIONS, EVENTS } from '../data/mock';

const KEY = 'u25.dashboard.v1';
const fresh = () => ({
  userId: null,
  introSeen: {},
  flags: {}, // generic toggles: rsvp:e1, check:hygiene:0, saved:ci3 ...
  tasks: TASKS,
  applications: APPLICATIONS.map((a) => ({ ...a })),
  listedEvents: [], // events listed through the form
  calls: [],
  submissions: [], // every form submit: {id,type,userId,data,at}
  assigned: [], // tasks assigned from Assign task
  eventAssign: [], // admin: events assigned to colleges
});

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch { /* storage may be blocked */ }
  return fresh();
};

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [state, setState] = useState(load);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const toast = useCallback((msg) => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const user = useMemo(() => USERS.find((u) => u.id === state.userId) || null, [state.userId]);

  const api = useMemo(() => ({
    state,
    user,
    toasts,
    toast,
    login(id, password) {
      const u = USERS.find((x) => x.id.toLowerCase() === String(id).trim().toLowerCase());
      if (!u) return { ok: false, error: 'We could not find that user ID. Pick one from the list.' };
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
      setState((s) => ({ ...s, submissions: [{ id: `s${Date.now()}`, type, userId: s.userId, data, at: new Date().toISOString() }, ...s.submissions] }));
      toast(msg || 'Sent. Thank you!');
    },
    addTask: (t) => setState((s) => ({ ...s, tasks: [{ ...t, id: `t${Date.now()}`, status: 'todo' }, ...s.tasks] })),
    setTaskStatus: (id, status) => setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
    addEvent: (e) => setState((s) => ({ ...s, listedEvents: [{ ...e, id: `le${Date.now()}`, status: 'Pending review' }, ...s.listedEvents] })),
    setEventStatus: (id, status) => setState((s) => ({ ...s, listedEvents: s.listedEvents.map((e) => (e.id === id ? { ...e, status } : e)) })),
    setApplication: (id, patch) => setState((s) => ({ ...s, applications: s.applications.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
    addCall: (c) => setState((s) => ({ ...s, calls: [{ ...c, id: `c${Date.now()}` }, ...s.calls] })),
    removeCall: (id) => setState((s) => ({ ...s, calls: s.calls.filter((c) => c.id !== id) })),
    addEventAssign: (a) => setState((s) => ({ ...s, eventAssign: [{ ...a, id: `ea${Date.now()}` }, ...s.eventAssign] })),
    resetDemo: () => { setState(fresh()); toast('Demo data reset'); },
  }), [state, user, toasts, toast]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const allEvents = (state) => [
  ...state.listedEvents.map((e) => ({ ...e, type: 'On-ground', cap: e.cap || 100, going: 0, leaders: false })),
  ...EVENTS,
];
