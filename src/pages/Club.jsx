import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Icon from '../components/Icon';
import { Bars, CheckItem, Chips, ExtLink, Form, PageHead, Progress, SectionTitle, Sparkline, Stat, Sticker, Tabs, Tag, Tilt, Avatar } from '../components/ui';
import { useApp } from '../store/AppState';
import { CONTENT_GUIDELINES, PLAQUE, PROGRAM_CAL, RESOURCES } from '../data/content';
import { CONTENT_IDEAS, EVENTS, FOLLOWER_SERIES, HYGIENE, LAUNCH_POSTS, POSTS_SERIES, REACH_SERIES, inDays } from '../data/mock';
import { EventCard } from './Events';
import { fmtDate } from '../lib/utils';

export function ClubPage() {
  const { user, count } = useApp();
  const done = count('check:hygiene:');
  const followers = FOLLOWER_SERIES[FOLLOWER_SERIES.length - 1];
  return (
    <>
      <PageHead title="Club page" sub={`Statistics for the ${user.college} club page. Pages are templatised at launch, then given creative direction.`} art="ok-purple" />
      <div className="stack">
        <div className="card"><div className="grid g4"><Stat label="Followers" value={followers} delta="+120 this month" /><Stat label="Reach (thousand, 28 days)" value={REACH_SERIES[11]} count={false} delta="+13%" /><Stat label="Posts this month" value={POSTS_SERIES.slice(-4).reduce((a, b) => a + b, 0)} /><Stat label="Hygiene checks" value={done} suffix={`/${HYGIENE.length}`} /></div></div>
        <div className="split">
          <div className="card"><div className="card-head"><h3>Followers, last 12 weeks</h3><Tag tone="soft">Sem 1 target 1,000 reached</Tag></div><Sparkline data={FOLLOWER_SERIES} label="Followers by week" /></div>
          <div className="card"><div className="card-head"><h3>Plaque progress</h3></div>
            <div className="stack">{PLAQUE.map((p) => <div key={p.name}><div className="row-between small"><b>{p.name}</b><span className="dim num">{followers.toLocaleString('en-IN')} / {p.followers.toLocaleString('en-IN')}</span></div><Progress value={followers} max={p.followers} /></div>)}</div></div>
        </div>
        <div className="split">
          <div className="card"><div className="card-head"><h3>Posts per week</h3></div><Bars data={POSTS_SERIES} labels={POSTS_SERIES.map((_, i) => `W${i + 1}`)} /></div>
          <div className="card"><h3>Top posts</h3>{[['Team launch carousel', '4.8k reach'], ['Orientation recap reel', '3.9k reach'], ['5MOP shoutouts', '2.2k reach']].map(([t, r]) => <div className="list-row" key={t}><Icon name="Flame" style={{ color: 'var(--orange)' }} /><b className="grow">{t}</b><span className="dim small">{r}</span></div>)}
            {user.role !== 'core' && <Link className="btn btn-sm" style={{ marginTop: 14 }} to="/hygiene">Run the hygiene check</Link>}</div>
        </div>
      </div>
    </>
  );
}

