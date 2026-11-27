import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { Avatar, DataTable, Empty, Form, Modal, PageHead, SectionTitle, Stat, Tabs, Tag } from '../components/ui';
import { CampusTag } from '../components/extra';
import { APPROVER_TEXT, canApprove, useApp } from '../store/AppState';
import { download, fmtDate, fmtFull, relDay, toCSV } from '../lib/utils';
import { EVENTS, PARTNERS } from '../data/mock';

const ROLE_LABEL = { fellow: 'Fellow', hoc: 'Head of Content', hoo: 'Head of Operations', core: 'Core team member', community: 'Community member' };
const ROLE_TONE = { fellow: 'yellow', hoc: 'purple', hoo: 'orange', core: 'green', community: '' };

/* ---------------- Sign-up approvals (Fellow, HoC, HoO and admin) ---------------- */
export function Approvals() {
  const { state, user, approveSignup, rejectSignup } = useApp();
  const mine = state.signups.filter((s) => canApprove(user, s));
  const recent = state.signups.filter((s) => s.status !== 'pending' && s.role !== 'community' && (user.role === 'admin' || s.college.toLowerCase() === user.college.toLowerCase())).slice(0, 6);
  const rule = {
    admin: 'You can approve anyone. Fellow requests are approved by the Under25 admin team.',
    fellow: 'You approve Heads of Content, Heads of Operations and core team members from your college.',
    hoc: 'You approve core team members who are joining the Content team.',
    hoo: 'You approve core team members who are joining the Operations team.',
  }[user.role];
  return (
    <>
      <PageHead title="Sign-up approvals" sub="People who asked to join with a lead role. When you approve, their user ID and password are emailed to them." art="ok-yellow" />
      <div className="stack">
        <div className="callout"><Icon name="UserCheck" /><div><b>{rule}</b><p className="small">Community members do not need approval. They get their ID and password as soon as they sign up.</p></div></div>
        <div className="grid g2">
          {mine.map((s) => (
            <div className="card" key={s.id}>
              <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                <Avatar src={s.photo} name={s.name} size="lg" />
                <div className="grow">
                  <div className="row-between"><h3 style={{ fontSize: 22 }}>{s.name}</h3><Tag tone={ROLE_TONE[s.role]}>{ROLE_LABEL[s.role]}{s.team ? ` · ${s.team}` : ''}</Tag></div>
                  <p className="dim small row" style={{ gap: 6 }}>{s.college} <CampusTag college={s.college} /></p>
                  <p className="tiny dim" style={{ margin: '6px 0' }}>{s.email} · {s.phone} · asked {relDay(s.at).toLowerCase()}</p>
                  <p className="tiny dim">{APPROVER_TEXT[s.role]}</p>
                  <div className="row" style={{ marginTop: 12, gap: 8 }}>
                    <button className="btn btn-sm" onClick={() => approveSignup(s.id, user.name)}>Approve and email login</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => rejectSignup(s.id, user.name)}>Decline</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!mine.length && <Empty title="Nothing waiting for you" text="New requests from your college show up here." />}
        {recent.length > 0 && (
          <>
            <SectionTitle>Recently decided</SectionTitle>
            <div className="card">{recent.map((s) => <div className="list-row" key={s.id}><Avatar src={s.photo} name={s.name} size="sm" /><div className="grow"><b>{s.name}</b><p className="dim small">{ROLE_LABEL[s.role]} · {s.college}{s.by ? ` · by ${s.by}` : ''}</p></div><Tag tone={s.status === 'approved' ? 'green' : 'orange'}>{s.status}</Tag></div>)}</div>
          </>
        )}
      </div>
    </>
  );
}

/* ---------------- Every form filled on the site, with CSV ---------------- */
const LABELS = {
  'event-listing': 'Event listings', 'event-report': 'Executed event reports', 'summit-request': 'Summit slot requests', insight: 'Insight forms', 'successor-nomination': 'Successor nominations',
  'club-award-nomination': 'Campus Award nominations', 'signup-request': 'Sign-up requests', suggestion: 'Suggestions', 'core-application': 'Core team applications', perform: 'Perform requests',
  help: 'Help requests', 'role-posting': 'Published roles', 'event-proposal': 'Event proposals', photos: 'Photo uploads', challenge: 'Challenge proofs', qna: 'Questions', 'alumni-ask': 'Alumni questions', draft: 'Draft Room posts', shoutout: 'Shoutouts', mission: 'Branded missions',
};
const flat = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? `${v.length} item(s) attached` : typeof v === 'string' && v.startsWith('data:') ? '[file attached]' : v ?? '']));

