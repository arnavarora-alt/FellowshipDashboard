import { useMemo, useState } from 'react';
import { CampusTag } from '../components/extra';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { Avatar, Bars, Chips, DataTable, Empty, ExtLink, Form, Modal, PageHead, Progress, SearchBox, SectionTitle, Stat, Tabs, Tag, Tilt } from '../components/ui';
import { useApp, allEvents } from '../store/AppState';
import { ABOUT_NUMBERS, MIA_SCRIPT, PROGRAM_CAL, RITUALS } from '../data/content';
import { APPLICATIONS, CITIES, DOCS, EVENTS, HEALTH, PEOPLE } from '../data/mock';
import { fmtDate, fmtFull, pct } from '../lib/utils';

export function Database() {
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [view, setView] = useState(null);
  const { state } = useApp();
  const ROLE = { fellow: 'Fellow', hoc: 'Head of Content', hoo: 'Head of Operations', core: 'Core team', community: 'Community member' };
  const joined = state.accounts.map((a) => ({ id: a.id, name: a.name, phone: a.phone, email: a.email, college: a.college, city: a.city || '', role: ROLE[a.role], joined: (a.joined || '').slice(0, 10), photo: a.photo, lastActive: 0 }));
  const people = [...joined, ...PEOPLE];
  const rows = useMemo(() => people.filter((p) => (!role || p.role === role) && (!city || p.city === city) && (!q || `${p.name} ${p.email} ${p.college} ${p.phone} ${p.id}`.toLowerCase().includes(q.toLowerCase()))), [q, role, city, state.accounts]);
  return (
    <>
      <PageHead title="Full database" sub="Name, number, email, college and role for everyone in the program. Export what you filter." art="shapes-yellow" />
      <div className="stack">
        <div className="row-between"><div style={{ flex: '1 1 280px', maxWidth: 420 }}><SearchBox value={q} onChange={setQ} placeholder="Search name, email, number, college" /></div>
          <select className="select" style={{ width: 180 }} value={city} onChange={(e) => setCity(e.target.value)} aria-label="City"><option value="">All cities</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        <Chips options={['Fellow', 'Head of Content', 'Head of Operations', 'Core team', 'Community member']} value={role} onChange={setRole} all="All roles" />
        <DataTable rows={rows} csv="under25-database.csv" pageSize={12} cols={[
          { key: 'name', label: 'Name', render: (r) => <span className="row" style={{ gap: 10, flexWrap: 'nowrap' }}><Avatar src={r.photo} name={r.name} size="sm" /><b>{r.name}</b></span> },
          { key: 'phone', label: 'Number' }, { key: 'email', label: 'Email' }, { key: 'college', label: 'College', render: (r) => <span className="row" style={{ gap: 6 }}>{r.college}<CampusTag college={r.college} /></span> }, { key: 'city', label: 'City' },
          { key: 'role', label: 'Role', render: (r) => <Tag tone={r.role === 'Fellow' ? 'yellow' : r.role === 'Head of Content' ? 'purple' : r.role === 'Head of Operations' ? 'orange' : r.role === 'Core team' ? 'green' : ''}>{r.role}</Tag> },
          { key: 'id', label: '', noCsv: true, render: (r) => <button className="btn btn-sm btn-ghost" onClick={() => setView(r)}>View</button> },
        ]} />
      </div>
      <Modal open={!!view} onClose={() => setView(null)} title={view?.name || ''}>
        {view && <div className="stack-sm">
          {[['ID', view.id], ['Role', view.role], ['College', `${view.college}, ${view.city}`], ['Number', view.phone], ['Email', view.email], ['Joined', fmtDate(view.joined, { day: 'numeric', month: 'short', year: 'numeric' })], ['Last active', view.lastActive === 0 ? 'Today' : `${view.lastActive} days ago`]].map(([k, v]) => <div className="row-between" key={k}><span className="dim">{k}</span><b>{v}</b></div>)}
          <a className="btn" style={{ alignSelf: 'flex-start', marginTop: 10 }} href={`mailto:${view.email}`}>Email {view.name.split(' ')[0]}</a>
        </div>}
      </Modal>
    </>
  );
}

