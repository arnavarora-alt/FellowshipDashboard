import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import { Chips, Empty, Form, PageHead, Progress, SectionTitle, Stat, Tabs, Tag, Tilt } from '../components/ui';
import { useApp, allEvents } from '../store/AppState';
import { CITIES, TALENT, UPDATES } from '../data/mock';
import { fmtFull, fmtDate, monthDay, relDay } from '../lib/utils';

export function Updates() {
  const [tag, setTag] = useState('');
  const tags = [...new Set(UPDATES.map((u) => u.tag))];
  const list = UPDATES.filter((u) => !tag || u.tag === tag).sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || new Date(b.when) - new Date(a.when));
  return (
    <>
      <PageHead title="What’s new" sub="Community updates from Under25 and your campus, newest first." art="arrow-yellow" />
      <Chips options={tags} value={tag} onChange={setTag} />
      <div className="stack" style={{ marginTop: 18 }}>
        {list.map((u) => (
          <article className="card" key={u.id}>
            <div className="row-between"><div className="row"><Tag tone={u.pin ? 'yellow' : 'soft'}>{u.pin ? 'Pinned' : u.tag}</Tag><span className="dim small">{relDay(u.when)}</span></div></div>
            <h3 style={{ fontSize: 24, margin: '10px 0 4px' }}>{u.title}</h3>
            <p className="dim" style={{ maxWidth: '70ch' }}>{u.text}</p>
          </article>
        ))}
        {!list.length && <Empty title="Nothing here yet" />}
      </div>
    </>
  );
}

export function EventCard({ e }) {
  const { flag, toggle, user } = useApp();
  const on = flag(`rsvp:${e.id}`);
  const md = monthDay(e.when);
  const going = (e.going || 0) + (on ? 1 : 0);
  const full = going >= e.cap && !on;
  return (
    <Tilt max={4} glare={false}>
      <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
        <div className="event-date"><b>{md.d}</b><span>{md.m}</span></div>
        <div className="grow">
          <div className="row" style={{ gap: 8, marginBottom: 6 }}><Tag tone={e.type === 'City meetup' ? 'orange' : e.type === 'On-ground' ? 'yellow' : e.type === 'Talent hunt' ? 'purple' : ''}>{e.type}</Tag>{e.leaders && <Tag tone="soft">Leaders only</Tag>}{e.status && <Tag>{e.status}</Tag>}</div>
          <h3 style={{ fontSize: 22 }}>{e.title}</h3>
          <p className="dim small" style={{ margin: '4px 0 10px' }}><Icon name="Clock" size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {fmtFull(e.when)} · <Icon name="MapPin" size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {e.where}</p>
          <p className="small">{e.text}</p>
          <div style={{ margin: '14px 0 12px' }}><Progress value={going} max={e.cap} /><p className="tiny dim num" style={{ marginTop: 6 }}>{going} going{user.role === 'admin' || user.role !== 'community' ? ` of ${e.cap} spots` : ''}</p></div>
          <button className={`btn btn-sm ${on ? 'btn-soft' : ''}`} disabled={full} onClick={() => toggle(`rsvp:${e.id}`)} aria-pressed={on}>{on ? <><Icon name="Check" size={16} /> You’re going</> : full ? 'Full' : 'RSVP'}</button>
        </div>
      </div>
    </Tilt>
  );
}

export function UpcomingEvents() {
  const { user, state } = useApp();
  const [type, setType] = useState('');
  const [city, setCity] = useState(user.role === 'admin' ? '' : user.city);
  const base = allEvents(state).filter((e) => (e.leaders ? user.role !== 'community' : true));
  const types = [...new Set(base.map((e) => e.type))];
  const list = base.filter((e) => (!type || e.type === type) && (!city || e.city === city || e.city === 'All')).sort((a, b) => new Date(a.when) - new Date(b.when));
  return (
    <>
      <PageHead title="Upcoming events" sub="RSVP in the app. Your spot is saved the moment you tap." art="arrow-green" />
      <div className="stack">
        <div className="row-between">
          <Chips options={types} value={type} onChange={setType} />
          <select className="select" style={{ width: 200 }} value={city} onChange={(e) => setCity(e.target.value)} aria-label="City">
            <option value="">All cities</option>{CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid g2">{list.map((e) => <EventCard key={e.id} e={e} />)}</div>
        {!list.length && <Empty title="No events match" text="Try another city or type." />}
      </div>
    </>
  );
}

const EVENT_TYPES = ['Orientation', 'Drive or cause', 'Competition', 'Open mic', 'Workshop', 'Sporting League', 'Networking', 'Other'];
export function ListEventForm({ onDone }) {
  const { addEvent, toast, user } = useApp();
  return (
    <Form
      submitLabel="List event"
      fields={[
        { name: 'title', label: 'Event name', required: true, placeholder: 'Club Orientation' },
        { name: 'kind', label: 'Type', type: 'select', options: EVENT_TYPES, required: true },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'time', label: 'Start time', type: 'time', default: '15:00' },
        { name: 'venue', label: 'Venue', required: true, placeholder: `${user.college} Seminar Hall` },
        { name: 'cap', label: 'Expected attendance', type: 'number', placeholder: '100' },
        { name: 'text', label: 'What is it?', type: 'textarea', placeholder: 'A line or two so people know what to expect.' },
      ]}
      onSubmit={(v, reset) => {
        addEvent({ title: v.title, when: new Date(`${v.date}T${v.time || '15:00'}`).toISOString(), where: v.venue, city: user.city, cap: Number(v.cap) || 100, text: v.text || `${v.kind} at ${user.college}.` });
        toast('Event listed. Under25 will review it.');
        reset();
        onDone?.();
      }}
    />
  );
}

