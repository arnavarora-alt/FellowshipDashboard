import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Icon from '../components/Icon';
import { Avatar, Bars, Modal, SectionTitle, Sparkline, Sticker, Tag, Tilt } from '../components/ui';
import Spotlight from '../components/Spotlight';
import { StandingTiles } from '../components/Standing';
import { CampusTag } from '../components/extra';
import { RsvpAction } from '../components/Rsvp';
import { useApp, allEvents } from '../store/AppState';
import { canAccess, featureByPath } from '../data/features';
import { APP_EVENTS_URL, instagramUrl } from '../data/links';
import { CAMPUS_FEED, EVENT_SERIES, FOLLOWER_SERIES, HEALTH, HYGIENE, PARTNERS, PEOPLE, RECENT_PHOTOS, UPDATES } from '../data/mock';
import { greeting, fmtDate, fmtFull, monthDay, relDay } from '../lib/utils';
import { userTasks } from '../lib/tasks';
import { mascot, ART } from '../lib/assets';

const TONES = ['yellow', 'orange', 'purple', 'green'];

const QUICK = {
  fellow: [['CalendarPlus', 'List an event', 'Send it for review and go live', '/listevent'], ['UserPlus', 'Assign a task', 'Hand work to your Heads', '/assigntask'], ['Instagram', 'Club page', 'Followers and posting rhythm', '/clubpage'], ['Dumbbell', 'Drills', 'Read them right here', '/drills']],
  hoc: [['ClipboardCheck', 'Hygiene check', 'Eight things every page needs', '/hygiene'], ['Lightbulb', 'Ideas bank', 'Ready-to-shoot ideas', '/contentideas'], ['CalendarRange', 'Content calendar', 'Festivals and milestones', '/contentcal'], ['UserPlus', 'Assign a task', 'Delegate to your content team', '/assigntask']],
  hoo: [['Sparkles', 'Event ideas', 'Easy to run, easy to film', '/eventideas'], ['CalendarRange', 'Event calendar', 'Festivals and milestones', '/eventcal'], ['CalendarPlus', 'List an event', 'The event listing form', '/listevent'], ['UserPlus', 'Assign a task', 'Delegate to your ops team', '/assigntask']],
  core: [['ListChecks', 'My tasks', 'Your first task is waiting', '/tasks'], ['MapPin', 'City meetups', 'Meet other campuses', '/events?type=City%20meetup'], ['PencilRuler', 'Plan an event', 'Pitch it to your Head of Operations', '/planevent'], ['Swords', 'Challenges', 'Earn points with your team', '/challenges']],
  community: [['Ticket', 'Upcoming events', 'RSVP in a tap', '/events'], ['DoorOpen', 'Join the core team', 'Nine lead roles are open', '/join'], ['Mic', 'Talent hunt', 'Watch live or perform', '/talenthunt'], ['MessageSquarePlus', 'Suggestions', 'Tell us what to build', '/suggestions']],
  admin: [['Database', 'Full database', 'Search every member', '/database'], ['UserCheck', 'Applications', 'Accept, reject, interview', '/applications'], ['Inbox', 'Form submissions', 'Everything filled on the site', '/submissions'], ['CalendarClock', 'Team calls', 'Schedule and track', '/calls']],
};

