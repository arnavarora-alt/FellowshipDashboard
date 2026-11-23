import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { Chips, Empty, Form, PageHead, SectionTitle, Tag, Avatar } from '../components/ui';
import { useApp } from '../store/AppState';
import { USERS } from '../data/roles';
import { fmtDate, relDay, daysFrom } from '../lib/utils';
import { inDays, EVENTS } from '../data/mock';

const nameOf = (id) => USERS.find((u) => u.id === id)?.name || id;
const STATUS = [['todo', 'To do'], ['doing', 'In progress'], ['done', 'Done']];

export function Tasks() {
  const { state, user, setTaskStatus } = useApp();
  const [sp] = useSearchParams();
  const focus = sp.get('focus');
  const [filter, setFilter] = useState('');
  const focusRef = useRef(null);
  useEffect(() => { focusRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [focus]);
  const mine = state.tasks.filter((t) => user.role === 'admin' || t.assignee === user.id);
  const list = mine.filter((t) => !filter || t.status === filter).sort((a, b) => new Date(a.due) - new Date(b.due));
  const sentByMe = state.tasks.filter((t) => t.by === user.name && t.assignee !== user.id);
  return (
    <>
      <PageHead title="Tasks" sub={user.role === 'admin' ? 'Every task across the program.' : 'Your upcoming tasks, in the order they are due.'} art="arrow-outline" />
      <div className="stack">
        <Chips all="All" options={STATUS.map((s) => s[1])} value={STATUS.find((s) => s[0] === filter)?.[1] || ''} onChange={(l) => setFilter(STATUS.find((s) => s[1] === l)?.[0] || '')} />
        {list.map((t) => {
          const d = daysFrom(t.due);
          return (
            <div key={t.id} ref={t.id === focus ? focusRef : null} className="card" style={t.id === focus ? { boxShadow: '6px 6px 0 var(--accent)' } : undefined}>
              <div className="row-between" style={{ alignItems: 'flex-start' }}>
                <div style={{ maxWidth: '62ch' }}>
                  <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                    <Tag tone={t.priority === 'High' ? 'orange' : ''}>{t.priority}</Tag>
                    {t.status !== 'done' && d <= 1 && <Tag tone="yellow">{relDay(t.due)}</Tag>}
                    {user.role === 'admin' && <Tag tone="soft">{nameOf(t.assignee)}</Tag>}
                  </div>
                  <h3 style={{ textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.55 : 1 }}>{t.title}</h3>
                  <p className="dim small" style={{ marginTop: 4 }}>{t.text}</p>
                  <p className="tiny dim" style={{ marginTop: 8 }}>Due {fmtDate(t.due)} · from {t.by}</p>
                </div>
                <div className="tabs" role="group" aria-label="Status">
                  {STATUS.map(([k, l]) => <button key={k} className="tab" aria-selected={t.status === k} onClick={() => setTaskStatus(t.id, k)}>{l}</button>)}
                </div>
              </div>
            </div>
          );
        })}
        {!list.length && <Empty title="Nothing to do here" text="New tasks show up as soon as someone assigns one." />}
        {sentByMe.length > 0 && (
          <>
            <SectionTitle>Tasks you assigned</SectionTitle>
            <div className="card">{sentByMe.map((t) => <div className="list-row" key={t.id}><Avatar name={nameOf(t.assignee)} size="sm" /><div className="grow"><b>{t.title}</b><p className="dim small">{nameOf(t.assignee)} · due {fmtDate(t.due)}</p></div><Tag>{STATUS.find((s) => s[0] === t.status)[1]}</Tag></div>)}</div>
          </>
        )}
      </div>
    </>
  );
}

export function AssignTask() {
  const { user, addTask, toast, state } = useApp();
  // who can receive a task: everyone below you, admin can pick anyone
  const targets = useMemo(() => {
    const allow = { fellow: ['hoc', 'hoo', 'core'], hoc: ['core', 'hoc'], hoo: ['core', 'hoo'], admin: ['fellow', 'hoc', 'hoo', 'core', 'community'] }[user.role] || [];
    return USERS.filter((u) => allow.includes(u.role) && u.id !== user.id);
  }, [user]);
  const recent = state.tasks.filter((t) => t.by === user.name || (user.role === 'admin' && t.by === 'Under25 Team')).slice(0, 5);
  return (
    <>
      <PageHead title="Assign task" sub="Hand a clear task to the right person, with a date. They see it on their dashboard straight away." art="ok-yellow" />
      <div className="split">
        <div className="card">
          <Form
            submitLabel="Assign task"
            fields={[
              { name: 'who', label: 'Assign to', type: 'select', required: true, options: targets.map((t) => `${t.name} (${t.id})`) },
              { name: 'title', label: 'Task', required: true, placeholder: 'Shoot 5 photos at Club Orientation' },
              { name: 'text', label: 'Details', type: 'textarea', placeholder: 'What does done look like?' },
              { name: 'due', label: 'Due date', type: 'date', required: true, default: new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10) },
              { name: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'], default: 'Medium', required: true },
            ]}
            onSubmit={(v, reset) => {
              const id = v.who.match(/\(([^)]+)\)$/)[1];
              addTask({ title: v.title, text: v.text || 'No extra details.', assignee: id, due: new Date(v.due).toISOString(), by: user.name, priority: v.priority });
              toast(`Task assigned to ${nameOf(id)}`);
              reset();
            }}
          />
        </div>
        <div className="card">
          <h3>Recently assigned</h3>
          {recent.length ? recent.map((t) => <div className="list-row" key={t.id}><Avatar name={nameOf(t.assignee)} size="sm" /><div className="grow"><b>{t.title}</b><p className="dim small">{nameOf(t.assignee)} · due {fmtDate(t.due)}</p></div></div>) : <p className="dim">Nothing yet.</p>}
        </div>
      </div>
    </>
  );
}

export function Deadlines() {
  const { state, user } = useApp();
  const items = [
    ...state.tasks.filter((t) => (user.role === 'admin' || t.assignee === user.id) && t.status !== 'done').map((t) => ({ k: t.id, t: t.title, d: t.due, kind: 'Task' })),
    ...EVENTS.filter((e) => ['e4', 'e5'].includes(e.id)).map((e) => ({ k: e.id, t: e.title, d: e.when, kind: 'Event' })),
    { k: 'dl1', t: 'Campus Awards launch, categories go live', d: inDays(24), kind: 'Program' },
    { k: 'dl2', t: 'Talent hunt round 1 auditions', d: inDays(10), kind: 'Program' },
    { k: 'dl3', t: 'Mid-year review call booked', d: inDays(14), kind: 'Program' },
  ].sort((a, b) => new Date(a.d) - new Date(b.d));
  return (
    <>
      <PageHead title="Deadlines" sub="Everything that is due, in order." art="arrow-green" />
      <div className="card">
        {items.map((i) => (
          <div className="list-row" key={i.k}>
            <div className="event-date"><b>{new Date(i.d).getDate()}</b><span>{new Date(i.d).toLocaleDateString('en-IN', { month: 'short' })}</span></div>
            <div className="grow"><b>{i.t}</b><p className="dim small">{relDay(i.d)}</p></div>
            <Tag tone={i.kind === 'Task' ? 'yellow' : i.kind === 'Event' ? 'orange' : ''}>{i.kind}</Tag>
          </div>
        ))}
      </div>
    </>
  );
}
