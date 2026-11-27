import { useMemo, useRef, useState } from 'react';
import Icon from '../components/Icon';
import { Avatar, Chips, DataTable, Empty, Form, Modal, PageHead, SectionTitle, Stat, Sticker, Tabs, Tag, Tilt } from '../components/ui';
import { useApp } from '../store/AppState';
import { SUCCESSOR_FORM, INSIGHT_FORM } from '../data/forms';
import { monthlyInsight } from '../lib/tasks';
import { ROLES } from '../data/roles';
import { ALUMNI, EVENTS, PEOPLE, QNA, TEAM_OPENINGS, WORK_WITH_US } from '../data/mock';
import { ROLE_BLURBS } from '../data/content';
import { fmtDate, fmtFull } from '../lib/utils';

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
  const mine = state.submissions.filter((s) => s.type === 'successor-nomination' && s.userId === user.id);
  const position = ROLES[user.role].label;
  return (
    <>
      <PageHead title="Nominate your successor" sub="Moving on from Under25, or at the end of your tenure? Nominate the person who should take up your position next." art="ok-yellow" />
      <div className="split">
        <div className="stack">
          <div className="callout"><Icon name="BadgeCheck" /><p className="small"><b>Position being handed over: {position}, {user.college}.</b> This is only for succession. To celebrate someone, use a shoutout in the Weekly Hang Session.</p></div>
          <div className="card">
            <Form
              submitLabel="Send nomination"
              initial={{ college: user.college }}
              fields={SUCCESSOR_FORM}
              onSubmit={(v, reset) => { submit('successor-nomination', { position, college: user.college, nominatedBy: user.name, ...v }, `${v.name} nominated to take over as ${position}.`); reset(); }}
            />
          </div>
        </div>
        <div className="card"><h3>Your nominations</h3>{mine.length ? mine.map((s) => <div className="list-row" key={s.id}><Avatar name={s.data.name} size="sm" /><div className="grow"><b>{s.data.name}</b><p className="dim small">{s.data.reason} · handover {fmtDate(s.data.handover)}</p></div><Tag tone="yellow">Under review</Tag></div>) : <p className="dim">None yet.</p>}</div>
      </div>
    </>
  );
}

export function Insight() {
  const { submit, flag, setFlag, user } = useApp();
  const ins = monthlyInsight(new Date(), user, { flags: {} });
  const key = ins?.monthKey || new Date().toISOString().slice(0, 7);
  const done = flag(`insight:${key}:${user.id}`);
  const locked = ins?.locked && user.role !== 'admin';
  return (
    <>
      <PageHead title="Insight form" sub="The monthly insight form. It becomes a mandatory task for Fellows and Heads of Operations on the 25th of every month." art="arrow-green" />
      {done ? (
        <div className="card"><Sticker name="trophy-yellow" size={90} /><h3 style={{ margin: '10px 0 4px' }}>Thank you, this month’s form is in</h3><p className="dim">We read every one. The next one opens on the 25th of next month.</p></div>
      ) : locked ? (
        <div className="callout"><Icon name="Lock" /><div><b>Opens on {fmtDate(ins.unlock, { day: 'numeric', month: 'long' })}.</b><p className="small">It appears in your tasks that day as a mandatory task.</p></div></div>
      ) : (
        <div className="card">
          <Form
            submitLabel="Submit insight form"
            fields={INSIGHT_FORM}
            onSubmit={(v) => { submit('insight', { month: key, college: user.college, role: user.role, ...v }, 'Insight form submitted.'); setFlag(`insight:${key}:${user.id}`, true); }}
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
  const { submit, user } = useApp();
  const [who, setWho] = useState(null);
  const list = user.role === 'admin' ? ALUMNI : ALUMNI.filter((a) => a.college === user.college);
  return (
    <>
      <PageHead title="Alumni connect" sub={user.role === 'admin' ? 'Senior Fellows from every college.' : `Senior Fellows from ${user.college}, who have been exactly where you are.`} art="trophy-purple" />
      {!list.length && <Empty title={`No alumni from ${user.college} yet`} text="When Fellows from your college finish their tenure, they will show up here." />}
      <div className="grid g3">
        {list.map((a) => (
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