export function useDatasets() {
  const { state, everyone } = useApp();
  return useMemo(() => {
    const who = (id) => everyone.find((u) => u.id === id)?.name || id || '';
    const sets = {
      'event-listing': state.listedEvents.map((e) => ({ id: e.id, at: e.at, by: who(e.ownerId), status: e.status, ...flat(e.form || {}) })),
      'signup-request': state.signups.map((s) => ({ id: s.id, at: s.at, by: s.name, status: s.status, role: ROLE_LABEL[s.role], team: s.team, college: s.college, email: s.email, phone: s.phone, approvedBy: s.by || '' })),
    };
    state.submissions.forEach((s) => { (sets[s.type] ||= []).push({ id: s.id, at: s.at, by: who(s.userId), ...flat(s.data) }); });
    return sets;
  }, [state, everyone]);
}

export function SubmissionsAdmin() {
  const sets = useDatasets();
  const types = Object.keys(sets).filter((k) => sets[k].length || ['event-listing', 'summit-request', 'insight'].includes(k));
  const [type, setType] = useState('event-listing');
  const [view, setView] = useState(null);
  const { state } = useApp();
  const rows = sets[type] || [];
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))].filter((k) => k !== 'id');
  const cols = keys.map((k) => ({ key: k, label: k === 'at' ? 'Submitted' : k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()), render: k === 'at' ? (r) => fmtFull(r.at) : undefined }));
  const sub = state.submissions.find((s) => s.id === view?.id);
  return (
    <>
      <PageHead title="Form submissions" sub="Everything filled in on this site lands here. Download any form as a CSV that opens in Excel." art="shapes-yellow" />
      <div className="stack">
        <div className="row-between">
          <select className="select" style={{ maxWidth: 340 }} value={type} onChange={(e) => setType(e.target.value)} aria-label="Form">
            {types.map((t) => <option key={t} value={t}>{LABELS[t] || t} ({sets[t]?.length || 0})</option>)}
          </select>
          <button className="btn btn-ghost" disabled={!rows.length} onClick={() => download(`${type}.csv`, toCSV(rows, cols))}><Icon name="Download" size={16} /> Download CSV</button>
        </div>
        {rows.length ? <DataTable key={type} rows={rows} cols={[...cols, { key: 'id', label: '', noCsv: true, render: (r) => <button className="btn btn-sm btn-ghost" onClick={() => setView(r)}>Open</button> }]} csv={`${type}.csv`} pageSize={10} /> : <Empty title="No submissions yet" text="Forms of this type will show up here as soon as someone files one." />}
      </div>
      <Modal open={!!view} onClose={() => setView(null)} title={LABELS[type] || 'Submission'} wide>
        {view && (
          <div className="stack-sm">
            {Object.entries(view).filter(([k]) => k !== 'id').map(([k, v]) => <div className="row-between" key={k} style={{ alignItems: 'flex-start' }}><span className="dim">{k}</span><b style={{ textAlign: 'right', maxWidth: '70%', overflowWrap: 'anywhere' }}>{k === 'at' ? fmtFull(v) : String(v)}</b></div>)}
            {sub?.data?.photos && <div className="row" style={{ gap: 10, marginTop: 8 }}>{sub.data.photos.map((p, i) => <img key={i} src={p} alt={`Attachment ${i + 1}`} style={{ width: 150, height: 110, objectFit: 'cover', borderRadius: 12 }} />)}</div>}
          </div>
        )}
      </Modal>
    </>
  );
}