export function Applications() {
  const { state, setApplication, addCall, toast } = useApp();
  const [stage, setStage] = useState('');
  const [iv, setIv] = useState(null);
  const list = state.applications.filter((a) => !stage || a.stage === stage);
  const pending = state.applications.filter((a) => a.status === 'pending').length;
  return (
    <>
      <PageHead title="Fellowship applications" sub="Accept, reject or set up an interview. Use the same criteria sheet for every panelist." art="ok-yellow" />
      <div className="stack">
        <div className="card"><div className="grid g4"><Stat label="Waiting" value={pending} /><Stat label="Accepted" value={state.applications.filter((a) => a.status === 'accepted').length} /><Stat label="Rejected" value={state.applications.filter((a) => a.status === 'rejected').length} /><Stat label="Interviews booked" value={state.calls.filter((c) => c.kind === 'Interview').length} /></div></div>
        <Chips options={['New', 'GD', 'Interview']} value={stage} onChange={setStage} />
        <div className="grid g2">
          {list.map((a) => (
            <Tilt key={a.id} max={3} glare={false}>
              <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}><Avatar name={a.name} size="lg" />
                <div className="grow"><div className="row-between"><h3 style={{ fontSize: 22 }}>{a.name}</h3><Tag tone={a.status === 'accepted' ? 'green' : a.status === 'rejected' ? 'orange' : 'yellow'}>{a.status === 'pending' ? a.stage : a.status}</Tag></div>
                  <p className="dim small">{a.college}, {a.city} · {a.year} year · score {a.score}</p><p className="small" style={{ margin: '8px 0 12px' }}>{a.note}</p>
                  <div className="row" style={{ gap: 6 }}>
                    <button className="btn btn-sm" disabled={a.status === 'accepted'} onClick={() => { setApplication(a.id, { status: 'accepted' }); toast(`${a.name} accepted`); }}>Accept</button>
                    <button className="btn btn-sm btn-ghost" disabled={a.status === 'rejected'} onClick={() => { setApplication(a.id, { status: 'rejected' }); toast(`${a.name} rejected. Send a warm no.`); }}>Reject</button>
                    <button className="btn btn-sm btn-soft" onClick={() => setIv(a)}>Interview</button>
                  </div></div></div>
            </Tilt>
          ))}
        </div>
      </div>
      <Modal open={!!iv} onClose={() => setIv(null)} title={`Interview ${iv?.name || ''}`}>
        <Form submitLabel="Schedule interview" fields={[{ name: 'when', label: 'Date and time', type: 'datetime-local', required: true }, { name: 'panel', label: 'Panel', placeholder: 'Names on the panel' }, { name: 'link', label: 'Meeting link', placeholder: 'https://' }]} onSubmit={(v) => { addCall({ kind: 'Interview', title: `Interview: ${iv.name}`, when: new Date(v.when).toISOString(), link: v.link, who: iv.college }); setApplication(iv.id, { stage: 'Interview' }); toast('Interview scheduled'); setIv(null); }} />
      </Modal>
    </>
  );
}

