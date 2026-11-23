import { useState } from 'react';
import Icon from '../components/Icon';
import { Avatar, CheckItem, Chips, DataTable, ExtLink, Form, Modal, PageHead, Progress, SectionTitle, Stat, Sticker, Tabs, Tag, Tilt } from '../components/ui';
import { EventCard } from './Events';
import { useApp } from '../store/AppState';
import { AWARDS, AWARD_STEPS, CARE_TEAM, DRILLS, GOLDEN_RULES, NOTION_HUB, SESSIONS, STRUCTURE, INCENTIVES } from '../data/content';
import { EVENTS } from '../data/mock';

export function Playbook() {
  const [open, setOpen] = useState('who');
  const S = [
    ['who', 'Who you are', 'Fellow: the OG of your campus. The one who knows everyone, gets things done and brings people together. You become a community builder, a leader and the go-to person for Under25.'],
    ['run', 'What you run', 'Club page (tell your campus story), Sporting Leagues (you are the CEO), On-ground events (your creative playground), Summit at Campus (direct a real festival once a year) and the Campus Awards (the year comes full circle).'],
    ['get', 'What is in it for you', 'Learn from experts, mentors and peers. Grow with room to build your own ideas and a seat in closed-door brand conversations. Brag with certificates, recommendation letters, a shot at the Campus Awards and Under25 merch.'],
    ['team', 'Who does what', `You build a team of rockstars. ${STRUCTURE.heads.map((h) => `${h.name}: ${h.leads.join(', ')}`).join('. ')}.`],
    ['plaque', 'Wait, there is more', 'The Under25 Club Plaque: Silver at 3,000 followers, Gold at 10,000 and Purple at 20,000. Plus Fellow of the Week, where you get featured by Under25.'],
  ];
  return (
    <>
      <PageHead title="Playbook" sub="The Fellowship handbook, in short. The full version has the pages, the stories and the letters from your seniors." art="trophy-yellow" />
      <div className="stack">
        <div className="callout"><Icon name="BookOpen" /><div><b>Welcome. We’re genuinely glad you’re here.</b><p className="small">Over the next year you will meet hundreds of people, create experiences, discover talent, build communities, make mistakes and leave your campus a little better than you found it.</p></div></div>
        <div className="stack-sm">
          {S.map(([k, t, d]) => (
            <button key={k} className="card card-click" onClick={() => setOpen(open === k ? '' : k)} aria-expanded={open === k}>
              <div className="row-between"><h3 style={{ fontSize: 24 }}>{t}</h3><Icon name="ChevronDown" style={{ transform: open === k ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }} /></div>
              {open === k && <p className="dim" style={{ marginTop: 8, maxWidth: '70ch' }}>{d}</p>}
            </button>
          ))}
        </div>
        <div className="row">
          <ExtLink className="btn" href="https://grave-legume-23c.notion.site/Under25-Campus-Fellowship-Playbook-392337192f0a803c9f01fbcb63550226">Open the full Playbook <Icon name="ExternalLink" size={16} /></ExtLink>
        </div>
        <SectionTitle>The 7 golden rules</SectionTitle>
        <div className="grid g3">{GOLDEN_RULES.slice(0, 3).map(([t, d], i) => <div className="card" key={t}><span className="display" style={{ fontSize: 44, color: 'var(--accent-text)' }}>{i + 1}</span><h3>{t}</h3><p className="dim small">{d}</p></div>)}</div>
      </div>
    </>
  );
}

