import { useMemo, useRef, useState } from 'react';
import Icon from '../components/Icon';
import { Avatar, Chips, DataTable, Empty, Form, Modal, PageHead, SectionTitle, Stat, Sticker, Tabs, Tag, Tilt } from '../components/ui';
import { useApp } from '../store/AppState';
import { GOLDEN_RULES, RITUALS } from '../data/content';
import { ALUMNI, EVENTS, PEOPLE, QNA, TEAM_OPENINGS, WORK_WITH_US } from '../data/mock';
import { ROLE_BLURBS } from '../data/content';
import { fmtDate, fmtFull } from '../lib/utils';

export function Agreement() {
  const { flag, setFlag, user } = useApp();
  const agreed = flag(`agree:${user.id}`);
  const signed = useMemo(() => PEOPLE.map((p, i) => ({ ...p, signed: i % 7 !== 3, on: p.joined })), []);
  return (
    <>
      <PageHead title="Community agreement" sub="Seven golden rules we swear by. Under25 is alcohol-free, smoke-free and drug-free. No exceptions, ever." art="shapes-orange" />
      <div className="stack">
        <div className="grid g3">
          {GOLDEN_RULES.map(([t, d], i) => (
            <Tilt key={t} max={5}>
              <div className="lift"><span className="display" style={{ fontSize: 56, color: 'var(--accent-text)' }}>{i + 1}</span><h3 style={{ margin: '6px 0' }}>{t}</h3><p className="dim small">{d}</p></div>
            </Tilt>
          ))}
        </div>
        <div className="callout"><Icon name="Heart" /><p><b>Final reminder.</b> It won’t be the tasks or deadlines people remember. It’ll be this: did you make it better or just louder? Make people feel safe, seen and celebrated.</p></div>
        <div className="card row-between">
          <div><h3>{agreed ? 'You have agreed' : 'Agree to the community agreement'}</h3><p className="dim small">{agreed ? 'Thanks. This is saved on your profile.' : 'Tap to confirm you will follow these seven rules.'}</p></div>
          <button className={`btn ${agreed ? 'btn-soft' : ''}`} onClick={() => setFlag(`agree:${user.id}`, !agreed)}>{agreed ? <><Icon name="Check" size={16} /> Agreed</> : 'I agree'}</button>
        </div>
        <SectionTitle>Rituals that stay constant</SectionTitle>
        <div className="grid g3">{RITUALS.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p className="dim small">{d}</p></div>)}</div>
        {user.role === 'admin' && (
          <>
            <SectionTitle>Who has signed</SectionTitle>
            <div className="grid g4 card"><Stat label="Signed" value={signed.filter((s) => s.signed).length} /><Stat label="Pending" value={signed.filter((s) => !s.signed).length} /></div>
            <DataTable csv="agreements.csv" rows={signed.map((s) => ({ ...s, status: s.signed ? 'Signed' : 'Pending' }))} cols={[{ key: 'name', label: 'Name' }, { key: 'college', label: 'College' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Agreement', render: (r) => <Tag tone={r.signed ? 'green' : 'orange'}>{r.status}</Tag> }, { key: 'on', label: 'Joined' }]} />
          </>
        )}
      </div>
    </>
  );
}

export function Join() {
  const { flag, setFlag, submit, user } = useApp();
  const [role, setRole] = useState(null);
  return (
    <>
      <PageHead title={user.role === 'core' ? 'Step up to a lead role' : 'Join the core team'} sub="Every Fellow builds a team. Pick a lead role you care about and apply. It takes two minutes." art="trophy-yellow" />
      <div className="grid g3">
        {TEAM_OPENINGS.map((r) => {
          const done = flag(`applied:${r}`);
          return (
            <Tilt key={r}>
              <div className="lift stack-sm">
                <div className="row-between"><h3>{r}</h3>{done && <Tag tone="green">Applied</Tag>}</div>
                <p className="dim small">{ROLE_BLURBS[r]}</p>
                <button className={`btn btn-sm ${done ? 'btn-soft' : ''}`} style={{ alignSelf: 'flex-start', marginTop: 8 }} onClick={() => setRole(r)} disabled={done}>{done ? 'Application sent' : 'Apply'}</button>
              </div>
            </Tilt>
          );
        })}
      </div>
      <Modal open={!!role} onClose={() => setRole(null)} title={`Apply: ${role}`}>
        <Form
          submitLabel="Send application"
          fields={[
            { name: 'why', label: 'Why this role?', type: 'textarea', required: true },
            { name: 'exp', label: 'Anything you have done that proves it', type: 'textarea' },
            { name: 'hours', label: 'Hours per week you can give', type: 'select', options: ['2 to 3', '4 to 6', '7 or more'], required: true },
          ]}
          onSubmit={(v) => { submit('core-application', { role, ...v }, `Application sent for ${role}.`); setFlag(`applied:${role}`, true); setRole(null); }}
        />
      </Modal>
    </>
  );
}

export function Involve() {
  const { flag, toggle, submit } = useApp();
  const [tab, setTab] = useState('volunteer');
  const events = EVENTS.filter((e) => !e.leaders && ['On-ground', 'City meetup', 'Talent hunt'].includes(e.type));
  return (
    <>
      <PageHead title="Get involved" sub="Volunteer, perform or work with us. Every shift earns a certificate." art="ok-purple" />
      <div className="stack">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'volunteer', label: 'Volunteer' }, { id: 'perform', label: 'Perform' }, { id: 'work', label: 'Work with us' }]} />
        {tab === 'volunteer' && (
          <div className="card">
            <h3>Pick an event to help at</h3>
            {events.map((e) => (
              <div className="list-row" key={e.id}><div className="grow"><b>{e.title}</b><p className="dim small">{fmtFull(e.when)} · {e.where}</p></div>
                <button className={`btn btn-sm ${flag(`vol:${e.id}`) ? 'btn-soft' : ''}`} aria-pressed={flag(`vol:${e.id}`)} onClick={() => toggle(`vol:${e.id}`)}>{flag(`vol:${e.id}`) ? 'Signed up' : 'Volunteer'}</button></div>
            ))}
          </div>
        )}
        {tab === 'perform' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Tell us what you do</h3>
            <Form
              submitLabel="Submit"
              fields={[
                { name: 'act', label: 'Your act', type: 'select', options: ['Singing', 'Band', 'Dance', 'Stand-up', 'Spoken word', 'Instrumental', 'Other'], required: true },
                { name: 'event', label: 'Event', type: 'select', options: events.map((e) => e.title), required: true },
                { name: 'link', label: 'Link to a clip (optional)', placeholder: 'https://' },
                { name: 'mins', label: 'Minutes you need', type: 'number', default: '5' },
                { name: 'about', label: 'About you', type: 'textarea' },
              ]}
              onSubmit={(v, reset) => { submit('perform', v, 'Thanks! We will reach out about your slot.'); reset(); }}
            />
          </div>
        )}
        {tab === 'work' && (
          <div className="grid g2">
            {WORK_WITH_US.map((w) => (
              <div className="card" key={w.t}><h3>{w.t}</h3><p className="dim small" style={{ margin: '6px 0 14px' }}>{w.d}</p>
                <button className={`btn btn-sm ${flag(`work:${w.t}`) ? 'btn-soft' : ''}`} onClick={() => { toggle(`work:${w.t}`); }}>{flag(`work:${w.t}`) ? 'We’ll be in touch' : 'I’m interested'}</button></div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function Suggestions() {
  const { submit, state, user } = useApp();
  const mine = state.submissions.filter((s) => s.type === 'suggestion' && s.userId === user.id);
  return (
    <>
      <PageHead title="Suggestions" sub="What should we build, run or fix next? Short is fine." art="arrow-yellow" />
      <div className="split">
        <div className="card">
          <Form
            submitLabel="Send suggestion"
            fields={[
              { name: 'area', label: 'Area', type: 'select', options: ['Events', 'Club page', 'Opportunities', 'This dashboard', 'Something else'], required: true },
              { name: 'text', label: 'Your suggestion', type: 'textarea', required: true },
            ]}
            onSubmit={(v, reset) => { submit('suggestion', v, 'Suggestion sent. Thank you!'); reset(); }}
          />
        </div>
        <div className="card"><h3>Your suggestions</h3>{mine.length ? mine.map((s) => <div className="list-row" key={s.id}><div className="grow"><b>{s.data.area}</b><p className="dim small">{s.data.text}</p></div><span className="tiny dim">{fmtDate(s.at)}</span></div>) : <p className="dim">None yet.</p>}</div>
      </div>
    </>
  );
}

const certSvg = (name, title, note) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850"><rect width="1200" height="850" fill="#121a17"/><rect x="30" y="30" width="1140" height="790" fill="none" stroke="#ffd12f" stroke-width="6"/><rect x="60" y="60" width="1080" height="730" fill="none" stroke="#ff5a00" stroke-width="2"/><text x="600" y="190" font-family="Arial Black,Arial" font-size="30" fill="#ffd12f" text-anchor="middle">UNDER25 CAMPUS FELLOWSHIP 2026-27</text><text x="600" y="310" font-family="Arial Black,Arial" font-size="84" fill="#ffffff" text-anchor="middle">CERTIFICATE</text><text x="600" y="380" font-family="Arial" font-size="26" fill="#a0a8a6" text-anchor="middle">is proudly presented to</text><text x="600" y="500" font-family="Arial Black,Arial" font-size="72" fill="#ffd12f" text-anchor="middle">${name.replace(/[<&]/g, '')}</text><text x="600" y="590" font-family="Arial" font-size="30" fill="#ffffff" text-anchor="middle">${title}</text><text x="600" y="640" font-family="Arial" font-size="22" fill="#a0a8a6" text-anchor="middle">${note}</text><text x="600" y="740" font-family="Arial" font-size="22" fill="#ffffff" text-anchor="middle">Safe. Seen. Celebrated.</text></svg>`;
export function Certificates() {
  const { user, toast, flag } = useApp();
  const certs = [
    { id: 'c1', title: 'Community member', note: 'For joining the Under25 community', ok: true },
    { id: 'c2', title: 'Event volunteer', note: 'For volunteering at an Under25 event', ok: ['e3', 'e4', 'e5', 'e8'].some((e) => flag(`vol:${e}`)), need: 'Sign up as a volunteer from Get involved.' },
    { id: 'c3', title: 'City meetup attendee', note: 'For attending a city meetup', ok: flag('rsvp:e5'), need: 'RSVP to the Bengaluru city meetup.' },
    { id: 'c4', title: 'Fellowship tenure', note: 'For completing the Fellowship tenure', ok: false, need: 'Unlocked when you finish your tenure in April.' },
  ];
  const get = (c) => {
    const blob = new Blob([certSvg(user.name, c.title, c.note)], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `under25-certificate-${c.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    toast('Certificate downloaded');
  };
  return (
    <>
      <PageHead title="Certificates" sub="CV points you can show. Earn more by showing up." art="trophy-orange" />
      <div className="grid g2">
        {certs.map((c) => (
          <Tilt key={c.id} className={c.ok ? '' : 'card-flat'}>
            <div className="row lift" style={{ flexWrap: 'nowrap' }}>
              <span className="avatar lg"><Icon name={c.ok ? 'Award' : 'Lock'} size={26} /></span>
              <div className="grow"><h3>{c.title}</h3><p className="dim small">{c.ok ? c.note : c.need}</p></div>
              <button className="btn btn-sm" disabled={!c.ok} onClick={() => get(c)}><Icon name="Download" size={16} /></button>
            </div>
          </Tilt>
        ))}
      </div>
    </>
  );
}

export function Nominate() {
  const { submit, state, user } = useApp();
  const mine = state.submissions.filter((s) => s.type === 'nomination' && s.userId === user.id);
  return (
    <>
      <PageHead title="Nominate someone" sub="Know someone who would be a great Fellow, lead or Fellow of the Week? Tell us why." art="ok-yellow" />
      <div className="split">
        <div className="card">
          <Form
            submitLabel="Send nomination"
            fields={[
              { name: 'name', label: 'Their name', required: true },
              { name: 'college', label: 'College', required: true },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'for', label: 'Nominating for', type: 'select', options: ['Next Fellow from my college', 'Lead role in my club', 'Fellow of the Week', 'Campus Awards'], required: true },
              { name: 'why', label: 'Why them?', type: 'textarea', required: true },
            ]}
            onSubmit={(v, reset) => { submit('nomination', v, `Nominated ${v.name}.`); reset(); }}
          />
        </div>
        <div className="card"><h3>Your nominations</h3>{mine.length ? mine.map((s) => <div className="list-row" key={s.id}><Avatar name={s.data.name} size="sm" /><div className="grow"><b>{s.data.name}</b><p className="dim small">{s.data.for}</p></div></div>) : <p className="dim">None yet.</p>}</div>
      </div>
    </>
  );
}

export function UploadPhotos() {
  const { submit } = useApp();
  const [files, setFiles] = useState([]);
  const [event, setEvent] = useState('');
  const input = useRef(null);
  const add = (list) => setFiles((f) => [...f, ...[...list].filter((x) => x.type.startsWith('image/')).map((x) => ({ name: x.name, url: URL.createObjectURL(x) }))].slice(0, 24));
  return (
    <>
      <PageHead title="Upload photos" sub="Candid beats posed. Share event photos so Under25 can feature your campus." art="shapes-green" />
      <div className="stack">
        <div className="card" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }} style={{ borderStyle: 'dashed', borderWidth: 2, textAlign: 'center', padding: 36 }}>
          <Icon name="Upload" size={34} />
          <h3 style={{ margin: '10px 0 4px' }}>Drop photos here</h3>
          <p className="dim small" style={{ marginBottom: 14 }}>or choose them from your device. Previews stay on your device in this demo.</p>
          <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
          <button className="btn" onClick={() => input.current?.click()}>Choose photos</button>
        </div>
        {files.length > 0 && (
          <div className="card stack">
            <div className="grid g4">{files.map((f, i) => (
              <div key={f.url} style={{ position: 'relative' }}><img src={f.url} alt={f.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 12 }} />
                <button className="btn btn-icon" aria-label={`Remove ${f.name}`} style={{ position: 'absolute', top: 6, right: 6, width: 30, height: 30 }} onClick={() => setFiles((x) => x.filter((_, j) => j !== i))}><Icon name="X" size={14} /></button></div>))}</div>
            <div className="form-grid">
              <div className="field"><label htmlFor="ev">Which event?</label><select id="ev" className="select" value={event} onChange={(e) => setEvent(e.target.value)}><option value="">Choose one</option>{EVENTS.filter((e) => e.type !== 'Session').map((e) => <option key={e.id}>{e.title}</option>)}</select></div>
            </div>
            <div><button className="btn" disabled={!event} onClick={() => { submit('photos', { event, count: files.length }, `${files.length} photo${files.length > 1 ? 's' : ''} sent to Under25.`); setFiles([]); setEvent(''); }}>Send {files.length} photo{files.length > 1 ? 's' : ''}</button></div>
          </div>
        )}
      </div>
    </>
  );
}

export function Insight() {
  const { submit, flag, setFlag } = useApp();
  const done = flag('insight:done');
  return (
    <>
      <PageHead title="Insight form" sub="The yearly insight form, run every March. Honest answers help us fix what is not working." art="arrow-green" />
      {done ? (
        <div className="card"><Sticker name="trophy-yellow" size={90} /><h3 style={{ margin: '10px 0 4px' }}>Thank you, form received</h3><p className="dim">We read every one. Expect a check-in call if you flagged something.</p></div>
      ) : (
        <div className="card">
          <Form
            submitLabel="Submit insight form"
            fields={[
              { name: 'followers', label: 'Club page followers today', type: 'number', required: true },
              { name: 'team', label: 'Active team members', type: 'number', required: true },
              { name: 'events', label: 'Events you ran this year', type: 'number', required: true },
              { name: 'mood', label: 'How supported do you feel?', type: 'select', options: ['Very supported', 'Mostly supported', 'Somewhat', 'Not really'], required: true },
              { name: 'blocker', label: 'Biggest blocker right now', type: 'select', options: ['Management buy-in', 'Team commitment', 'Content ideas', 'Exams and time', 'Money', 'Nothing'], required: true },
              { name: 'win', label: 'Your proudest win', type: 'textarea' },
              { name: 'ask', label: 'What do you need from Under25?', type: 'textarea' },
            ]}
            onSubmit={(v) => { submit('insight', v, 'Insight form submitted.'); setFlag('insight:done', true); }}
          />
        </div>
      )}
    </>
  );
}

export function QnA() {
  const { flag, toggle, submit, state } = useApp();
  const [ask, setAsk] = useState(false);
  const mine = state.submissions.filter((s) => s.type === 'qna');
  return (
    <>
      <PageHead title="QnA" sub="Real questions from Fellows, answered by the Under25 team and seniors." art="ok-orange" right={<button className="btn" onClick={() => setAsk(true)}>Ask a question</button>} />
      <div className="stack">
        {mine.map((s) => <div className="card" key={s.id}><div className="row"><Tag tone="yellow">Waiting for an answer</Tag></div><h3 style={{ margin: '8px 0 0' }}>{s.data.q}</h3></div>)}
        {QNA.map((q) => (
          <div className="card" key={q.id}>
            <div className="row-between" style={{ alignItems: 'flex-start' }}>
              <div style={{ maxWidth: '68ch' }}><h3 style={{ fontSize: 22 }}>{q.q}</h3><p className="tiny dim" style={{ margin: '4px 0 10px' }}>Asked by {q.by}</p><p>{q.a}</p></div>
              <button className={`btn btn-sm ${flag(`qv:${q.id}`) ? 'btn-soft' : 'btn-ghost'}`} aria-pressed={flag(`qv:${q.id}`)} onClick={() => toggle(`qv:${q.id}`)}><Icon name="ArrowUp" size={16} /> {q.votes + (flag(`qv:${q.id}`) ? 1 : 0)}</button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={ask} onClose={() => setAsk(false)} title="Ask a question">
        <Form submitLabel="Post question" fields={[{ name: 'q', label: 'Your question', type: 'textarea', required: true }]} onSubmit={(v) => { submit('qna', v, 'Question posted.'); setAsk(false); }} />
      </Modal>
    </>
  );
}

export function Alumni() {
  const { submit } = useApp();
  const [who, setWho] = useState(null);
  return (
    <>
      <PageHead title="Alumni connect" sub="Senior Fellows who have been exactly where you are." art="trophy-purple" />
      <div className="grid g3">
        {ALUMNI.map((a) => (
          <Tilt key={a.name}>
            <div className="lift stack-sm"><Avatar name={a.name} size="lg" /><h3 style={{ fontSize: 26 }}>{a.name}</h3><p className="dim small">{a.line}</p><p className="tiny dim">{a.college}</p>
              <div className="chips">{a.topics.map((t) => <Tag key={t} tone="soft">{t}</Tag>)}</div>
              <button className="btn btn-sm" style={{ alignSelf: 'flex-start', marginTop: 6 }} onClick={() => setWho(a)}>Ask {a.name}</button></div>
          </Tilt>
        ))}
      </div>
      <Modal open={!!who} onClose={() => setWho(null)} title={`Ask ${who?.name || ''}`}>
        <Form submitLabel="Send" fields={[{ name: 'q', label: 'Your question', type: 'textarea', required: true }]} onSubmit={(v) => { submit('alumni-ask', { to: who.name, ...v }, `Question sent to ${who.name}.`); setWho(null); }} />
      </Modal>
    </>
  );
}
