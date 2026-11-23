import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Icon from '../components/Icon';
import { Bars, SectionTitle, Sparkline, Stat, Sticker, Tag, Tilt } from '../components/ui';
import Spotlight from '../components/Spotlight';
import { CampusTag } from '../components/extra';
import { RsvpAction } from '../components/Rsvp';
import { useApp, allEvents } from '../store/AppState';
import { canAccess, featureByPath } from '../data/features';
import { CAMPUS_FEED, EVENT_SERIES, FOLLOWER_SERIES, HEALTH, HYGIENE, PARTNERS, PEOPLE, RECENT_PHOTOS, UPDATES } from '../data/mock';
import { greeting, fmtDate, fmtFull, monthDay, relDay } from '../lib/utils';
import { userTasks } from '../lib/tasks';
import { mascot, ART } from '../lib/assets';

const QUICK = {
  fellow: [['CalendarPlus', 'List an event', 'Send it for review and go live', '/listevent'], ['UserPlus', 'Assign a task', 'Hand work to your Heads', '/assigntask'], ['Instagram', 'Club page', 'Followers and posting rhythm', '/clubpage'], ['Dumbbell', 'Drills', 'Read them right here', '/drills']],
  hoc: [['ClipboardCheck', 'Hygiene check', 'Eight things every page needs', '/hygiene'], ['Lightbulb', 'Ideas bank', 'Ready-to-shoot ideas', '/contentideas'], ['CalendarRange', 'Content calendar', 'Festivals and milestones', '/contentcal'], ['UserPlus', 'Assign a task', 'Delegate to your content team', '/assigntask']],
  hoo: [['Sparkles', 'Event ideas', 'Easy to run, easy to film', '/eventideas'], ['CalendarRange', 'Event calendar', 'Festivals and milestones', '/eventcal'], ['CalendarPlus', 'List an event', 'The event listing form', '/listevent'], ['UserPlus', 'Assign a task', 'Delegate to your ops team', '/assigntask']],
  core: [['ListChecks', 'My tasks', 'Your first task is waiting', '/tasks'], ['MapPin', 'City meetups', 'Meet other campuses', '/events?type=City%20meetup'], ['PencilRuler', 'Plan an event', 'Pitch it to your Head of Operations', '/planevent'], ['Camera', 'Upload photos', 'Share campus moments', '/uploadphotos']],
  community: [['Ticket', 'Upcoming events', 'RSVP in a tap', '/events'], ['DoorOpen', 'Join the core team', 'Nine lead roles are open', '/join'], ['Mic', 'Talent hunt', 'Watch live or perform', '/talenthunt'], ['MessageSquarePlus', 'Suggestions', 'Tell us what to build', '/suggestions']],
  admin: [['Database', 'Full database', 'Search every member', '/database'], ['UserCheck', 'Applications', 'Accept, reject, interview', '/applications'], ['Inbox', 'Form submissions', 'Everything filled on the site', '/submissions'], ['CalendarClock', 'Team calls', 'Schedule and track', '/calls']],
};