export function Drills() {
  const { user, flag, toggle } = useApp();
  const [cat, setCat] = useState('');
  const mine = DRILLS.filter((d) => user.role === 'admin' || d.roles.includes(user.role));
  const list = mine.filter((d) => !cat || d.cat === cat);
  const done = mine.filter((d) => flag(`drill:${d.id}`)).length;
  return (
    <>
      <PageHead title="Drills" sub="Structured resource packages. Learn leadership drill by drill. They open in the Fellowship Notion hub." art="ok-yellow" />
      <div className="stack">
        <div className="card"><div className="row-between"><div><h3>{done} of {mine.length} drills done</h3><p className="dim small">Mark one done after you have actually tried it.</p></div><ExtLink className="btn btn-sm btn-ghost" href={NOTION_HUB}>Open the Notion hub</ExtLink></div><div style={{ marginTop: 12 }}><Progress value={done} max={mine.length} /></div></div>
        <Chips options={[...new Set(mine.map((d) => d.cat))]} value={cat} onChange={setCat} />
        <div className="grid g2">
          {list.map((d) => (
            <Tilt key={d.id} max={4}>
              <div className="lift stack-sm">
                <div className="row-between"><Tag tone="soft">{d.cat}</Tag>{flag(`drill:${d.id}`) && <Tag tone="green">Done</Tag>}</div>
                <h3 style={{ fontSize: 22 }}>{d.title}</h3><p className="dim small">{d.text}</p>
                <div className="row" style={{ marginTop: 6 }}><ExtLink className="btn btn-sm" href={d.url}>Open drill</ExtLink><button className="btn btn-sm btn-ghost" onClick={() => toggle(`drill:${d.id}`)} aria-pressed={flag(`drill:${d.id}`)}>{flag(`drill:${d.id}`) ? 'Undo' : 'Mark done'}</button></div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </>
  );
}

export function Sessions() {
  const nexts = { 'Weekly Hang Session': 'e1', 'The Draft Room': 'e2', Townhall: 'e7', 'Academy Session': 'e9' };
  const { user } = useApp();
  return (
    <>
      <PageHead title="Sessions" sub="Four recurring sessions make the learning rhythm of the year." art="shapes-yellow" />
      <div className="grid g2">
        {SESSIONS.filter((s) => s.name !== 'The Draft Room' || user.role !== 'core').map((s) => (
          <div className="stack" key={s.name}>
            <div className="card"><div className="row-between"><h3 style={{ fontSize: 24 }}>{s.name}</h3><Tag tone="yellow">{s.every}</Tag></div><p className="dim small" style={{ marginTop: 6 }}>{s.text}</p></div>
            <EventCard e={EVENTS.find((e) => e.id === nexts[s.name])} />
          </div>
        ))}
      </div>
    </>
  );
}

export function Awards() {
  const { user, submit } = useApp();
  const [open, setOpen] = useState(2);
  const [nom, setNom] = useState(false);
  return (
    <>
      <PageHead title="Campus Awards" sub="Where the whole year comes full circle. 6 categories, 25 awards. They only work if you keep proof all year." art="trophy-orange" right={user.role === 'fellow' || user.role === 'admin' ? <button className="btn" onClick={() => setNom(true)}>Nominate</button> : undefined} />
      <div className="stack">
        <div className="grid g3">{AWARD_STEPS.map((s) => <div className="card" key={s.m}><Tag tone="yellow">{s.m}</Tag><h3 style={{ margin: '10px 0 4px' }}>{s.t}</h3><p className="dim small">{s.d}</p></div>)}</div>
        <div className="split">
          <div className="stack-sm">
            {AWARDS.map((a, i) => (
              <button key={a.cat} className="card card-click" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <div className="row-between"><h3 style={{ fontSize: 22 }}>{a.cat} <span className="dim small">({a.items.length})</span></h3><Icon name="ChevronDown" style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }} /></div>
                {open === i && <div className="chips" style={{ marginTop: 12 }}>{a.items.map((x) => <Tag key={x} tone="soft">{x}</Tag>)}</div>}
              </button>
            ))}
          </div>
          <div className="card"><h3>Your proof tracker</h3><p className="dim small" style={{ margin: '4px 0 12px' }}>Awards, brand payouts and CV points all need records. Collect as you go, not in March.</p>
            <div className="stack-sm">{['Event reports filed', 'Screenshots of page insights', 'Signed MOU on file', 'Full-session tenure in role', 'Attendance and photos saved'].map((p, i) => <CheckItem key={p} id={`proof:${i}`} title={p} />)}</div></div>
        </div>
      </div>
      <Modal open={nom} onClose={() => setNom(false)} title="Nominate for an award">
        <Form submitLabel="Submit nomination" fields={[{ name: 'award', label: 'Award', type: 'select', options: AWARDS.flatMap((a) => a.items), required: true }, { name: 'who', label: 'Nominee (person, team or club)', required: true }, { name: 'proof', label: 'Proof (link or short note)', type: 'textarea', required: true }]} onSubmit={(v) => { submit('award-nomination', v, 'Nomination submitted.'); setNom(false); }} />
      </Modal>
    </>
  );
}

export function Summit() {
  const followers = 1180;
  const members = 74;
  const ok = followers >= 1000 && members >= 100;
  const { toast } = useApp();
  return (
    <>
      <PageHead title="Summit at Campus" sub="Once a year, everything comes together. You get to direct a real festival, not a college fest committee." art="trophy-purple" />
      <div className="stack">
        <div className="grid g2">
          {[['Followers on the club page', followers, 1000], ['Community members on campus', members, 100]].map(([l, v, t]) => (
            <div className="card" key={l}><div className="row-between"><h3>{l}</h3>{v >= t ? <Tag tone="green"><Icon name="Check" size={13} /> Met</Tag> : <Tag tone="orange">{t - v} to go</Tag>}</div><div className="big-num" style={{ margin: '12px 0' }}>{v.toLocaleString('en-IN')}<span className="dim" style={{ fontSize: 28 }}> / {t.toLocaleString('en-IN')}</span></div><Progress value={v} max={t} /></div>
          ))}
        </div>
        <div className={`callout ${ok ? '' : 'warn'}`}><Icon name={ok ? 'PartyPopper' : 'Info'} /><div><b>{ok ? 'You are eligible. Time to direct a festival.' : 'Not yet, and that is on purpose.'}</b><p className="small">A summit needs an audience that already knows the club. The bar protects you from running a summit too early.</p></div></div>
        <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={!ok} onClick={() => toast('Request sent to Under25')}>Request Summit slot</button>
        <SectionTitle>How to get there</SectionTitle>
        <div className="grid g3">{[['Run a posting rhythm', 'Three solid posts a week beat seven rushed ones.'], ['Fill the room', 'Every on-ground event is a chance to add 10 members.'], ['Use city meetups', 'Meet members from other colleges and bring them back.']].map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p className="dim small">{d}</p></div>)}</div>
      </div>
    </>
  );
}

