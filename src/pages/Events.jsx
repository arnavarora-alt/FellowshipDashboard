import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { Chips, Empty, Form, Modal, PageHead, Progress, SectionTitle, Stat, Tabs, Tag, Tilt } from '../components/ui';
import { RsvpAction, canRsvpInApp } from '../components/Rsvp';
import { CampusTag } from '../components/extra';
import { EVENT_FORM, EXECUTED_FORM } from '../data/forms';
import { useApp, allEvents } from '../store/AppState';
import { CITIES, EVENTS, TALENT, UPDATES } from '../data/mock';
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

export function ExecuteModal({ e, onClose }) {
  const { user, saveReport, submit } = useApp();
  return (
    <Modal open={!!e} onClose={onClose} title="Mark event as executed">
      {e && (
        <div className="stack">
          <div className="callout"><Icon name="Info" /><p className="small"><b>{e.title}</b> only counts as executed once this is filled in.</p></div>
          <Form
            submitLabel="Mark as executed"
            fields={EXECUTED_FORM}
            onSubmit={(v) => {
              const report = { attendees: Number(v.attendees), description: v.description, drive: v.drive, by: user.name, at: new Date().toISOString() };
              saveReport(e.id, report);
              submit('event-report', { event: e.title, college: e.college || user.college, date: e.when.slice(0, 10), ...report }, 'Event marked as executed.');
              onClose();
            }}
          />
        </div>
      )}
    </Modal>
  );
}

export function EventCard({ e }) {
  const { user, state, flag } = useApp();
  const [exec, setExec] = useState(false);
  const md = monthDay(e.when);
  const past = new Date(e.when) < new Date();
  const report = state.reports[e.id];
  const going = (e.going || 0) + (flag(`rsvp:${e.id}`) ? 1 : 0);
  const canExec = ['fellow', 'hoo'].includes(user.role) && e.type === 'On-ground' && e.college === user.college && !report;
  const showCount = !e.digital;
  return (
    <Tilt max={4} glare={false}>
      <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
        <div className="event-date"><b>{md.d}</b><span>{md.m}</span></div>
        <div className="grow">
          <div className="row" style={{ gap: 8, marginBottom: 6 }}>
            <Tag tone={e.type === 'City meetup' ? 'orange' : e.type === 'On-ground' ? 'yellow' : e.type === 'Talent hunt' ? 'purple' : ''}>{e.digital ? 'Digital session' : e.type}</Tag>
            {e.leaders && <Tag tone="soft">Leaders only</Tag>}
            {e.status && <Tag>{e.status}</Tag>}
            {report && <Tag tone="green"><Icon name="Check" size={12} /> Executed</Tag>}
          </div>
          <h3 style={{ fontSize: 22 }}>{e.title}</h3>
          <p className="dim small" style={{ margin: '4px 0 10px' }}><Icon name="Clock" size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {fmtFull(e.when)} · <Icon name="MapPin" size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {e.where}</p>
          {e.college && <p className="tiny dim row" style={{ gap: 6, marginBottom: 6 }}>Hosted by {e.college} <CampusTag college={e.college} /></p>}
          <p className="small">{e.text}</p>
          {showCount && !report && (
            <div style={{ margin: '14px 0 12px' }}><Progress value={going} max={e.cap} /><p className="tiny dim num" style={{ marginTop: 6 }}>{going} going{user.role !== 'community' ? ` of ${e.cap} spots` : ''}</p></div>
          )}
          {report && (
            <div className="callout" style={{ margin: '12px 0' }}><Icon name="PartyPopper" /><div className="small"><b>{report.attendees} people came.</b> {report.description}{' '}
              {user.role !== 'community' && <a className="link" href={report.drive} target="_blank" rel="noreferrer noopener">Photos</a>}</div></div>
          )}
          <div className="row" style={{ gap: 8, marginTop: showCount && !report ? 0 : 8 }}>
            <RsvpAction e={e} />
            {canExec && (
              <button className="btn btn-sm btn-soft" disabled={!past} onClick={() => setExec(true)} title={past ? '' : 'Available once the event starts'}>
                <Icon name="CircleCheck" size={15} /> Mark as executed
              </button>
            )}
            {canExec && !past && <span className="tiny dim">Opens when the event starts</span>}
          </div>
        </div>
      </div>
      <ExecuteModal e={exec ? e : null} onClose={() => setExec(false)} />
    </Tilt>
  );
}