function Stats({ role }) {
  const { state, count } = useApp();
  const pending = state.applications.filter((a) => a.status === 'pending').length;
  const hy = count('check:hygiene:');
  const done = state.tasks.filter((t) => t.status === 'done').length;
  const rsvps = count('rsvp:');
  if (role === 'fellow') return <><Stat label="Followers (Sem 1 target 1,000)" value={1180} delta="+120 this month" /><Stat label="Core team built (target 100)" value={64} /><Stat label="Events run this semester" value={9} /><Stat label="Unlocks earned" value={2} /></>;
  if (role === 'hoc') return <><Stat label="Posts this month" value={18} delta="+4 vs last" /><Stat label="Reach (thousand)" value={14.1} count={false} delta="+13%" /><Stat label="Hygiene checks done" value={hy} suffix={`/${HYGIENE.length}`} /><Stat label="Content tasks open" value={state.tasks.filter((t) => t.assignee === 'hoc-bnmit' && t.status !== 'done').length} /></>;
  if (role === 'hoo') return <><Stat label="Events this month" value={3} /><Stat label="Total attendance" value={290} /><Stat label="RSVP to attendance" value={71} suffix="%" /><Stat label="Ops tasks open" value={state.tasks.filter((t) => t.assignee === 'hoo-bnmit' && t.status !== 'done').length} /></>;
  if (role === 'core') return <><Stat label="Tasks done" value={done} /><Stat label="Challenge points" value={150} /><Stat label="Events RSVPed" value={rsvps} /><Stat label="Days in the club" value={69} /></>;
  if (role === 'community') return <><Stat label="Events RSVPed" value={rsvps} /><Stat label="Certificates earned" value={1} /><Stat label="Lead roles open" value={9} /><Stat label="Members on your campus" value={132} /></>;
  const cities = new Set(PEOPLE.map((p) => p.city)).size;
  return <><Stat label="People in the program" value={PEOPLE.length + state.accounts.length} /><Stat label="Colleges" value={new Set(PEOPLE.map((p) => p.college)).size} /><Stat label="Applications waiting" value={pending + state.signups.filter((s) => s.status === 'pending').length} delta={`${cities} cities`} /><Stat label="Fellows needing a check-in" value={HEALTH.filter((h) => h.status === 'MIA').length} down delta="MIA" /></>;
}