export function CollegeStatus() {
  const { user } = useApp();
  return (
    <>
      <PageHead title="College status" sub={`Where ${user.college} stands right now, and what to do next.`} art="shapes-green" />
      <div className="stack">
        <div className="card"><div className="grid g4"><Stat label="Club page" value="Active" count={false} /><Stat label="Followers" value={1180} /><Stat label="Community members" value={74} /><Stat label="Core team" value={64} /></div></div>
        <div className="grid g2">
          <div className="card"><h3>Health check</h3>{[['Posting rhythm', 'On track', 'green'], ['Management buy-in', 'MOU signed', 'green'], ['Team size', '64 of 100', 'orange'], ['Summit eligibility', 'Members short', 'orange']].map(([a, b, t]) => <div className="list-row" key={a}><b className="grow">{a}</b><Tag tone={t}>{b}</Tag></div>)}</div>
          <div className="card"><h3>Next best steps</h3>{['Recruit the open Tech Head and Partnerships Lead', 'Run one more on-ground event before December', 'Post the team launch carousel', 'Start collecting Campus Awards proof'].map((s) => <div className="list-row" key={s}><Icon name="ArrowRight" style={{ color: 'var(--accent-text)' }} /><span>{s}</span></div>)}</div>
        </div>
      </div>
    </>
  );
}

const CANDS = [
  { id: 'r1', name: 'Tanvi Kulkarni', role: 'Events Captain', stage: 'Interview' },
  { id: 'r2', name: 'Aman Verma', role: 'Tech Head', stage: 'Applied' },
  { id: 'r3', name: 'Lakshmi Pillai', role: 'Partnerships Lead', stage: 'Interview' },
  { id: 'r4', name: 'Manav Bose', role: 'Tech Head', stage: 'Applied' },
  { id: 'r5', name: 'Pooja Naidu', role: 'Design Lead', stage: 'Offer' },
  { id: 'r6', name: 'Sahil Desai', role: 'Media Chief', stage: 'Joined' },
];
const STAGES = ['Applied', 'Interview', 'Offer', 'Joined'];
export function Recruitment() {
  const { val, setFlag, submit } = useApp();
  const [pub, setPub] = useState(false);
  const stage = (c) => val(`rec:${c.id}`) || c.stage;
  return (
    <>
      <PageHead title="Club recruitment" sub="Publish roles with clear job descriptions, interview every lead and finalise the team by the deadline." art="ok-purple" right={<button className="btn" onClick={() => setPub(true)}>Publish a role</button>} />
      <div className="grid g4">
        {STAGES.map((s) => (
          <div className="card" key={s} style={{ background: 'var(--surface)' }}>
            <div className="row-between" style={{ marginBottom: 12 }}><h3>{s}</h3><Tag>{CANDS.filter((c) => stage(c) === s).length}</Tag></div>
            <div className="stack-sm">
              {CANDS.filter((c) => stage(c) === s).map((c) => (
                <div className="card" key={c.id} style={{ padding: 12, background: 'var(--surface-2)' }}>
                  <div className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={c.name} size="sm" /><div><b style={{ fontSize: 14 }}>{c.name}</b><p className="tiny dim">{c.role}</p></div></div>
                  {s !== 'Joined' && <button className="btn btn-sm btn-soft" style={{ marginTop: 10 }} onClick={() => setFlag(`rec:${c.id}`, STAGES[STAGES.indexOf(s) + 1])}>Move to {STAGES[STAGES.indexOf(s) + 1]}</button>}
                </div>
              ))}
              {!CANDS.filter((c) => stage(c) === s).length && <p className="tiny dim">Nobody here.</p>}
            </div>
          </div>
        ))}
      </div>
      <Modal open={pub} onClose={() => setPub(false)} title="Publish a role">
        <Form submitLabel="Publish" fields={[{ name: 'role', label: 'Role', type: 'select', required: true, options: ['Design Lead', 'Content Captain', 'Media Chief', 'Tech Head', 'Finance Head', 'Culture Curator', 'Partnerships Lead', 'Marketing Lead', 'Events Captain'] }, { name: 'jd', label: 'What will they do?', type: 'textarea', required: true }, { name: 'deadline', label: 'Apply by', type: 'date', required: true }]} onSubmit={(v) => { submit('role-posting', v, `${v.role} is open for applications.`); setPub(false); }} />
      </Modal>
    </>
  );
}