export function Hygiene() {
  const { count } = useApp();
  const [tab, setTab] = useState('hygiene');
  const n = count('check:hygiene:');
  const m = count('check:launch:');
  const all = tab === 'hygiene' ? n === HYGIENE.length : m === LAUNCH_POSTS.length;
  return (
    <>
      <PageHead title="Club page hygiene check" sub="Handle, bio, logo, highlights and a first week of posts. Tick each one off as you go." art="ok-yellow" />
      <div className="stack">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'hygiene', label: `Hygiene check ${n}/${HYGIENE.length}` }, { id: 'launch', label: `Team launch posts ${m}/${LAUNCH_POSTS.length}` }]} />
        <div className="card">
          <Progress value={tab === 'hygiene' ? n : m} max={tab === 'hygiene' ? HYGIENE.length : LAUNCH_POSTS.length} />
          <AnimatePresence>{all && <motion.div className="callout" style={{ marginTop: 14 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Icon name="PartyPopper" /><b>All done. That is a page people want to follow.</b></motion.div>}</AnimatePresence>
          <div className="stack-sm" style={{ marginTop: 16 }}>
            {tab === 'hygiene' ? HYGIENE.map(([t, d], i) => <CheckItem key={t} id={`check:hygiene:${i}`} title={t} text={d} />) : (
              <>
                <p className="dim small">Teams are announced with a feedbreaker post and one post for each position, so each person is seen.</p>
                {LAUNCH_POSTS.map((t, i) => <CheckItem key={t} id={`check:launch:${i}`} title={t} />)}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function ContentIdeas() {
  const { flag, toggle, addTask, user, toast } = useApp();
  const [fmt, setFmt] = useState('');
  const [eff, setEff] = useState('');
  const [saved, setSaved] = useState(false);
  const list = CONTENT_IDEAS.filter((c) => (!fmt || c.format === fmt) && (!eff || c.effort === eff) && (!saved || flag(`saved:${c.id}`)));
  return (
    <>
      <PageHead title="Content ideas bank" sub="Next content ideas, ready to shoot. Save the good ones or turn one into a task." art="ok-yellow" />
      <div className="stack">
        <div className="row-between"><Chips options={[...new Set(CONTENT_IDEAS.map((c) => c.format))]} value={fmt} onChange={setFmt} all="All formats" /><div className="row"><Chips all="Any effort" options={['Low', 'Medium', 'High']} value={eff} onChange={setEff} /><button className="chip" aria-pressed={saved} onClick={() => setSaved(!saved)}><Icon name="Star" size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Saved</button></div></div>
        <div className="grid g3">
          {list.map((c) => (
            <Tilt key={c.id} max={5}>
              <div className="lift stack-sm">
                <div className="row-between"><Tag tone="purple">{c.format}</Tag><button className="btn btn-icon" style={{ width: 34, height: 34 }} aria-label={flag(`saved:${c.id}`) ? 'Unsave idea' : 'Save idea'} aria-pressed={flag(`saved:${c.id}`)} onClick={() => toggle(`saved:${c.id}`)}><Icon name="Star" size={16} style={flag(`saved:${c.id}`) ? { fill: 'var(--yellow)', color: 'var(--yellow)' } : null} /></button></div>
                <h3 style={{ fontSize: 22 }}>{c.title}</h3><p className="dim small">{c.hook}</p>
                <div className="row-between" style={{ marginTop: 6 }}><span className="tiny dim">Effort: {c.effort}</span><button className="btn btn-sm btn-ghost" onClick={() => { addTask({ title: `Shoot: ${c.title}`, text: c.hook, assignee: user.id, due: inDays(5), by: user.name, priority: 'Medium' }); toast('Added to your tasks'); }}>Make it a task</button></div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </>
  );
}

export const MOMENTS = [
  { id: 'm1', mo: 10, d: 14, t: 'Children’s Day', kind: 'Festival', content: 'Throwback photo carousel of the team as kids.', event: 'A story-telling hour with a local school.' },
  { id: 'm2', mo: 10, d: 25, t: 'Under25 Plaque launch', kind: 'Program', content: 'Plaque tier explainer with your page’s current count.', event: 'Follower milestone meetup at your campus.' },
  { id: 'm3', mo: 10, d: 28, t: 'Student talent hunt launch', kind: 'Program', content: 'Teaser reel with auditionee intros.', event: 'Open mic auditions on campus.' },
  { id: 'm4', mo: 11, d: 3, t: 'Campus Awards launch', kind: 'Program', content: 'Explain the 6 categories and proof you need.', event: 'Awards info session for the whole club.' },
  { id: 'm5', mo: 11, d: 12, t: 'Talent hunt round 1', kind: 'Program', content: 'Behind-the-scenes at auditions.', event: 'Round 1 auditions on campus.' },
  { id: 'm6', mo: 11, d: 25, t: 'Christmas', kind: 'Festival', content: 'Team gift exchange reel.', event: 'Secret Santa for the club.' },
  { id: 'm7', mo: 11, d: 31, t: 'New Year’s Eve', kind: 'Festival', content: 'Year-in-review carousel with numbers and faces.', event: 'Dear Future Self letter-writing evening.' },
  { id: 'm8', mo: 0, d: 12, t: 'National Youth Day', kind: 'Festival', content: 'Seniors’ advice, 30 seconds each.', event: 'Alumni fireside chat.' },
  { id: 'm9', mo: 0, d: 14, t: 'Makar Sankranti and Pongal', kind: 'Festival', content: 'Campus kite and food story series.', event: 'Kite-flying meetup.' },
  { id: 'm10', mo: 0, d: 20, t: 'Talent hunt main stage', kind: 'Program', content: 'Live-poll story series.', event: 'Main stage finale.' },
  { id: 'm11', mo: 0, d: 26, t: 'Republic Day', kind: 'Festival', content: 'Quiz series on the Constitution.', event: 'Campus quiz league.' },
  { id: 'm12', mo: 1, d: 3, t: 'Second challenge briefed', kind: 'Program', content: 'Brief explainer with an example.', event: 'Challenge kickoff huddle.' },
  { id: 'm13', mo: 1, d: 14, t: 'Valentine’s Day', kind: 'Festival', content: 'Letter writing: appreciate someone.', event: 'Letter writing evening.' },
  { id: 'm14', mo: 2, d: 8, t: 'International Women’s Day', kind: 'Festival', content: 'Spotlight the women who lead your club.', event: 'Panel with women leaders.' },
  { id: 'm15', mo: 2, d: 15, t: 'Campus Awards nominations', kind: 'Program', content: 'How to submit proof, step by step.', event: 'Proof-collection workshop.' },
];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function PlanCalendar({ kind }) {
  const { flag, toggle } = useApp();
  const [mo, setMo] = useState('');
  const months = [10, 11, 0, 1, 2];
  const list = MOMENTS.filter((m) => !mo || String(m.mo) === mo);
  const prog = PROGRAM_CAL.find((p) => p.m === 'November');
  return (
    <div className="stack">
      <div className="callout"><Icon name="CalendarDays" /><div><b>November: {prog.items.join(', ')}</b><p className="small">{prog.how}</p></div></div>
      <div className="chips"><button className="chip" aria-pressed={mo === ''} onClick={() => setMo('')}>All</button>{months.map((m) => <button key={m} className="chip" aria-pressed={mo === String(m)} onClick={() => setMo(String(m))}>{MONTH[m]}</button>)}</div>
      <div className="card">
        {list.map((m) => (
          <div className="list-row" key={m.id} style={{ alignItems: 'flex-start' }}>
            <div className="event-date"><b>{m.d}</b><span>{MONTH[m.mo]}</span></div>
            <div className="grow"><div className="row" style={{ gap: 8 }}><b>{m.t}</b><Tag tone={m.kind === 'Festival' ? 'orange' : 'purple'}>{m.kind}</Tag></div><p className="dim small" style={{ marginTop: 4 }}>{kind === 'content' ? m.content : m.event}</p></div>
            <button className={`btn btn-sm ${flag(`plan:${kind}:${m.id}`) ? 'btn-soft' : 'btn-ghost'}`} aria-pressed={flag(`plan:${kind}:${m.id}`)} onClick={() => toggle(`plan:${kind}:${m.id}`)}>{flag(`plan:${kind}:${m.id}`) ? <><Icon name="Check" size={14} /> Planned</> : 'Add to plan'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export function ContentCal() {
  return (<><PageHead title="Content calendar" sub="Upcoming festivals, milestones and what to post around each one." art="arrow-yellow" /><PlanCalendar kind="content" /></>);
}

export function ClubResources() {
  const { user } = useApp();
  const list = RESOURCES.filter((r) => user.role === 'admin' || r.roles.includes(user.role));
  return (
    <>
      <PageHead title="Club page resources" sub="Everything you need to make the page look and feel like Under25. Opens in Notion." art="shapes-green" />
      <div className="grid g3">
        {list.map((r) => (
          <Tilt key={r.id} max={5}><div className="lift stack-sm"><span className="avatar"><Icon name={r.icon} /></span><h3 style={{ fontSize: 22 }}>{r.title}</h3><p className="dim small">{r.text}</p><ExtLink href={r.url}>Open <Icon name="ExternalLink" size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /></ExtLink></div></Tilt>
        ))}
      </div>
    </>
  );
}

export function ContentGuide() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHead title="Content guidelines" sub="How Under25 content should look, sound and behave." art="ok-purple" />
      <div className="stack-sm">
        {CONTENT_GUIDELINES.map(([t, d], i) => (
          <button key={t} className="card card-click" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <div className="row-between"><h3 style={{ fontSize: 22 }}>{i + 1}. {t}</h3><Icon name="ChevronDown" style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }} /></div>
            {open === i && <p className="dim" style={{ marginTop: 8, maxWidth: '64ch' }}>{d}</p>}
          </button>
        ))}
      </div>
    </>
  );
}

export function DraftRoom() {
  const { submit, state, user } = useApp();
  const next = EVENTS.find((e) => e.id === 'e2');
  const wall = state.submissions.filter((s) => s.type === 'shoutout');
  const posts = state.submissions.filter((s) => s.type === 'draft' && s.userId === user.id);
  return (
    <>
      <PageHead title="The Draft Room" sub="A weekly content workshop and appreciation platform. Bring real page content, get real feedback." art="ok-orange" />
      <div className="stack">
        <div className="grid g2"><EventCard e={next} />
          <div className="card"><h3 style={{ marginBottom: 12 }}>Bring a post for feedback</h3>
            <Form submitLabel="Add to this week’s queue" fields={[{ name: 'link', label: 'Link or caption', required: true, placeholder: 'https://instagram.com/…' }, { name: 'ask', label: 'What do you want feedback on?', type: 'textarea' }]} onSubmit={(v, reset) => { submit('draft', v, 'Added to the Draft Room queue.'); reset(); }} />
            {posts.length > 0 && <p className="small dim" style={{ marginTop: 10 }}>{posts.length} in the queue from you.</p>}</div></div>
        <SectionTitle>Appreciation wall</SectionTitle>
        <div className="grid g2">
          <div className="card"><h3 style={{ marginBottom: 12 }}>Give a 5MOP shoutout</h3><Form submitLabel="Post shoutout" fields={[{ name: 'name', label: 'Who?', required: true }, { name: 'text', label: 'What did they do?', type: 'textarea', required: true }]} onSubmit={(v, reset) => { submit('shoutout', v, `Shoutout posted for ${v.name}.`); reset(); }} /></div>
          <div className="card">{[...wall.map((w) => [w.data.name, w.data.text]), ['Diya Menon', 'Redesigned the orientation poster overnight.'], ['Isha Nair', 'Shot and edited the aftermovie in two days.']].map(([n, t]) => <div className="list-row" key={n + t} style={{ alignItems: 'flex-start' }}><Avatar name={n} size="sm" /><div><b>{n}</b><p className="dim small">{t}</p></div></div>)}</div>
        </div>
      </div>
    </>
  );
}