// What other campuses are doing: hosted events, Campus Partners and photos from recent events.
export function CampusActivity({ college }) {
  const { state, user } = useApp();
  const partners = [...new Set([...PARTNERS, ...state.agreements.filter((a) => a.status === 'approved').map((a) => a.college)])];
  const reports = Object.entries(state.reports).map(([id, r]) => ({ id, r })).slice(0, 3);
  const other = CAMPUS_FEED.filter((c) => c.college !== college);
  return (
    <div className="stack" style={{ gap: 22 }}>
      <div>
        <SectionTitle>Campus partners</SectionTitle>
        <div className="card">
          <p className="dim small" style={{ marginBottom: 12 }}>Colleges whose management has signed the Campus Agreement and officiated the Under25 club.</p>
          <div className="chips">{partners.map((p) => <span key={p} className="tag tag-yellow" style={{ fontSize: 14, padding: '6px 14px' }}><Icon name="BadgeCheck" size={15} /> {p}</span>)}</div>
        </div>
      </div>
      <div>
        <SectionTitle>What other campuses are hosting</SectionTitle>
        <div className="grid g3">
          {other.slice(0, 6).map((c) => (
            <div className="card" key={c.id}>
              <div className="row-between"><b>{c.college}</b><CampusTag college={c.college} /></div>
              <p className="tiny dim">{c.city}</p>
              <h3 style={{ margin: '10px 0 4px', fontSize: 22 }}>{c.title}</h3>
              <p className="dim small">{c.text}</p>
              <p className="tiny" style={{ marginTop: 10, color: 'var(--accent-text)', fontWeight: 700 }}>{fmtDate(c.when, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Fresh from campus</SectionTitle>
        <div className="grid g4">
          {RECENT_PHOTOS.map((p) => (
            <div className={`photo-tile tone-${p.tone}`} key={p.id}>
              <img src={ART[p.art]} alt="" />
              <div className="cap"><b>{p.title}</b>{p.college} · {relDay(p.when).toLowerCase()}</div>
            </div>
          ))}
          {reports.map(({ id, r }) => (
            <div className="photo-tile tone-green" key={id}>
              <img src={ART['trophy-yellow']} alt="" />
              <div className="cap"><b>{r.attendees} people came</b>{user.role !== 'community' ? <a href={r.drive} target="_blank" rel="noreferrer noopener" style={{ textDecoration: 'underline' }}>View photos</a> : 'Executed this week'}</div>
            </div>
          ))}
        </div>
        <p className="tiny dim" style={{ marginTop: 8 }}>Photo tiles are placeholders. Executed events link to the Drive photos their team shared.</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, state, setTaskStatus } = useApp();
  const first = user.name.split(' ')[0];
  const now = new Date();
  const myTasks = userTasks(state, user).filter((t) => t.status !== 'done' && !t.locked).slice(0, 4);
  const events = allEvents(state).filter((e) => new Date(e.when) >= now && (e.leaders ? user.role !== 'community' : true) && (e.city === 'All' || e.city === user.city || user.role === 'admin')).sort((a, b) => new Date(a.when) - new Date(b.when)).slice(0, 4);
  const quick = QUICK[user.role].filter((q) => canAccess(user.role, featureByPath[q[3].split('?')[0]]?.key));

  return (
    <div className="stack" style={{ gap: 24 }}>
      <motion.section className="hero hero-slim" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
        <div>
          <h1>{greeting()}, {first}</h1>
          <p className="row" style={{ gap: 8, marginTop: 10 }}><span>{user.college}</span><CampusTag college={user.college} /></p>
        </div>
        <div className="stage" aria-hidden="true">
          <motion.img className="mascot" src={mascot} alt="" animate={{ y: [0, -8, 0], rotateZ: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </motion.section>

      <Spotlight />

      <div className="card"><div className="grid g4"><Stats role={user.role} /></div></div>

      <div className="grid g4">
        {quick.map(([ic, t, d, to]) => (
          <Tilt key={to} to={to}>
            <div className="quick lift"><span className="ico"><Icon name={ic} /></span><span><b>{t}</b><span>{d}</span></span></div>
          </Tilt>
        ))}
      </div>

      <div className="split">
        {user.role !== 'community' ? (
          <div className="card">
            <div className="card-head"><div><h3>{user.role === 'admin' ? 'Tasks across the program' : 'Your next tasks'}</h3><p className="dim small">Tap a box to mark it done.</p></div><Link className="link small" to="/tasks">All tasks</Link></div>
            {myTasks.length ? myTasks.map((t) => (
              <div className="list-row" key={t.id}>
                <button className="check" style={{ width: 'auto', padding: 8, background: 'transparent' }} role="checkbox" aria-checked={false} aria-label={`Mark ${t.title} done`} onClick={() => (t.to ? null : setTaskStatus(t.id, 'done'))} disabled={!!t.to}><span className="box" /></button>
                <div className="grow"><b>{t.title}</b><p className="dim small">Due {relDay(t.due).toLowerCase()} · from {t.by}</p></div>
                {t.to ? <Link className="btn btn-sm btn-soft" to={t.to}>Open</Link> : <Tag tone={t.priority === 'High' ? 'orange' : ''}>{t.priority}</Tag>}
              </div>
            )) : <p className="dim">You are all caught up.</p>}
          </div>
        ) : (
          <Tilt className="card-accent" to="/join">
            <div className="row-between lift"><div><h3 style={{ fontSize: 30 }} className="display">Ready for more?</h3><p style={{ maxWidth: '40ch' }}>Nine lead roles are open on your campus club. Apply in two minutes and join the core team.</p></div><Sticker name="trophy-yellow" size={96} float /></div>
          </Tilt>
        )}
        <div className="card">
          <div className="card-head"><div><h3>Coming up</h3></div><Link className="link small" to="/events">All events</Link></div>
          {events.map((e) => {
            const md = monthDay(e.when);
            return (
              <div className="list-row" key={e.id} style={{ alignItems: 'flex-start' }}>
                <div className="event-date"><b>{md.d}</b><span>{md.m}</span></div>
                <div className="grow"><b>{e.title}</b><p className="dim small">{fmtFull(e.when)} · {e.where}</p></div>
                <RsvpAction e={e} />
              </div>
            );
          })}
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="split">
          <div className="card"><div className="card-head"><h3>Followers across pilot campuses</h3></div><Sparkline data={FOLLOWER_SERIES} label="Followers over 12 weeks" /></div>
          <div className="card"><div className="card-head"><h3>Events held and planned</h3></div><Bars data={EVENT_SERIES.map((e) => e.held || e.plan)} labels={EVENT_SERIES.map((e) => e.m)} /></div>
        </div>
      )}

      <CampusActivity college={user.college} />

      <div>
        <SectionTitle right={<Link className="link small" to="/updates">See all</Link>}>What’s new</SectionTitle>
        <div className="grid g3">
          {UPDATES.slice(0, 3).map((u) => (
            <div className="card" key={u.id}><Tag tone="soft">{u.tag}</Tag><h3 style={{ margin: '10px 0 6px' }}>{u.title}</h3><p className="dim small">{u.text}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}