const CRED = [
  { id: 'k1', college: 'BNMIT', handle: '@under25.bnmit', platform: 'Instagram', login: 'bnmit.under25@example.com', pw: 'demo-pass-1', by: 'Ananya Rao', at: '12 Oct' },
  { id: 'k2', college: 'REVA University', handle: '@under25.reva', platform: 'Instagram', login: 'reva.under25@example.com', pw: 'demo-pass-2', by: 'Fellow', at: '3 Oct' },
  { id: 'k3', college: 'Symbiosis', handle: '@under25.symbi', platform: 'Instagram', login: 'symbi.under25@example.com', pw: 'demo-pass-3', by: 'Fellow', at: '20 Oct' },
];
export function Credentials() {
  const { user, state, submit } = useApp();
  const [shown, setShown] = useState({});
  const [add, setAdd] = useState(false);
  const extra = state.submissions.filter((s) => s.type === 'credential').map((s) => ({ id: s.id, college: user.college, ...s.data, login: s.data.login, by: user.name, at: 'Today' }));
  const rows = [...extra, ...(user.role === 'admin' ? CRED : CRED.filter((c) => c.college === user.college))];
  return (
    <>
      <PageHead title="Credentials log" sub="Club page logins, kept so Under25 can support the page and hand it over cleanly." art="ok-orange" right={<button className="btn" onClick={() => setAdd(true)}>Add a login</button>} />
      <div className="stack">
        <div className="callout warn"><Icon name="TriangleAlert" /><p><b>Demo only. Do not enter real passwords.</b> This prototype keeps everything in your own browser, unencrypted. A live version must encrypt these and limit who can see them.</p></div>
        <DataTable rows={rows} cols={[{ key: 'college', label: 'College' }, { key: 'handle', label: 'Page' }, { key: 'platform', label: 'Platform' }, { key: 'login', label: 'Login' }, { key: 'pw', label: 'Password', noCsv: true, render: (r) => <span className="row" style={{ gap: 8 }}><code>{shown[r.id] ? r.pw : '••••••••'}</code><button className="btn btn-icon" style={{ width: 30, height: 30 }} aria-label={shown[r.id] ? 'Hide password' : 'Show password'} onClick={() => setShown((s) => ({ ...s, [r.id]: !s[r.id] }))}><Icon name="Eye" size={14} /></button></span> }, { key: 'at', label: 'Updated' }]} />
      </div>
      <Modal open={add} onClose={() => setAdd(false)} title="Add a login">
        <Form submitLabel="Save to log" fields={[{ name: 'handle', label: 'Page handle', required: true, placeholder: '@under25.yourcampus' }, { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'Email', 'Canva', 'Other'], required: true }, { name: 'login', label: 'Login (email or username)', required: true }, { name: 'pw', label: 'Password', type: 'password', required: true }]} onSubmit={(v) => { submit('credential', v, 'Saved to the credentials log.'); setAdd(false); }} />
      </Modal>
    </>
  );
}