export function OnGround({ startTab = 'mine' }) {
  const { state, user } = useApp();
  const loc = useLocation();
  const [tab, setTab] = useState(loc.pathname === '/listevent' ? 'list' : startTab);
  const mine = state.listedEvents;
  const seeded = allEvents({ listedEvents: [] }).filter((e) => e.type === 'On-ground');
  const proposals = state.submissions.filter((s) => s.type === 'event-proposal');
  return (
    <>
      <PageHead title={tab === 'list' ? 'List an event' : 'On-ground events'} sub="Events for the people you see every day. List every one so Under25 can track and support it." art="ok-orange" />
      <div className="stack">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'mine', label: 'My events' }, { id: 'list', label: 'List an event' }, ...(user.role !== 'fellow' ? [{ id: 'proposals', label: `Proposals (${proposals.length})` }] : [])]} />
        {tab === 'mine' && (
          <>
            <div className="grid g4 card"><Stat label="Events this semester" value={9 + mine.length} /><Stat label="Listed on the app" value={7 + mine.length} /><Stat label="Total attendance" value={760} /><Stat label="Reports filed" value={6} /></div>
            <div className="grid g2">
              {[...mine.map((e) => ({ ...e, type: 'On-ground' })), ...seeded].map((e) => <EventCard key={e.id} e={e} />)}
            </div>
          </>
        )}
        {tab === 'list' && <div className="card"><ListEventForm onDone={() => setTab('mine')} /></div>}
        {tab === 'proposals' && (
          <div className="stack">
            {proposals.length ? proposals.map((p) => (
              <div className="card" key={p.id}><div className="row-between"><h3>{p.data.title}</h3><Tag tone="yellow">New</Tag></div><p className="dim small">{p.data.kind} · {p.data.people} people · budget {p.data.budget || 'not set'}</p><p style={{ marginTop: 8 }}>{p.data.why}</p></div>
            )) : <Empty title="No proposals yet" text="Core team members can pitch events from Plan your next event." />}
          </div>
        )}
      </div>
    </>
  );
}
export const ListEvent = () => <OnGround startTab="list" />;

export function PlanEvent() {
  const { submit, state, user } = useApp();
  const mine = state.submissions.filter((s) => s.type === 'event-proposal' && s.userId === user.id);
  return (
    <>
      <PageHead title="Plan your next event" sub="Pitch it to your Head of Operations. A clear idea, a rough budget and who you need is enough." art="ok-yellow" />
      <div className="split">
        <div className="card">
          <Form
            submitLabel="Send to Head of Operations"
            fields={[
              { name: 'title', label: 'Event idea', required: true, placeholder: 'Open mic night' },
              { name: 'kind', label: 'Type', type: 'select', options: EVENT_TYPES, required: true },
              { name: 'people', label: 'People you expect', type: 'number', required: true },
              { name: 'budget', label: 'Rough budget', placeholder: 'Under ₹3k' },
              { name: 'why', label: 'Why this, why now?', type: 'textarea', required: true },
              { name: 'team', label: 'Who do you need on the team?', type: 'textarea' },
            ]}
            onSubmit={(v, reset) => { submit('event-proposal', v, 'Pitch sent to your Head of Operations.'); reset(); }}
          />
        </div>
        <div className="card">
          <h3>Your pitches</h3>
          {mine.length ? mine.map((p) => <div className="list-row" key={p.id}><div className="grow"><b>{p.data.title}</b><p className="dim small">{fmtDate(p.at)} · {p.data.kind}</p></div><Tag tone="yellow">With HoO</Tag></div>) : <p className="dim">Nothing pitched yet. Your first idea does not need to be perfect.</p>}
        </div>
      </div>
    </>
  );
}

export function TalentHunt() {
  const { flag, toggle } = useApp();
  const stageIx = TALENT.stages.findIndex((s) => s.startsWith(TALENT.stage));
  const rows = useMemo(() => TALENT.board.map((b) => ({ ...b, v: b.votes + (flag(`vote:${b.name}`) ? 1 : 0) })).sort((a, b) => b.v - a.v), [flag]);
  return (
    <>
      <PageHead title="Student talent hunt" sub="A phygital hunt across campuses. First round in December, main stage in January." art="ok-purple" />
      <div className="stack">
        <div className="card"><div className="grid g4">{TALENT.stats.map(([l, v]) => <Stat key={l} label={l} value={v} count={false} />)}</div></div>
        <div className="card">
          <div className="card-head"><h3>Where we are</h3><Tag tone="orange"><span className="dot orange" /> Live</Tag></div>
          <div className="timeline">
            {TALENT.stages.map((s, i) => (
              <div key={s} className={`tl-item ${i < stageIx ? 'done' : i === stageIx ? 'now' : ''}`}><span className="tl-dot">{i < stageIx && <Icon name="Check" size={12} strokeWidth={3.5} />}</span><b>{s}</b></div>
            ))}
          </div>
        </div>
        <SectionTitle>Crowd favourites</SectionTitle>
        <div className="card">
          {rows.map((r, i) => (
            <div className="list-row" key={r.name}>
              <b className="display" style={{ fontSize: 34, width: 38 }}>{i + 1}</b>
              <div className="grow"><b>{r.name}</b><p className="dim small">{r.kind} · {r.college}</p></div>
              <span className="num dim">{r.v} votes</span>
              <button className={`btn btn-sm ${flag(`vote:${r.name}`) ? 'btn-soft' : ''}`} onClick={() => toggle(`vote:${r.name}`)} aria-pressed={flag(`vote:${r.name}`)}><Icon name="Heart" size={16} /> {flag(`vote:${r.name}`) ? 'Voted' : 'Vote'}</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