// The four numbers that tell each person where they stand.
function standingTiles(role, { state, count }) {
  const pending = state.applications.filter((a) => a.status === 'pending').length + state.signups.filter((s) => s.status === 'pending').length;
  const done = state.tasks.filter((t) => t.status === 'done').length;
  const open = (id) => state.tasks.filter((t) => t.assignee === id && t.status !== 'done').length;
  if (role === 'fellow') return [
    { tone: 'yellow', label: 'Followers', value: 1180, sub: 'Sem 1 goal of 1,000 cleared. Silver Plaque at 3,000', progress: 1180 / 3000, art: 'arrow-green' },
    { tone: 'orange', label: 'Core team built', value: 64, suffix: '/100', sub: 'Sem 1 goal: a 100-person core team', progress: 0.64, art: 'shapes-yellow' },
    { tone: 'purple', label: 'Events run', value: 9, sub: 'This semester. Keep the reports filed', progress: 9 / 12, art: 'ok-orange' },
    { tone: 'green', label: 'Unlocks earned', value: 2, suffix: '/6', sub: 'Next: your Under25 Spotlight', progress: 2 / 6, art: 'trophy-yellow' },
  ];
  if (role === 'hoc') return [
    { tone: 'yellow', label: 'Posts this month', value: 18, sub: '+4 vs last month', progress: 18 / 24, art: 'arrow-green' },
    { tone: 'orange', label: 'Reach (thousand)', value: 14, suffix: 'k', sub: '+13% in 28 days', progress: 0.7, art: 'shapes-yellow' },
    { tone: 'purple', label: 'Hygiene checks', value: count('check:hygiene:'), suffix: `/${HYGIENE.length}`, sub: 'Eight things every page needs', progress: count('check:hygiene:') / HYGIENE.length, art: 'ok-orange' },
    { tone: 'green', label: 'Tasks open', value: open('hoc-bnmit'), sub: 'Content tasks waiting for you', art: 'trophy-yellow' },
  ];
  if (role === 'hoo') return [
    { tone: 'yellow', label: 'Events this month', value: 3, sub: 'Plus 4 planned for December', progress: 3 / 7, art: 'arrow-green' },
    { tone: 'orange', label: 'Total attendance', value: 290, sub: 'Across this month’s events', progress: 0.72, art: 'shapes-yellow' },
    { tone: 'purple', label: 'RSVP to attendance', value: 71, suffix: '%', sub: 'People who RSVP and show up', progress: 0.71, art: 'ok-orange' },
    { tone: 'green', label: 'Tasks open', value: open('hoo-bnmit'), sub: 'Ops tasks waiting for you', art: 'trophy-yellow' },
  ];
  if (role === 'core') return [
    { tone: 'yellow', label: 'Tasks done', value: done, sub: 'Small wins add up', art: 'arrow-green' },
    { tone: 'orange', label: 'Challenge points', value: 150, sub: 'Earned with your team', progress: 150 / 300, art: 'shapes-yellow' },
    { tone: 'purple', label: 'Events RSVPed', value: count('rsvp:'), sub: 'Show up, meet people', art: 'ok-orange' },
    { tone: 'green', label: 'Days in the club', value: 69, sub: 'Since you joined', art: 'trophy-yellow' },
  ];
  if (role === 'community') return [
    { tone: 'yellow', label: 'Events RSVPed', value: count('rsvp:'), sub: 'Tap RSVP on any on-ground event', art: 'arrow-green' },
    { tone: 'orange', label: 'Certificates earned', value: 1, sub: 'More unlock as you take part', art: 'shapes-yellow' },
    { tone: 'purple', label: 'Lead roles open', value: 9, sub: 'Join the core team', art: 'ok-orange' },
    { tone: 'green', label: 'Members on your campus', value: 132, sub: 'You are one of them', art: 'trophy-yellow' },
  ];
  return [
    { tone: 'yellow', label: 'People in the program', value: PEOPLE.length + state.accounts.length, sub: `${new Set(PEOPLE.map((p) => p.city)).size} cities`, art: 'arrow-green' },
    { tone: 'orange', label: 'Colleges', value: new Set(PEOPLE.map((p) => p.college)).size, sub: `${PARTNERS.length} are Campus Partners`, art: 'shapes-yellow' },
    { tone: 'purple', label: 'Waiting for you', value: pending, sub: 'Applications and sign-ups', art: 'ok-orange' },
    { tone: 'green', label: 'Fellows to check in on', value: HEALTH.filter((h) => h.status === 'MIA').length, sub: 'MIA for two weeks or more', art: 'trophy-yellow' },
  ];
}

const portrait = (leader, size = 'xl') => (
  leader?.photo
    ? <Avatar src={leader.photo} name={leader.name} size={size} />
    : <span className={`avatar ${size} portrait-fallback`}><img src={mascot} alt="" /></span>
);

