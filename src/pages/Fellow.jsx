import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { Avatar, CheckItem, Chips, ExtLink, Form, Modal, PageHead, Progress, SectionTitle, Stat, Sticker, Tabs, Tag, Tilt } from '../components/ui';
import { CampusTag, PdfViewer } from '../components/extra';
import { EventCard } from './Events';
import { useApp, allEvents } from '../store/AppState';
import { AWARDS, AWARD_STEPS, DRILLS, NOTION_HUB } from '../data/content';
import { CLUB_AWARD_FORM, CRED_FORM, SUMMIT_FORM } from '../data/forms';
import { EVENTS } from '../data/mock';
import { fmtDate, fmtFull, relDay } from '../lib/utils';
import playbookPdf from '../assets/playbook.pdf?url';
import { ART } from '../lib/assets';

/* ------------------------------ Playbook (Fellow only) ------------------------------ */
export function Playbook() {
  return (
    <>
      <PageHead title="Playbook" sub="The Fellowship handbook. Read it right here: who you are, what you run and how the year unfolds." art="trophy-yellow" />
      <PdfViewer src={playbookPdf} title="Under25 Campus Fellowship 2026-27 Playbook" />
    </>
  );
}

// Notion blocks framing of normal page URLs, but its embed URL (/ebd/<page id>) is meant to be framed.
const embedUrl = (u) => u.replace(/notion\.site\/.*-([0-9a-f]{32})$/, 'notion.site/ebd/$1');

