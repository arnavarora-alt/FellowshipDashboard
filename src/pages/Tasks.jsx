import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { Chips, Empty, Form, PageHead, SectionTitle, Tabs, Tag, Avatar } from '../components/ui';
import { useApp, allEvents } from '../store/AppState';
import { USERS } from '../data/roles';
import { fmtDate, relDay, daysFrom } from '../lib/utils';
import { inDays } from '../data/mock';
import { userTasks } from '../lib/tasks';

const STATUS = [['todo', 'To do'], ['doing', 'In progress'], ['done', 'Done']];

function Deadlines({ tasks }) {
  const { state, user } = useApp();
  const events = allEvents(state).filter((e) => e.type === 'On-ground' && e.college === user.college && new Date(e.when) > new Date()).slice(0, 3);
  const items = [
    ...tasks.filter((t) => t.status !== 'done').map((t) => ({ k: t.id, t: t.title, d: t.locked ? t.unlock : t.due, kind: t.mandatory ? 'Mandatory' : 'Task', note: t.locked ? 'Opens on this date' : '' })),
    ...events.map((e) => ({ k: e.id, t: e.title, d: e.when, kind: 'Event' })),
    { k: 'dl1', t: 'Campus Awards launch, categories go live', d: inDays(24), kind: 'Program' },
    { k: 'dl2', t: 'Talent hunt round 1 auditions', d: inDays(10), kind: 'Program' },
    { k: 'dl3', t: 'Mid-year review call booked', d: inDays(14), kind: 'Program' },
  ].sort((a, b) => new Date(a.d) - new Date(b.d));
  return (
    <div className="card">
      {items.map((i) => (
        <div className="list-row" key={i.k}>
          <div className="event-date"><b>{new Date(i.d).getDate()}</b><span>{new Date(i.d).toLocaleDateString('en-IN', { month: 'short' })}</span></div>
          <div className="grow"><b>{i.t}</b><p className="dim small">{i.note || relDay(i.d)}</p></div>
          <Tag tone={i.kind === 'Mandatory' ? 'orange' : i.kind === 'Task' ? 'yellow' : i.kind === 'Event' ? 'purple' : ''}>{i.kind}</Tag>
        </div>
      ))}
    </div>
  );
}

export function Tasks() {
  const { state, user, setTaskStatus } = useApp();
  const [sp] = useSearchParams();
  const focus = sp.get('focus');
  const [tab, setTab] = useState('tasks');
  const [filter, setFilter] = useState('');
  const focusRef = useRef(null);
  useEffect(() => { focusRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [focus]);
  const mine = userTasks(state, user);
  const list = mine.filter((t) => !filter || t.status === filter).sort((a, b) => Number(!!a.locked) - Number(!!b.locked) || new Date(a.due) - new Date(b.due));
  const sentByMe = state.tasks.filter((t) => t.by === user.name && t.assignee !== user.id);
  const nameOf = (id) => USERS.find((u) => u.id === id)?.name || state.accounts.find((a) => a.id === id)?.name || id;
  return (
    <>
      <PageHead title="Tasks and deadlines" sub={user.role === 'admin' ? 'Every task across the program.' : 'Your tasks and everything that is due, in the order it is due.'} art="arrow-outline" />
      <div className="stack">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'tasks', label: 'My tasks' }, { id: 'deadlines', label: 'Deadlines' }]} />
        {tab === 'deadlines' && <Deadlines tasks={mine} />}
        {tab === 'tasks' && (
          <>
            <Chips all="All" options={STATUS.map((s) => s[1])} value={STATUS.find((s) => s[0] === filter)?.[1] || ''} onChange={(l) => setFilter(STATUS.find((s) => s[1] === l)?.[0] || '')} />
            {list.map((t) => {
              const d = daysFrom(t.due);
              return (
                <div key={t.id} ref={t.id === focus ? focusRef : null} className="card" style={{ ...(t.id === focus ? { boxShadow: '6px 6px 0 var(--accent)' } : null), ...(t.locked ? { opacity: 0.75 } : null) }}>
                  <div className="row-between" style={{ alignItems: 'flex-start' }}>
                    <div style={{ maxWidth: '62ch' }}>
                      <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                        {t.mandatory && <Tag tone="orange">Mandatory</Tag>}
                        <Tag tone={t.priority === 'High' && !t.mandatory ? 'orange' : ''}>{t.priority}</Tag>
                        {t.locked && <Tag tone="soft"><Icon name="Lock" size={12} /> Opens {fmtDate(t.unlock)}</Tag>}
                        {!t.locked && t.status !== 'done' && d <= 1 && <Tag tone="yellow">{relDay(t.due)}</Tag>}
                        {user.role === 'admin' && <Tag tone="soft">{nameOf(t.assignee)}</Tag>}
                      </div>
                      <h3 style={{ textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.55 : 1 }}>{t.title}</h3>
                      <p className="dim small" style={{ marginTop: 4 }}>{t.text}</p>
                      <p className="tiny dim" style={{ marginTop: 8 }}>Due {fmtDate(t.due)} · from {t.by}</p>
                      {t.to && t.status !== 'done' && (t.locked ? <span className="btn btn-sm btn-ghost" style={{ marginTop: 10, opacity: 0.6, pointerEvents: 'none' }}>Opens on the 25th</span> : <Link className="btn btn-sm" style={{ marginTop: 10 }} to={t.to}>Open form</Link>)}
                    </div>
                    {!t.auto && !t.monthKey && (
                      <div className="tabs" role="group" aria-label="Status">
                        {STATUS.map(([k, l]) => <button key={k} className="tab" aria-selected={t.status === k} onClick={() => setTaskStatus(t.id, k)}>{l}</button>)}
                      </div>
                    )}
                    {(t.auto || t.monthKey) && <Tag tone={t.status === 'done' ? 'green' : ''}>{t.status === 'done' ? 'Done' : 'Complete it to finish'}</Tag>}
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
          </>
        )}
      </div>
    </>
  );
}

export function AssignTask() {
  const { user, addTask, toast, state, everyone } = useApp();
  // who can receive a task: everyone below you, admin can pick anyone
  const targets = useMemo(() => {
    const allow = { fellow: ['hoc', 'hoo', 'core'], hoc: ['core', 'hoc'], hoo: ['core', 'hoo'], admin: ['fellow', 'hoc', 'hoo', 'core', 'community'] }[user.role] || [];
    return everyone.filter((u) => allow.includes(u.role) && u.id !== user.id && (user.role === 'admin' || u.college === user.college));
  }, [user, everyone]);
  const nameOf = (id) => everyone.find((u) => u.id === id)?.name || id;
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