/* ---------------- Credentials log (admin only) ---------------- */
export function Credentials() {
  const { state } = useApp();
  const [shown, setShown] = useState({});
  const rows = state.credentials.map((c) => ({ ...c, updated: fmtDate(c.at) }));
  const cols = [{ key: 'college', label: 'College' }, { key: 'fellow', label: 'Fellow' }, { key: 'handle', label: 'Page' }, { key: 'platform', label: 'Platform' }, { key: 'login', label: 'Login ID' },
    { key: 'pw', label: 'Password', render: (r) => <span className="row" style={{ gap: 8 }}><code>{shown[r.id] ? r.pw : '••••••••'}</code><button className="btn btn-icon" style={{ width: 30, height: 30 }} aria-label={shown[r.id] ? 'Hide password' : 'Show password'} onClick={() => setShown((s) => ({ ...s, [r.id]: !s[r.id] }))}><Icon name="Eye" size={14} /></button></span> },
    { key: 'updated', label: 'Updated' }];
  return (
    <>
      <PageHead title="Credentials log" sub="Club page logins submitted by Fellows through the site. Only the Under25 admin team can open this." art="ok-orange" />
      <div className="stack">
        <div className="callout warn"><Icon name="TriangleAlert" /><p className="small"><b>Demo storage.</b> These live in this browser, unencrypted. A live version needs a secure backend. The CSV below opens in Excel.</p></div>
        <DataTable rows={rows} cols={cols} csv="credentials-log.csv" />
      </div>
    </>
  );
}