/* ------------------------------ Drills (Fellow only, embedded) ------------------------------ */
export function Drills() {
  const { flag, toggle } = useApp();
  const [cat, setCat] = useState('');
  const [open, setOpen] = useState(DRILLS[0].id);
  const list = DRILLS.filter((d) => !cat || d.cat === cat);
  const cur = DRILLS.find((d) => d.id === open) || DRILLS[0];
  const done = DRILLS.filter((d) => flag(`drill:${d.id}`)).length;
  return (
    <>
      <PageHead title="Drills" sub="Structured resource packages. Learn leadership drill by drill. Each one opens right here." art="ok-yellow" />
      <div className="stack">
        <div className="card"><div className="row-between"><div><h3>{done} of {DRILLS.length} drills done</h3><p className="dim small">Mark one done after you have actually tried it.</p></div><ExtLink className="btn btn-sm btn-ghost" href={NOTION_HUB}>Open the full hub</ExtLink></div><div style={{ marginTop: 12 }}><Progress value={done} max={DRILLS.length} /></div></div>
        <div className="drills">
          <div className="stack-sm">
            <Chips options={[...new Set(DRILLS.map((d) => d.cat))]} value={cat} onChange={setCat} />
            {list.map((d) => (
              <button key={d.id} className="card card-click" style={open === d.id ? { borderColor: 'var(--accent-text)' } : undefined} onClick={() => setOpen(d.id)} aria-pressed={open === d.id}>
                <div className="row-between"><Tag tone="soft">{d.cat}</Tag>{flag(`drill:${d.id}`) && <Tag tone="green"><Icon name="Check" size={12} /> Done</Tag>}</div>
                <h4 style={{ margin: '8px 0 2px', fontSize: 16 }}>{d.title}</h4>
                <p className="dim tiny">{d.text}</p>
              </button>
            ))}
          </div>
          <div className="stack-sm">
            <div className="row-between"><h3 style={{ fontSize: 22 }}>{cur.title}</h3>
              <div className="row" style={{ gap: 8 }}>
                <button className={`btn btn-sm ${flag(`drill:${cur.id}`) ? 'btn-soft' : ''}`} onClick={() => toggle(`drill:${cur.id}`)} aria-pressed={flag(`drill:${cur.id}`)}>{flag(`drill:${cur.id}`) ? 'Done. Undo' : 'Mark done'}</button>
                <ExtLink className="btn btn-sm btn-ghost" href={cur.url}>Open in a new tab</ExtLink>
              </div>
            </div>
            <iframe key={cur.id} title={cur.title} src={embedUrl(cur.url)} loading="lazy" style={{ width: '100%', height: '74vh', border: 0, borderRadius: 16, background: 'var(--white)' }} />
            <p className="tiny dim">If the page does not load here, use “Open in a new tab”.</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ Campus Awards (Fellow only) ------------------------------ */
export function Awards() {
  const { submit, user } = useApp();
  const [open, setOpen] = useState(2);
  const [nom, setNom] = useState(false);
  const march = new Date().getMonth() === 2;
  return (
    <>
      <PageHead title="Campus Awards" sub="You nominate your Under25 club, not a person. The whole year comes full circle here: 6 categories, 25 awards." art="trophy-orange" />
      <div className="stack">
        <div className={`callout ${march ? '' : 'warn'}`}>
          <Icon name={march ? 'PartyPopper' : 'Lock'} />
          <div className="grow"><b>{march ? 'Nominations are open.' : 'Nominations open in March.'}</b><p className="small">{march ? 'Nominate your club with proof of what it did this year.' : 'Until then, keep proof as you go: reports, screenshots and insights. Awards need records.'}</p></div>
          <button className="btn" disabled={!march} onClick={() => setNom(true)}>Nominate your club</button>
        </div>
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
            <div className="stack-sm">{['Event reports filed', 'Screenshots of page insights', 'Signed Campus Agreement approved', 'Full-session tenure in role', 'Attendance and photos saved'].map((p, i) => <CheckItem key={p} id={`proof:${i}`} title={p} />)}</div></div>
        </div>
      </div>
      <Modal open={nom} onClose={() => setNom(false)} title="Nominate your club">
        <Form submitLabel="Submit nomination" initial={{ club: `Under25 ${user.college}` }} fields={CLUB_AWARD_FORM} onSubmit={(v) => { submit('club-award-nomination', { college: user.college, ...v }, 'Your club has been nominated.'); setNom(false); }} />
      </Modal>
    </>
  );
}

/* ------------------------------ Summit at Campus (slot request form) ------------------------------ */
export function Summit() {
  const { user, submit, state } = useApp();
  const followers = 1180;
  const members = 112;
  const ok = followers >= 1000 && members >= 100;
  const [open, setOpen] = useState(false);
  const req = state.submissions.find((s) => s.type === 'summit-request' && s.userId === user.id);
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
        {req ? (
          <div className="card"><div className="row-between"><div><h3>Slot request sent</h3><p className="dim small">Ideal date {fmtDate(req.data.date)} · {req.data.attendees} attendees · {req.data.setting.toLowerCase()} · {req.data.ticketing.toLowerCase()}</p></div><Tag tone="yellow">Under review</Tag></div></div>
        ) : (
          <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={!ok} onClick={() => setOpen(true)}>Request Summit slot</button>
        )}
        <SectionTitle>How to get there</SectionTitle>
        <div className="grid g3">{[['Run a posting rhythm', 'Three solid posts a week beat seven rushed ones.'], ['Fill the room', 'Every on-ground event is a chance to add 10 members.'], ['Use city meetups', 'Meet members from other colleges and bring them back.']].map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p className="dim small">{d}</p></div>)}</div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Request a Summit slot" wide>
        <div className="stack">
          <Form
            submitLabel="Send request"
            fields={SUMMIT_FORM}
            onSubmit={(v) => {
              submit('summit-request', { college: user.college, requestedBy: user.name, ...v }, 'Summit slot requested. Under25 will review it.');
              setOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
}

/* ------------------------------ College status (top of My campus) ------------------------------ */
export function CollegeStatus() {
  const { user, state, instagramFor } = useApp();
  const ig = instagramFor(user.college);
  const open = (u) => window.open(u, '_blank', 'noopener');
  const now = new Date();
  const mine = [...state.listedEvents.filter((e) => e.status === 'Approved'), ...EVENTS].filter((e) => e.college === user.college && e.type === 'On-ground');
  const upcoming = mine.filter((e) => new Date(e.when) >= now).sort((a, b) => new Date(a.when) - new Date(b.when));
  const recent = Object.entries(state.reports).map(([id, r]) => ({ id, r, e: [...EVENTS, ...state.listedEvents].find((x) => x.id === id) })).filter((x) => x.e && x.e.college === user.college);
  const happening = [
    ...upcoming.slice(0, 2).map((e) => ({ k: e.id, t: e.title, d: `${fmtDate(e.when, { weekday: 'short', day: 'numeric', month: 'short' })} · ${e.where}` })),
    ...recent.slice(0, 2).map((x) => ({ k: `r-${x.id}`, t: `${x.e.title} wrapped`, d: `${x.r.attendees} people came` })),
    { k: 'club', t: 'Club page is posting', d: 'Followers up 120 this month' },
  ].slice(0, 4);
  return (
    <>
      <PageHead title="College status" sub={`Where ${user.college} stands right now, and what to do next.`} art="shapes-green" />
      <div className="stack">
        <div className="card">
          <div className="row" style={{ marginBottom: 14 }}><h3 style={{ fontSize: 26 }}>{user.college}</h3><CampusTag college={user.college} small={false} /></div>
          <div className="grid g4"><Stat label="Club page" value="Active" count={false} /><Stat label="Followers" value={1180} /><Stat label="Community members" value={112} /><Stat label="Core team" value={64} /></div>
        </div>
        <div className="grid g2">
          <div className="card"><h3>Health check</h3>{[['Posting rhythm', 'On track', 'green'], ['Management buy-in', 'Agreement pending', 'orange'], ['Team size', '64 of 100', 'orange'], ['Summit eligibility', 'Eligible', 'green']].map(([a, b, t]) => <div className="list-row" key={a}><b className="grow">{a}</b><Tag tone={t}>{b}</Tag></div>)}</div>
          <div className="card"><h3>Next best steps</h3>{['Get the Campus Agreement signed by management', 'Recruit the open Technical Lead and Brand Lead', 'Post the team launch carousel', 'File the report for your last event'].map((s) => <div className="list-row" key={s}><Icon name="ArrowRight" style={{ color: 'var(--accent-text)' }} /><span>{s}</span></div>)}</div>
        </div>

        <SectionTitle>Highlights</SectionTitle>
        <div className="grid g3">
          <Tilt className="solid-yellow" onClick={() => open(ig)} max={5}>
            <div className="lift">
              <span className="tag tag-ink"><Icon name="Instagram" size={12} /> What is happening on campus</span>
              <div className="stack-sm" style={{ marginTop: 14 }}>
                {happening.map((h) => <div key={h.k} className="row" style={{ gap: 10, flexWrap: 'nowrap' }}><span className="dot orange" style={{ flex: 'none' }} /><span><b>{h.t}</b><span className="tiny" style={{ display: 'block', opacity: 0.75 }}>{h.d}</span></span></div>)}
              </div>
              <span className="spot-cta" style={{ marginTop: 16 }}>See it on Instagram <Icon name="ArrowUpRight" size={15} /></span>
            </div>
          </Tilt>
          <Tilt className="solid-purple" onClick={() => open(recent[0]?.r.instagram || ig)} max={5}>
            <div className="lift">
              <span className="tag tag-ink"><Icon name="Sparkles" size={12} /> Highlights</span>
              <div className="hl-thumbs">
                {(recent.length ? recent : [null, null, null]).slice(0, 3).map((x, i) => (
                  x?.r.cover ? <img key={i} className="hl-img" src={x.r.cover} alt="" /> : <span key={i} className={`hl-img hl-${i}`}><img src={ART[['trophy-yellow', 'ok-orange', 'shapes-green'][i]]} alt="" /></span>
                ))}
              </div>
              <p className="small" style={{ marginTop: 10, opacity: 0.88 }}>{recent.length ? `${recent[0].e.title}: ${recent[0].r.attendees} people came.` : 'Recent event pictures show up here after an event report.'}</p>
              <span className="spot-cta" style={{ marginTop: 14 }}>Open the post <Icon name="ArrowUpRight" size={15} /></span>
            </div>
          </Tilt>
          <Tilt className="solid-orange" onClick={() => open(ig)} max={5}>
            <div className="lift">
              <span className="tag tag-ink"><Icon name="CalendarDays" size={12} /> Upcoming event</span>
              {upcoming[0] ? (
                <>
                  <h3 style={{ fontSize: 28, margin: '14px 0 6px' }}>{upcoming[0].title}</h3>
                  <p className="small" style={{ opacity: 0.85 }}>{fmtFull(upcoming[0].when)} · {upcoming[0].where}</p>
                  <p className="small" style={{ marginTop: 8, opacity: 0.85 }}>{upcoming[0].text}</p>
                </>
              ) : <p style={{ marginTop: 14 }}>Nothing is listed yet. List an event and it shows up here.</p>}
              <span className="spot-cta" style={{ marginTop: 16 }}>Follow on Instagram <Icon name="ArrowUpRight" size={15} /></span>
            </div>
          </Tilt>
        </div>
        <p className="tiny dim">Every block opens your campus’s Instagram page.</p>
      </div>
    </>
  );
}

/* ------------------------------ Club recruitment ------------------------------ */
const CANDS = [
  { id: 'r1', name: 'Tanvi Kulkarni', role: 'Events Lead', stage: 'Interview', email: 'tanvi.k@example.com', when: null },
  { id: 'r2', name: 'Aman Verma', role: 'Technical Lead', stage: 'Applied', email: 'aman.v@example.com' },
  { id: 'r3', name: 'Lakshmi Pillai', role: 'Brand Lead', stage: 'Interview', email: 'lakshmi.p@example.com', when: null },
  { id: 'r4', name: 'Manav Bose', role: 'Technical Lead', stage: 'Applied', email: 'manav.b@example.com' },
  { id: 'r5', name: 'Pooja Naidu', role: 'Design Lead', stage: 'Interview', email: 'pooja.n@example.com', when: null },
  { id: 'r6', name: 'Sahil Desai', role: 'Media Lead', stage: 'Joined', email: 'sahil.d@example.com' },
];
const STAGES = ['Applied', 'Interview', 'Joined'];
export function Recruitment() {
  const { val, setFlag, submit, sendMail, user, toast } = useApp();
  const [pub, setPub] = useState(false);
  const [iv, setIv] = useState(null);
  const stage = (c) => val(`rec:${c.id}`) || c.stage;
  const when = (c) => val(`recdate:${c.id}`) || c.when;
  return (
    <>
      <PageHead title="Club recruitment" sub="Publish roles with clear job descriptions, interview every lead and finalise the team by the deadline." art="ok-purple" right={<button className="btn" onClick={() => setPub(true)}>Publish a role</button>} />
      <div className="grid g3">
        {STAGES.map((s) => (
          <div className="card" key={s} style={{ background: 'var(--surface)' }}>
            <div className="row-between" style={{ marginBottom: 12 }}><h3>{s}</h3><Tag>{CANDS.filter((c) => stage(c) === s).length}</Tag></div>
            <div className="stack-sm">
              {CANDS.filter((c) => stage(c) === s).map((c) => (
                <div className="card" key={c.id} style={{ padding: 12, background: 'var(--surface-2)' }}>
                  <div className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={c.name} size="sm" /><div><b style={{ fontSize: 14 }}>{c.name}</b><p className="tiny dim">{c.role}</p></div></div>
                  {s === 'Interview' && when(c) && <p className="tiny" style={{ marginTop: 8, color: 'var(--accent-text)', fontWeight: 700 }}><Icon name="CalendarClock" size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {fmtFull(when(c))}</p>}
                  {s === 'Applied' && <button className="btn btn-sm btn-soft" style={{ marginTop: 10 }} onClick={() => setIv(c)}>Move to interview</button>}
                  {s === 'Interview' && (
                    <div className="row" style={{ marginTop: 10, gap: 6 }}>
                      <button className="btn btn-sm btn-soft" onClick={() => { setFlag(`rec:${c.id}`, 'Joined'); toast(`${c.name} joined the team`); }}>Move to joined</button>
                      <button className="btn btn-sm btn-ghost" onClick={() => setIv(c)}>Reschedule</button>
                    </div>
                  )}
                </div>
              ))}
              {!CANDS.filter((c) => stage(c) === s).length && <p className="tiny dim">Nobody here.</p>}
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!iv} onClose={() => setIv(null)} title={`Interview ${iv?.name || ''}`}>
        {iv && (
          <Form
            submitLabel="Schedule and notify"
            fields={[{ name: 'when', label: 'Interview date and time', type: 'datetime-local', required: true }, { name: 'link', label: 'Meeting link or room', placeholder: 'https://meet.google.com/… or Seminar Hall' }]}
            onSubmit={(v) => {
              const iso = new Date(v.when).toISOString();
              setFlag(`rec:${iv.id}`, 'Interview');
              setFlag(`recdate:${iv.id}`, iso);
              sendMail(iv.email, `Your Under25 interview for ${iv.role}`, `Hi ${iv.name.split(' ')[0]},\n\nYour interview for ${iv.role} at ${user.college} is scheduled for ${fmtFull(iso)}.\n${v.link ? `Where: ${v.link}\n` : ''}\nSee you there,\n${user.name}, Fellow`);
              toast(`Interview set for ${fmtFull(iso)}. ${iv.name.split(' ')[0]} was emailed.`);
              setIv(null);
            }}
          />
        )}
      </Modal>
      <Modal open={pub} onClose={() => setPub(false)} title="Publish a role">
        <Form submitLabel="Publish" fields={[{ name: 'role', label: 'Role', type: 'select', required: true, options: ['Design Lead', 'Content Lead', 'Media Lead', 'Technical Lead', 'Events Lead', 'Culture Lead', 'Marketing Lead', 'Brand Lead', 'Finance Lead'] }, { name: 'jd', label: 'What will they do?', type: 'textarea', required: true }, { name: 'deadline', label: 'Apply by', type: 'date', required: true }]} onSubmit={(v) => { submit('role-posting', v, `${v.role} is open for applications.`); setPub(false); }} />
      </Modal>
    </>
  );
}

/* ------------------------------ Club page login (Fellow form, one of the first tasks) ------------------------------ */
export function CredForm() {
  const { user, state, saveCredential, toast } = useApp();
  const mine = state.credentials.find((c) => c.userId === user.id);
  return (
    <>
      <PageHead title="Club page login" sub="One of your first tasks. Share your club page ID and password so Under25 can support the page and hand it over cleanly." art="ok-orange" />
      <div className="split">
        <div className="card">
          <Form
            submitLabel={mine ? 'Update login' : 'Submit login'}
            initial={mine ? { handle: mine.handle, platform: mine.platform, login: mine.login } : {}}
            fields={CRED_FORM}
            onSubmit={(v) => { saveCredential({ userId: user.id, college: user.college, fellow: user.name, ...v }); toast('Saved. Only the Under25 admin team can see this.'); }}
          />
        </div>
        <div className="stack">
          <div className={`callout ${mine ? '' : 'warn'}`}><Icon name={mine ? 'CircleCheck' : 'Lock'} /><div><b>{mine ? `Submitted ${relDay(mine.at).toLowerCase()}` : 'Not submitted yet'}</b><p className="small">{mine ? `Page ${mine.handle}. Your task is complete.` : 'This task stays on your list until you submit.'}</p></div></div>
          <div className="callout"><Icon name="ShieldCheck" /><p className="small"><b>Private.</b> This form feeds the credentials sheet in the Under25 admin database. No other role can open it, and it is not shown back to you.</p></div>
          <div className="callout warn"><Icon name="TriangleAlert" /><p className="small"><b>Demo only. Do not enter a real password.</b> This prototype keeps data in your browser, unencrypted. A live version needs a secure backend.</p></div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ Campus Agreement + Campus Partner ------------------------------ */
export function CampusAgreement() {
  const { user, state, submitAgreement, toast, isPartner } = useApp();
  const mine = state.agreements.find((a) => a.college === user.college);
  const partner = isPartner(user.college);
  const [link, setLink] = useState('');
  const [err, setErr] = useState('');
  const step = partner ? 3 : mine?.status === 'pending' ? 2 : 1;
  const upload = () => {
    if (!/^https?:\/\/\S+\.\S+/.test(link.trim())) { setErr('Paste the Drive link to the signed agreement (it starts with https://).'); return; }
    submitAgreement({ college: user.college, by: user.name, link: link.trim() });
    toast('Sent. Under25 will review your Campus Agreement.');
    setLink(''); setErr('');
  };
  return (
    <>
      <PageHead title="Campus Agreement" sub="The legal agreement your college management signs to officiate the Under25 club on campus. Once Under25 approves it, your college becomes a Campus Partner." art="shapes-orange" />
      <div className="stack">
        <div className="card">
          <div className="timeline">
            {[['Get it signed', 'Management signs the Campus Agreement.'], ['Share the signed copy', 'Put the PDF or a clear photo in Drive and paste the link.'], ['Under25 approves', 'Your college gets the Campus Partner title.']].map(([t, d], i) => (
              <div key={t} className={`tl-item ${i + 1 < step ? 'done' : i + 1 === step ? 'now' : ''}`}><span className="tl-dot">{i + 1 < step && <Icon name="Check" size={12} strokeWidth={3.5} />}</span><b>{t}</b><p className="dim small">{d}</p></div>
            ))}
          </div>
        </div>
        {partner ? (
          <div className="callout"><Icon name="BadgeCheck" /><div className="grow"><b>{user.college} is a Campus Partner.</b><p className="small">The tag now shows next to your college name for everyone. Your next steps are unlocked.</p></div><Link className="btn" to="/partnernext">See next steps</Link></div>
        ) : mine?.status === 'pending' ? (
          <div className="callout"><Icon name="Clock" /><div><b>Waiting for approval.</b><p className="small">Link shared {relDay(mine.at).toLowerCase()}. Under25 will review it.</p></div></div>
        ) : (
          <div className="card stack">
            {mine?.status === 'rejected' && <div className="callout warn"><Icon name="TriangleAlert" /><p className="small"><b>The last copy was not approved.</b> Share a clearer signed copy.</p></div>}
            <div className="field"><label htmlFor="ag">Drive link to the signed Campus Agreement</label><input id="ag" className="input" type="url" placeholder="https://drive.google.com/…" value={link} onChange={(e) => { setLink(e.target.value); setErr(''); }} />{err && <span className="err" role="alert">{err}</span>}</div>
            <div><button className="btn" onClick={upload}>Send for approval</button></div>
          </div>
        )}
      </div>
    </>
  );
}

export function PartnerNext() {
  const { user } = useApp();
  return (
    <>
      <PageHead title="Campus Partner next steps" sub={`What ${user.college} does next as an Under25 Campus Partner.`} art="trophy-yellow" />
      <div className="stack">
        <div className="callout"><Icon name="BadgeCheck" /><p><b>You are a Campus Partner.</b> Under25 will publish your campus’s next steps here.</p></div>
        <div className="grid g3">{[1, 2, 3].map((n) => <div className="card" key={n} style={{ borderStyle: 'dashed' }}><Tag>Coming soon</Tag><h3 style={{ margin: '10px 0 4px' }}>Next step {n}</h3><p className="dim small">Content to be announced.</p></div>)}</div>
      </div>
    </>
  );
}