function PartnerModal({ college, onClose }) {
  const { leadersOf, instagramFor } = useApp();
  const L = college ? leadersOf(college) : null;
  return (
    <Modal open={!!college} onClose={onClose} title={college || ''}>
      {L && (
        <div className="stack">
          <div className="row"><CampusTag college={college} small={false} /><a className="link small" href={instagramFor(college)} target="_blank" rel="noreferrer noopener">Club page on Instagram</a></div>
          <div className="card tint-butter" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {portrait(L.fellow)}
            <div>
              <Tag tone="yellow">Fellow</Tag>
              <h3 style={{ fontSize: 26, margin: '6px 0 2px' }}>{L.fellow?.name || 'Not announced yet'}</h3>
              {L.fellow?.email && <a className="link small" href={`mailto:${L.fellow.email}`}>{L.fellow.email}</a>}
            </div>
          </div>
          <div className="stack-sm">
            {[['Head of Content', L.hoc, 'purple'], ['Head of Operations', L.hoo, 'green']].map(([role, p, tone]) => (
              <div className="list-row" key={role}>
                <Tag tone={tone}>{role}</Tag>
                <span className="grow">{p ? <a className="link" href={`mailto:${p.email}`}>{p.name}</a> : <span className="dim">Not announced yet</span>}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

// What other campuses are doing: partners, hosted events, and photos from recent events.
export function CampusActivity({ college }) {
  const { state, user } = useApp();
  const [sel, setSel] = useState(null);
  const partners = [...new Set([...PARTNERS, ...state.agreements.filter((a) => a.status === 'approved').map((a) => a.college)])];
  const other = CAMPUS_FEED.filter((c) => c.college !== college);
  const fromReports = Object.entries(state.reports).filter(([, r]) => r.instagram).map(([id, r]) => ({ id, college: allEvents(state).concat(state.listedEvents).find((e) => e.id === id)?.college || user.college, title: `${r.attendees} people came`, when: r.at, instagram: r.instagram, cover: r.cover, tone: 'green', art: 'trophy-yellow' }));
  const fresh = [...fromReports, ...RECENT_PHOTOS];
  return (
    <div className="stack" style={{ gap: 26 }}>
      <div>
        <SectionTitle>Campus partners</SectionTitle>
        <div className="card tint-butter">
          <p className="dim small" style={{ marginBottom: 12 }}>Colleges whose management signed the Campus Agreement. Tap one to meet its Fellow, Head of Content and Head of Operations.</p>
          <div className="chips">{partners.map((p, i) => <button key={p} className={`partner-chip pc-${TONES[i % 4]}`} onClick={() => setSel(p)}><Icon name="BadgeCheck" size={16} /> {p} <Icon name="ArrowUpRight" size={14} /></button>)}</div>
        </div>
      </div>
      <div>
        <SectionTitle>What other campuses are hosting</SectionTitle>
        <div className="grid g3">
          {other.slice(0, 6).map((c, i) => (
            <Tilt key={c.id} className={`host solid-${TONES[(i + 1) % 4]}`} onClick={() => window.open(APP_EVENTS_URL, '_blank', 'noopener')} max={5}>
              <div className="lift">
                <div className="row-between"><b>{c.college}</b><CampusTag college={c.college} /></div>
                <p className="tiny" style={{ opacity: 0.8 }}>{c.city}</p>
                <h3 style={{ margin: '10px 0 4px', fontSize: 24 }}>{c.title}</h3>
                <p className="small" style={{ opacity: 0.85 }}>{c.text}</p>
                <div className="row-between" style={{ marginTop: 14 }}>
                  <span className="tiny" style={{ fontWeight: 800 }}>{fmtDate(c.when, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <a className="btn btn-sm host-btn" href={APP_EVENTS_URL} target="_blank" rel="noreferrer noopener" onClick={(e) => e.stopPropagation()}>RSVP on the app <Icon name="ArrowUpRight" size={14} /></a>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Fresh from campus</SectionTitle>
        <div className="grid g4">
          {fresh.map((p) => (
            <a className={`photo-tile tone-${p.tone}`} key={p.id} href={p.instagram} target="_blank" rel="noreferrer noopener" aria-label={`${p.title}, ${p.college}. Opens Instagram`}>
              {p.cover ? <img className="cover" src={p.cover} alt="" /> : <img src={ART[p.art]} alt="" />}
              <span className="ig"><Icon name="Instagram" size={16} /></span>
              <div className="cap"><b>{p.title}</b>{p.college} · {relDay(p.when).toLowerCase()}</div>
            </a>
          ))}
        </div>
        <p className="tiny dim" style={{ marginTop: 8 }}>Each tile opens the campus’s Instagram post. Tiles without a photo are placeholders until a cover photo is shared.</p>
      </div>
      <PartnerModal college={sel} onClose={() => setSel(null)} />
    </div>
  );
}

export default function Home() {
  const app = useApp();
  const { user, state, setTaskStatus } = app;
  const first = user.name.split(' ')[0];
  const now = new Date();
  const myTasks = userTasks(state, user).filter((t) => t.status !== 'done' && !t.locked).slice(0, 4);
  const events = allEvents(state).filter((e) => new Date(e.when) >= now && (e.leaders ? user.role !== 'community' : true) && (e.city === 'All' || e.city === user.city || user.role === 'admin')).sort((a, b) => new Date(a.when) - new Date(b.when)).slice(0, 4);
  const quick = QUICK[user.role].filter((q) => canAccess(user.role, featureByPath[q[3].split('?')[0]]?.key));
  const safe = (href) => { const p = featureByPath[href.split('?')[0]]; return p && canAccess(user.role, p.key) ? href : '/updates'; };

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

      <StandingTiles tiles={standingTiles(user.role, app)} showJourney={['fellow', 'hoc', 'hoo', 'core'].includes(user.role)} />

      <Spotlight />

      <div className="grid g4">
        {quick.map(([ic, t, d, to], i) => (
          <Tilt key={to} to={to} className={`solid-${TONES[i % 4]}`}>
            <div className="quick lift"><span className="ico"><Icon name={ic} /></span><span><b>{t}</b><span>{d}</span></span></div>
          </Tilt>
        ))}
      </div>

      <div className="split">
        {user.role !== 'community' ? (
          <div className="card tint-lilac">
            <div className="card-head"><div><h3>{user.role === 'admin' ? 'Tasks across the program' : 'Your next tasks'}</h3><p className="dim small">Tap a box to mark it done.</p></div><Link className="link small" to="/tasks">All tasks</Link></div>
            {myTasks.length ? myTasks.map((t) => (
              <div className="list-row" key={t.id}>
                <button className="check" style={{ width: 'auto', padding: 8, background: 'transparent' }} role="checkbox" aria-checked={false} aria-label={`Mark ${t.title} done`} onClick={() => (t.to ? null : setTaskStatus(t.id, 'done'))} disabled={!!t.to}><span className="box" /></button>
                <div className="grow"><b>{t.title}</b><p className="dim small">Due {relDay(t.due).toLowerCase()} · from {t.by}</p></div>
                {t.to ? <Link className="btn btn-sm" to={t.to}>Open</Link> : <Tag tone={t.priority === 'High' ? 'orange' : 'purple'}>{t.priority}</Tag>}
              </div>
            )) : <p className="dim">You are all caught up.</p>}
          </div>
        ) : (
          <Tilt className="solid-yellow" to="/join">
            <div className="row-between lift"><div><h3 style={{ fontSize: 30 }} className="display">Ready for more?</h3><p style={{ maxWidth: '40ch' }}>Nine lead roles are open on your campus club. Apply in two minutes and join the core team.</p></div><Sticker name="trophy-purple" size={96} float /></div>
          </Tilt>
        )}
        <div className="card tint-peach">
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
          <div className="card tint-mint"><div className="card-head"><h3>Followers across pilot campuses</h3></div><Sparkline data={FOLLOWER_SERIES} label="Followers over 12 weeks" /></div>
          <div className="card tint-butter"><div className="card-head"><h3>Events held and planned</h3></div><Bars data={EVENT_SERIES.map((e) => e.held || e.plan)} labels={EVENT_SERIES.map((e) => e.m)} /></div>
        </div>
      )}

      <CampusActivity college={user.college} />

      <div>
        <SectionTitle right={<Link className="link small" to="/updates">See all</Link>}>What’s new</SectionTitle>
        <div className="grid g3">
          {UPDATES.slice(0, 3).map((u, i) => (
            <Tilt key={u.id} to={safe(u.href)} className={`solid-${TONES[(i + 2) % 4]}`} max={5}>
              <div className="lift"><span className="tag tag-ink">{u.tag}</span><h3 style={{ margin: '12px 0 6px', fontSize: 24 }}>{u.title}</h3><p className="small" style={{ opacity: 0.85 }}>{u.text}</p><span className="spot-cta" style={{ marginTop: 14 }}>Open <Icon name="ArrowRight" size={15} /></span></div>
            </Tilt>
          ))}
        </div>
      </div>
    </div>
  );
}