/* ---------------- Campus agreements: approve to grant Campus Partner ---------------- */
export function Agreements() {
  const { state, setAgreementStatus, toast } = useApp();
  const partners = [...new Set([...PARTNERS, ...state.agreements.filter((a) => a.status === 'approved').map((a) => a.college)])];
  return (
    <>
      <PageHead title="Campus agreements" sub="Signed agreements uploaded by Fellows. Approve one and the college becomes a Campus Partner, visible to every user." art="shapes-orange" />
      <div className="stack">
        <div className="grid g2">
          {state.agreements.map((a) => (
            <div className="card" key={a.id}>
              <div className="row-between"><h3 style={{ fontSize: 22 }}>{a.college}</h3><Tag tone={a.status === 'approved' ? 'green' : a.status === 'rejected' ? 'orange' : 'yellow'}>{a.status}</Tag></div>
              <p className="dim small">Uploaded by {a.by} · {relDay(a.at).toLowerCase()} · {a.fileName} ({Math.round(a.size / 1024)} KB)</p>
              <div className="row" style={{ marginTop: 12, gap: 8 }}>
                {a.dataUrl && <a className="btn btn-sm btn-ghost" href={a.dataUrl} download={a.fileName}><Icon name="Download" size={15} /> Download</a>}
                <button className="btn btn-sm" disabled={a.status === 'approved'} onClick={() => { setAgreementStatus(a.id, 'approved'); toast(`${a.college} is now a Campus Partner`); }}>Approve</button>
                <button className="btn btn-sm btn-ghost" disabled={a.status === 'rejected'} onClick={() => setAgreementStatus(a.id, 'rejected')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
        {!state.agreements.length && <Empty title="No agreements uploaded yet" />}
        <SectionTitle>Campus Partners</SectionTitle>
        <div className="card"><div className="chips">{partners.map((p) => <span key={p} className="tag tag-yellow" style={{ fontSize: 14, padding: '6px 14px' }}><Icon name="BadgeCheck" size={15} /> {p}</span>)}</div></div>
      </div>
    </>
  );
}

/* ---------------- Spotlight banners ---------------- */
export function SpotlightAdmin() {
  const { state, addSpotlight, removeSpotlight, toast } = useApp();
  const art = { purple: 'trophy-purple', yellow: 'ok-yellow', green: 'arrow-green', orange: 'ok-orange', ink: 'shapes-yellow' };
  return (
    <>
      <PageHead title="Spotlight banners" sub="Banners pinned at the top of everyone’s Home. Event and session banners are added automatically from the events list." art="ok-purple" />
      <div className="split">
        <div className="card">
          <Form
            submitLabel="Pin banner"
            fields={[
              { name: 'kind', label: 'Type', type: 'select', required: true, options: ['MVPs of the month', 'Community standouts', 'Challenge of the month', 'Announcement'] },
              { name: 'title', label: 'Title', required: true },
              { name: 'sub', label: 'One line under the title', required: true },
              { name: 'cta', label: 'Button text', required: true, default: 'See more' },
              { name: 'href', label: 'Link (Instagram post, form or an in-app path like /events)', required: true, placeholder: 'https://instagram.com/p/…' },
              { name: 'tone', label: 'Colour', type: 'select', required: true, options: ['purple', 'yellow', 'green', 'orange', 'ink'], default: 'purple' },
            ]}
            onSubmit={(v, reset) => { addSpotlight({ ...v, art: art[v.tone] }); toast('Banner pinned to Home'); reset(); }}
          />
        </div>
        <div className="card"><h3>Pinned now</h3>
          {state.spotlight.map((b) => <div className="list-row" key={b.id}><span className={`avatar tone-${b.tone === 'ink' ? 'green' : b.tone}`} style={{ color: b.tone === 'purple' || b.tone === 'green' ? 'var(--white)' : 'var(--ink)' }}><Icon name="Sparkles" size={18} /></span><div className="grow"><b>{b.title}</b><p className="dim small">{b.kind}</p></div><button className="btn btn-icon" style={{ width: 34, height: 34 }} aria-label={`Remove ${b.title}`} onClick={() => removeSpotlight(b.id)}><Icon name="X" size={16} /></button></div>)}
          {!state.spotlight.length && <p className="dim">Nothing pinned.</p>}
        </div>
      </div>
    </>
  );
}

/* ---------------- Drive links sheet: every Drive link in one place ---------------- */
export function DriveLinks() {
  const { state, everyone } = useApp();
  const who = (id) => everyone.find((u) => u.id === id)?.name || id || '';
  const rows = useMemo(() => {
    const ev = Object.entries(state.reports).map(([id, r]) => ({ id: 'r-' + id, type: 'Event photos', college: [...EVENTS, ...state.listedEvents].find((e) => e.id === id)?.college || '', context: [...EVENTS, ...state.listedEvents].find((e) => e.id === id)?.title || id, link: r.drive, by: r.by, at: r.at }));
    const sm = state.submissions.filter((s) => s.type === 'summit-request' && s.data.drive).map((s) => ({ id: s.id, type: 'Summit auditorium photos', college: s.data.college, context: 'Summit at Campus slot request', link: s.data.drive, by: who(s.userId), at: s.at }));
    return [...ev, ...sm].sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [state, everyone]);
  const cols = [{ key: 'type', label: 'Type' }, { key: 'college', label: 'College' }, { key: 'context', label: 'Event or request' }, { key: 'link', label: 'Drive link', render: (r) => <a className="link" href={r.link} target="_blank" rel="noreferrer noopener">Open</a> }, { key: 'by', label: 'Shared by' }, { key: 'at', label: 'Date', render: (r) => fmtDate(r.at) }];
  return (
    <>
      <PageHead title="Drive links sheet" sub="Every Drive link shared on the site, in one sheet: event photos from executed-event reports and auditorium photos from Summit requests." art="shapes-green" />
      <div className="stack">
        <div className="callout"><Icon name="Link2" /><p className="small">Photos are not stored on the dashboard. Teams share Drive links instead, plus one small JPG cover photo per event for Home.</p></div>
        <DataTable rows={rows} cols={cols} csv="drive-links.csv" empty="No Drive links yet. They appear when an event is marked executed." />
      </div>
    </>
  );
}