export function AdminEvents() {
  const { state, setEventStatus, addEventAssign, toast, flag } = useApp();
  const [tab, setTab] = useState('listings');
  const [view, setView] = useState(null);
  const rows = [...state.listedEvents.filter((e) => e.status === 'Approved'), ...EVENTS].map((e) => ({ ...e, rsvp: (e.going || 0) + (flag(`rsvp:${e.id}`) ? 1 : 0), when: e.when }));
  const listings = state.listedEvents.map((e) => ({ id: e.id, title: e.title, college: e.college, city: e.city, state: e.form?.state, date: e.when, venue: e.where, cap: e.cap, ticketing: e.form?.ticketing, status: e.status, by: e.form?.name, whatsapp: e.form?.whatsapp, kind: e.form?.kind, description: e.text, poster: e.form?.poster, price: e.form?.price }));
  const listCols = [{ key: 'title', label: 'Event' }, { key: 'college', label: 'College' }, { key: 'city', label: 'City' }, { key: 'state', label: 'State' }, { key: 'kind', label: 'Type' }, { key: 'date', label: 'When', render: (r) => fmtFull(r.date) }, { key: 'venue', label: 'Venue' }, { key: 'cap', label: 'Expected' }, { key: 'ticketing', label: 'Tickets' }, { key: 'price', label: 'Price (₹)' }, { key: 'by', label: 'Submitted by' }, { key: 'whatsapp', label: 'WhatsApp' }, { key: 'poster', label: 'Poster link' }, { key: 'description', label: 'Description' }, { key: 'status', label: 'Status', render: (r) => <Tag tone={r.status === 'Approved' ? 'green' : r.status === 'Rejected' ? 'orange' : 'yellow'}>{r.status}</Tag> }];
  const reports = Object.entries(state.reports).map(([id, r]) => { const e = [...EVENTS, ...state.listedEvents].find((x) => x.id === id); return { id, event: e?.title || id, college: e?.college || '', date: e?.when || r.at, attendees: r.attendees, description: r.description, drive: r.drive, by: r.by, filed: r.at }; });
  const cur = state.listedEvents.find((e) => e.id === view);
  return (
    <>
      <PageHead title="Events and RSVPs" sub="Event listings from the in-site form, executed-event reports and RSVP counts. Everything downloads as CSV." art="ok-orange" />
      <div className="stack">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'listings', label: `Event listings (${state.listedEvents.length})` }, { id: 'reports', label: `Executed reports (${reports.length})` }, { id: 'all', label: 'All events and RSVPs' }, { id: 'assign', label: 'Assign event' }]} />
        {tab === 'listings' && (
          listings.length ? (
            <>
              <DataTable rows={listings} csv="event-listings.csv" cols={[...listCols, { key: 'id', label: '', noCsv: true, render: (r) => <button className="btn btn-sm btn-ghost" onClick={() => setView(r.id)}>Review</button> }]} />
            </>
          ) : <Empty title="No colleges have listed events yet" text="Events submitted through the listing form show up here for review." />
        )}
        {tab === 'reports' && (reports.length ? <DataTable rows={reports} csv="executed-events.csv" cols={[{ key: 'event', label: 'Event' }, { key: 'college', label: 'College' }, { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) }, { key: 'attendees', label: 'Attendees' }, { key: 'description', label: 'Description' }, { key: 'drive', label: 'Photos (Drive)', render: (r) => <a className="link" href={r.drive} target="_blank" rel="noreferrer noopener">Open</a> }, { key: 'by', label: 'Filed by' }]} /> : <Empty title="No executed events yet" text="Fellows and Heads of Operations file these after an event." />)}
        {tab === 'all' && <DataTable rows={rows} csv="events-rsvp.csv" cols={[{ key: 'title', label: 'Event' }, { key: 'type', label: 'Type' }, { key: 'city', label: 'City' }, { key: 'when', label: 'When', render: (r) => fmtFull(r.when) }, { key: 'rsvp', label: 'RSVPs', render: (r) => (r.digital ? <span className="dim small">Google Calendar</span> : <span className="num">{r.rsvp} / {r.cap}</span>) }, { key: 'fill', label: 'Fill', noCsv: true, render: (r) => (r.digital ? null : <div style={{ width: 90 }}><Progress value={r.rsvp} max={r.cap} /></div>) }]} />}
        {tab === 'assign' && (
          <div className="split">
            <div className="card"><Form submitLabel="Assign event" fields={[{ name: 'event', label: 'Event to run', type: 'select', options: ['City meetup', 'Student talent hunt round', 'Academy session screening', 'Brand activation', 'Campus visit'], required: true }, { name: 'college', label: 'College', type: 'select', options: [...new Set(PEOPLE.map((p) => p.college))], required: true }, { name: 'date', label: 'Target date', type: 'date', required: true }, { name: 'note', label: 'Note', type: 'textarea' }]} onSubmit={(v, reset) => { addEventAssign(v); toast(`Assigned to ${v.college}`); reset(); }} /></div>
            <div className="card"><h3>Assigned</h3>{state.eventAssign.length ? state.eventAssign.map((a) => <div className="list-row" key={a.id}><div className="grow"><b>{a.event}</b><p className="dim small">{a.college} · {fmtDate(a.date)}</p></div></div>) : <p className="dim">Nothing assigned yet.</p>}</div>
          </div>
        )}
      </div>
      <Modal open={!!cur} onClose={() => setView(null)} title={cur?.title || ''} wide>
        {cur && (
          <div className="stack">
            <div className="stack-sm">
              {Object.entries({ 'Submitted by': cur.form?.name, WhatsApp: cur.form?.whatsapp, College: `${cur.form?.college}, ${cur.form?.city}, ${cur.form?.state}`, Type: cur.form?.kind, When: fmtFull(cur.when), End: cur.form?.end, Venue: cur.where, 'Expected attendees': cur.cap, Tickets: `${cur.form?.ticketing}${cur.form?.price ? `, ₹${cur.form.price}` : ''}`, Poster: cur.form?.poster, About: cur.text }).map(([k, v]) => <div className="row-between" key={k} style={{ alignItems: 'flex-start' }}><span className="dim">{k}</span><b style={{ textAlign: 'right', maxWidth: '70%', overflowWrap: 'anywhere' }}>{v || '-'}</b></div>)}
            </div>
            <div className="row">
              <button className="btn" disabled={cur.status === 'Approved'} onClick={() => { setEventStatus(cur.id, 'Approved'); toast('Approved. The event is live on the app.'); setView(null); }}>Approve and go live</button>
              <button className="btn btn-ghost" disabled={cur.status === 'Rejected'} onClick={() => { setEventStatus(cur.id, 'Rejected'); setView(null); }}>Reject</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export function Leadership() {
  const [role, setRole] = useState('Head of Operations');
  const [q, setQ] = useState('');
  const rows = PEOPLE.filter((p) => ['Head of Operations', 'Head of Content', 'Core team', 'Fellow'].includes(p.role) && (!role || p.role === role) && (!q || `${p.name} ${p.college}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <PageHead title="HoO, HoC and core team" sub="Everyone leading a club, with contact details." art="ok-purple" />
      <div className="stack">
        <div style={{ maxWidth: 420 }}><SearchBox value={q} onChange={setQ} placeholder="Search by name or college" /></div>
        <Chips options={['Fellow', 'Head of Content', 'Head of Operations', 'Core team']} value={role} onChange={setRole} all="All leaders" />
        <div className="grid g3">{rows.slice(0, 30).map((p) => <div className="card" key={p.id}><div className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={p.name} size="lg" /><div><b>{p.name}</b><p className="dim small">{p.role} · {p.college}</p><p className="tiny dim">{p.phone}</p><a className="link tiny" href={`mailto:${p.email}`}>{p.email}</a></div></div></div>)}</div>
        {!rows.length && <Empty title="No one matches" />}
      </div>
    </>
  );
}

export function Calls() {
  const { state, addCall, removeCall, toast } = useApp();
  const teams = [...new Set(PEOPLE.map((p) => p.college))];
  const list = [...state.calls].sort((a, b) => new Date(a.when) - new Date(b.when));
  return (
    <>
      <PageHead title="Team calls" sub="Schedule calls with college teams, Fellows and applicants." art="arrow-green" />
      <div className="split">
        <div className="card"><Form submitLabel="Schedule call" fields={[{ name: 'title', label: 'Call title', required: true, placeholder: 'Mid-year review: BNMIT' }, { name: 'who', label: 'Team', type: 'select', options: teams, required: true }, { name: 'when', label: 'Date and time', type: 'datetime-local', required: true }, { name: 'link', label: 'Meeting link', placeholder: 'https://' }]} onSubmit={(v, reset) => { addCall({ kind: 'Team call', ...v, when: new Date(v.when).toISOString() }); toast('Call scheduled'); reset(); }} /></div>
        <div className="card"><h3>Upcoming</h3>{list.length ? list.map((c) => <div className="list-row" key={c.id}><span className="avatar"><Icon name="CalendarClock" /></span><div className="grow"><b>{c.title}</b><p className="dim small">{fmtFull(c.when)} · {c.who}</p></div><button className="btn btn-icon" style={{ width: 34, height: 34 }} aria-label={`Cancel ${c.title}`} onClick={() => removeCall(c.id)}><Icon name="X" size={16} /></button></div>) : <p className="dim">No calls booked.</p>}</div>
      </div>
    </>
  );
}

export function Health() {
  const { flag, setFlag, toast } = useApp();
  const [who, setWho] = useState(null);
  return (
    <>
      <PageHead title="Fellow health" sub="Small silences become offboardings. Check in warmly within days." art="ok-orange" />
      <div className="stack">
        <div className="callout"><Icon name="HeartPulse" /><p><b>Guiding principle.</b> These are high-intent students who became distracted or demotivated, not disengaged by choice. Every conversation, even an offboarding one, should leave them feeling safe, seen and celebrated.</p></div>
        <div className="grid g2">
          {HEALTH.map((h) => (
            <div className="card" key={h.id}>
              <div className="row-between"><div className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={h.name} /><div><b>{h.name}</b><p className="dim small">{h.college}, {h.city}</p></div></div><Tag tone={h.status === 'MIA' ? 'orange' : h.status === 'Watch' ? '' : 'yellow'}>{h.status}</Tag></div>
              <div className="grid g3" style={{ margin: '14px 0' }}><Stat count={false} label="Days quiet" value={h.quiet} /><Stat count={false} label="Followers" value={h.followers} /><Stat count={false} label="Posts in 30d" value={h.posts30} /></div>
              <div className="row"><button className="btn btn-sm" onClick={() => setWho(h)}>Open check-in script</button>{flag(`health:${h.id}`) && <Tag tone="green"><Icon name="Check" size={13} /> Contacted</Tag>}</div>
            </div>
          ))}
        </div>
      </div>
      <Modal open={!!who} onClose={() => setWho(null)} title={`Check in with ${who?.name.split(' ')[0] || ''}`} wide>
        <div className="stack">
          <div className="callout"><Icon name="Mail" /><div><b>Step 1: text them during the day</b><p className="small">“{MIA_SCRIPT.step1}”</p><button className="btn btn-sm btn-soft" style={{ marginTop: 8 }} onClick={() => { navigator.clipboard?.writeText(MIA_SCRIPT.step1); toast('Copied'); }}><Icon name="Copy" size={14} /> Copy text</button></div></div>
          <div className="grid g2">{MIA_SCRIPT.cases.map((c) => <div className="card" key={c.id}><Tag tone="soft">Case {c.id}</Tag><h4 style={{ margin: '8px 0 4px' }}>{c.title}</h4><p className="dim small">{c.text}</p></div>)}</div>
          <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => { setFlag(`health:${who.id}`, true); setWho(null); toast('Marked as contacted'); }}>Mark as contacted</button>
        </div>
      </Modal>
    </>
  );
}

export function Analytics() {
  const roles = ['Fellow', 'Head of Content', 'Head of Operations', 'Core team', 'Community member'].map((r) => [r, PEOPLE.filter((p) => p.role === r).length]);
  const cities = CITIES.map((c) => [c, PEOPLE.filter((p) => p.city === c).length]);
  return (
    <>
      <PageHead title="Program analytics" sub="Batch history and campus coverage. Launching a page is not the same as keeping it alive." art="arrow-yellow" />
      <div className="stack">
        <SectionTitle>Three batches so far</SectionTitle>
        <div className="grid g3">
          {ABOUT_NUMBERS.map((b) => (
            <div className="card" key={b.batch}><h3 style={{ fontSize: 26 }}>Batch {b.batch}</h3>
              <div className="stack-sm" style={{ marginTop: 12 }}>
                {[['Fellows', b.fellows, b.fellows], ['Pages launched', b.launched, b.fellows], ['Still active', b.active, b.launched]].map(([l, v, d]) => <div key={l}><div className="row-between small"><span>{l}</span><b className="num">{v} <span className="dim">({pct(v, d)}%)</span></b></div><Progress value={v} max={d} /></div>)}
              </div>
            </div>
          ))}
        </div>
        <div className="callout"><Icon name="Info" /><div><b>What the numbers tell us</b><p className="small">In every batch at least half of the launched pages went inactive. More Fellows did not mean more active pages per Fellow. Early activation, check-ins and quick replacements matter most.</p></div></div>
        <div className="grid g2">
          <div className="card"><div className="card-head"><h3>People by role</h3></div><Bars data={roles.map((r) => r[1])} labels={roles.map((r) => r[0].split(' ').slice(-1)[0])} /></div>
          <div className="card"><div className="card-head"><h3>People by city</h3></div><Bars data={cities.map((r) => r[1])} labels={cities.map((r) => r[0].slice(0, 4))} /></div>
        </div>
      </div>
    </>
  );
}

const REC = [['March', 'Handovers', 'Outgoing Fellows hand over and nominate successors.'], ['April and May', 'Applications roll out', 'A wide pool so later rounds can be selective.'], ['June and July', 'Group discussions', 'Watch listening, composure and visible leadership.'], ['July and August', 'Interviews', 'Content ability, event experience, vocal skills, team plan.'], ['August', 'Kickoff', 'Selected Fellows get the Playbook and start activation.']];
export function ProgramCal() {
  const now = new Date().getMonth();
  const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return (
    <>
      <PageHead title="Program calendar" sub="The 12-month trajectory in calendar order. The year starts with applications in May and ends with closure in April." art="arrow-outline" />
      <div className="stack">
        <div className="grid g3">
          {PROGRAM_CAL.map((p) => (
            <Tilt key={p.m} max={4} style={MN[now] === p.m ? { boxShadow: '6px 6px 0 var(--accent)' } : null}>
              <div className="lift"><div className="row-between"><h3 style={{ fontSize: 26 }}>{p.m}</h3>{MN[now] === p.m && <Tag tone="yellow">This month</Tag>}</div>
                <ul className="stack-sm" style={{ margin: '10px 0' }}>{p.items.map((i) => <li key={i} className="small"><span className="dot" style={{ marginRight: 8 }} />{i}</li>)}</ul><p className="dim small"><b style={{ color: 'var(--white)' }}>How to run it:</b> {p.how}</p></div>
            </Tilt>
          ))}
        </div>
        <SectionTitle>Fellow recruitment, about five months</SectionTitle>
        <div className="card"><div className="timeline">{REC.map(([m, t, d]) => <div className="tl-item done" key={t}><span className="tl-dot" /><span className="dim small">{m}</span><h4>{t}</h4><p className="dim small">{d}</p></div>)}</div></div>
        <SectionTitle>Rituals</SectionTitle>
        <div className="grid g3">{RITUALS.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p className="dim small">{d}</p></div>)}</div>
      </div>
    </>
  );
}

export function Docs() {
  return (
    <>
      <PageHead title="Important docs" sub="Keep these six open while running the program." art="shapes-orange" />
      <div className="grid g3">{DOCS.map((d) => <Tilt key={d.t} max={4}><div className="lift stack-sm"><h3>{d.t}</h3><p className="dim small">{d.d}</p><ExtLink href={d.url}>Open link <Icon name="ExternalLink" size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /></ExtLink></div></Tilt>)}</div>
    </>
  );
}