export function UpcomingEvents() {
  const { user, state } = useApp();
  const [sp, setSp] = useSearchParams();
  const type = sp.get('type') || '';
  const setType = (t) => setSp(t ? { type: t } : {}, { replace: true });
  const [city, setCity] = useState(user.role === 'admin' ? '' : user.city);
  const now = new Date();
  const base = allEvents(state).filter((e) => (e.leaders ? user.role !== 'community' : true));
  const types = [...new Set(base.map((e) => (e.digital ? 'Session' : e.type)))];
  const list = base.filter((e) => new Date(e.when) >= now && (!type || e.type === type) && (!city || e.city === city || e.city === 'All')).sort((a, b) => new Date(a.when) - new Date(b.when));
  const owner = ['fellow', 'hoo'].includes(user.role);
  const pending = allEvents({ listedEvents: [] }).concat(state.listedEvents.filter((e) => e.status === 'Approved')).filter((e) => e.type === 'On-ground' && new Date(e.when) < now && !state.reports[e.id] && e.college === user.college);
  const done = Object.entries(state.reports).map(([id, r]) => ({ r, e: [...EVENTS, ...state.listedEvents].find((x) => x.id === id) })).filter((x) => x.e && x.e.college === user.college);
  return (
    <>
      <PageHead title="Upcoming events" sub={user.role === 'community' ? 'RSVP to on-ground events here. Digital sessions open in Google Calendar.' : 'On-ground events are RSVP’d by community members. Digital sessions open in Google Calendar.'} art="arrow-green" />
      <div className="stack">
        {owner && pending.length > 0 && (
          <>
            <div className="callout warn"><Icon name="TriangleAlert" /><p><b>{pending.length} event{pending.length > 1 ? 's' : ''} waiting for a report.</b> An event only counts as executed once you add attendance, a description and a Drive link to the photos.</p></div>
            <div className="grid g2">{pending.map((e) => <EventCard key={e.id} e={e} />)}</div>
          </>
        )}
        <div className="row-between">
          <Chips options={types} value={type} onChange={setType} />
          <select className="select" style={{ width: 200 }} value={city} onChange={(e) => setCity(e.target.value)} aria-label="City">
            <option value="">All cities</option>{CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid g2">{list.map((e) => <EventCard key={e.id} e={e} />)}</div>
        {!list.length && <Empty title="No events match" text="Try another city or type." />}
        {owner && done.length > 0 && (
          <>
            <SectionTitle>Recently executed</SectionTitle>
            <div className="grid g2">{done.map(({ e }) => <EventCard key={e.id} e={e} />)}</div>
          </>
        )}
      </div>
    </>
  );
}

const EVENT_TYPES = ['Orientation', 'Drive or cause', 'Competition', 'Open mic', 'Workshop', 'Sporting League', 'Networking', 'Other'];
export function ListEventForm({ onDone }) {
  const { addListedEvent, toast, user } = useApp();
  return (
    <div className="stack">
      <div className="callout"><Icon name="Info" /><p className="small"><b>Hosting something on campus? Let’s get it listed.</b> Once it is reviewed and approved by Under25, it goes live on the app and community members can RSVP. Takes about 5 minutes.</p></div>
      <Form
        submitLabel="Submit for review"
        initial={{ name: user.name, college: user.college, city: user.city }}
        fields={EVENT_FORM}
        onSubmit={(v, reset) => {
          addListedEvent(v, user.id);
          toast('Submitted. Under25 will review it and WhatsApp you if anything needs sorting.');
          reset();
          onDone?.();
        }}
      />
    </div>
  );
}

export function OnGround({ startTab = 'mine' }) {
  const { state, user } = useApp();
  const [sp] = useSearchParams();
  const [tab, setTab] = useState(startTab);
  const mine = state.listedEvents.filter((e) => user.role === 'admin' || e.college === user.college);
  const seeded = EVENTS.filter((e) => e.type === 'On-ground' && (user.role === 'admin' || e.college === user.college));
  const all = [...mine, ...seeded].sort((a, b) => new Date(b.when) - new Date(a.when));
  const proposals = state.submissions.filter((s) => s.type === 'event-proposal');
  const executed = Object.keys(state.reports).filter((id) => all.some((e) => e.id === id)).length;
  return (
    <>
      <PageHead title={tab === 'list' ? 'List an event' : 'On-ground events'} sub="Events for the people you see every day. Listed events go live on the Under25 app once approved. An event counts as executed only after you file its report." art="ok-orange" />
      <div className="stack">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'mine', label: 'My events' }, { id: 'list', label: 'List an event' }, ...(user.role !== 'fellow' ? [{ id: 'proposals', label: `Proposals (${proposals.length})` }] : [])]} />
        {tab === 'mine' && (
          <>
            <div className="grid g4 card"><Stat label="Events on the list" value={all.length} /><Stat label="Executed" value={executed} /><Stat label="Waiting for review" value={mine.filter((e) => e.status === 'Pending review').length} /><Stat label="Waiting for a report" value={all.filter((e) => new Date(e.when) < new Date() && !state.reports[e.id] && e.status !== 'Pending review').length} /></div>
            <div className="grid g2">{all.map((e) => <EventCard key={e.id} e={e} />)}</div>
            {!all.length && <Empty title="No events yet" text="List your first on-ground event." />}
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
