import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { Avatar, Chips, ExtLink, Form, Modal, PageHead, Progress, SectionTitle, Stat, Sticker, Tabs, Tag, Tilt } from '../components/ui';
import { FitBox, PhotoPicker } from '../components/extra';
import { useApp } from '../store/AppState';
import { CARE_TEAM, CURRENT_SEM, INCENTIVES, JOURNEY, PLAQUE, ROLE_BLURBS, STRUCTURE } from '../data/content';
import { BRANDED, CHALLENGES, TEAM_MEMBERS } from '../data/mock';
import { fmtDate, relDay } from '../lib/utils';

export function Team() {
  const { user, toast, state } = useApp();
  const [grp, setGrp] = useState(user.role === 'hoc' ? 'Content' : user.role === 'hoo' ? 'Operations' : '');
  const list = TEAM_MEMBERS.filter((m) => !grp || m.group === grp || m.group === 'Fellow');
  const active = TEAM_MEMBERS.filter((m) => m.status === 'Active').length;
  return (
    <>
      <PageHead title="Your team" sub="The people who run your campus club, and the roles still open." art="shapes-yellow" />
      <div className="stack">
        <div className="card"><div className="grid g3"><Stat label="Active leads" value={active} /><Stat label="Open roles" value={TEAM_MEMBERS.length - active} /><div className="stat"><b>64/100</b><span>Core team built (Sem 1 target 100)</span><Progress value={64} /></div></div></div>
        <Chips all="Whole team" options={['Content', 'Operations']} value={grp} onChange={setGrp} />
        <div className="grid g3">
          {list.map((m) => (
            <Tilt key={m.id} max={5}>
              <div className="lift row" style={{ flexWrap: 'nowrap' }}>
                {m.name ? <Avatar src={state.photos[`team:${m.id}`] || state.photos[`node:${m.role}`]} name={m.name} size="lg" /> : <span className="avatar lg" style={{ background: 'var(--surface-2)', color: 'var(--grey-2)' }}><Icon name="UserPlus" /></span>}
                <div className="grow"><b style={{ fontSize: 17 }}>{m.name || 'Open role'}</b><p className="dim small">{m.role}</p>
                  <div className="row" style={{ marginTop: 8, gap: 6 }}>
                    <Tag tone={m.status === 'Open' ? 'orange' : 'green'}>{m.status}</Tag>
                    {m.name && <button className="btn btn-sm btn-ghost" onClick={() => toast(`Message sent to ${m.name.split(' ')[0]}`)}>Ping</button>}
                  </div></div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </>
  );
}

function OrgNode({ id, title, name, tone, icon, solid, onPick }) {
  const { state } = useApp();
  const photo = state.photos[`node:${id}`];
  return (
    <button className={`org-node org-${tone} ${solid ? 'solid' : ''}`} onClick={() => onPick(id)} aria-label={`${title}${name ? `, ${name}` : ''}. Open details`}>
      <Avatar src={photo} name={name || title} size="lg" style={solid ? { background: 'var(--ink)', color: 'var(--white)' } : undefined} />
      <span className="org-title"><Icon name={icon} size={15} /> {title}</span>
      <small>{name || 'Open role'}</small>
    </button>
  );
}

export function Structure() {
  const { user, state, setPhoto, toast } = useApp();
  const [sel, setSel] = useState(null);
  const S = STRUCTURE;
  const members = Object.fromEntries(TEAM_MEMBERS.map((m) => [m.role, m]));
  const nodes = {
    fellow: { title: 'Fellow', name: state.accounts.find((a) => a.role === 'fellow' && a.college === user.college)?.name || 'Ananya Rao', branch: 'all', text: 'The OG of the campus. Leads the whole club.' },
    hoc: { title: 'Head of Content', name: members['Head of Content']?.name, branch: 'hoc', text: 'Leads the content team: Design, Content, Media and Technical.' },
    hoo: { title: 'Head of Operations', name: members['Head of Operations']?.name, branch: 'hoo', text: 'Leads the operations team: Events, Culture, Marketing, Brand and Finance.' },
  };
  S.heads.forEach((h) => h.leads.forEach((l) => { nodes[l.id] = { title: l.title, name: members[l.title]?.name, branch: h.id, text: ROLE_BLURBS[l.title], leads: l.leads, cores: l.cores }; }));
  const canEdit = (n) => user.role === 'admin' || user.role === 'fellow' || (user.role === 'hoc' && n.branch === 'hoc') || (user.role === 'hoo' && n.branch === 'hoo');
  const cur = sel && nodes[sel];
  return (
    <>
      <PageHead title="Team structure" sub="Your club at a glance. Every role shows a photo above its title. Tap a role to see what it does or add a photo." art="shapes-orange" />
      <div className="card">
        <FitBox>
        <div className="org tree">
          <ul>
            <li>
              <OrgNode id="fellow" title="Fellow" name={nodes.fellow.name} tone="fellow" icon="Crown" solid onPick={setSel} />
              <ul>
                {S.heads.map((h) => (
                  <li key={h.id}>
                    <OrgNode id={h.id} title={h.name} name={nodes[h.id].name} tone={h.tone} icon={h.id === 'hoc' ? 'FileText' : 'Users'} solid onPick={setSel} />
                    <ul>
                      {h.leads.map((l) => (
                        <li key={l.id}>
                          <OrgNode id={l.id} title={l.title} name={nodes[l.id].name} tone={h.tone} icon={l.icon} onPick={setSel} />
                          <span className="org-link" />
                          <span className={`org-count org-${h.tone}`} title={`${l.leads} lead${l.leads > 1 ? 's' : ''}`}>{l.leads}</span>
                          <span className="org-link dashed" />
                          <div className={`org-cores org-${h.tone}`}><Icon name="Users" size={20} /><b>{l.coresLabel}</b><span className={`org-count org-${h.tone}`}>{l.cores}</span></div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <div className="org-community"><span className="org-community-tag"><Icon name="UsersRound" size={18} /> Community layer</span>
            <div className="row-between" style={{ width: '100%', padding: '18px 8px 6px' }}><b>Minimum {S.community}+ community members</b><span className="dim small" style={{ maxWidth: 420, textAlign: 'right' }}>All members from various colleges: passionate contributors, content creators, volunteers and supporters.</span></div>
          </div>
          <div className="org-totals">
            <div className="org-total"><Icon name="Crown" /> <span><b>Lead</b> (Total {S.totals.leads})</span><i /><Icon name="Users" /> <span><b>Core team members</b> (Total {S.totals.cores})</span></div>
            <div className="org-total big"><Icon name="UsersRound" size={26} /> <b>Total strength = {S.totals.strength}+</b></div>
          </div>
        </div>
        </FitBox>
      </div>
      <Modal open={!!cur} onClose={() => setSel(null)} title={cur?.title || ''}>
        {cur && (
          <div className="stack">
            <div className="row" style={{ flexWrap: 'nowrap' }}><Avatar src={state.photos[`node:${sel}`]} name={cur.name || cur.title} size="lg" /><div><b style={{ fontSize: 18 }}>{cur.name || 'Open role'}</b><p className="dim small">{cur.title}</p></div></div>
            <p>{cur.text}</p>
            {cur.cores != null && <p className="small dim">{cur.leads} lead{cur.leads > 1 ? 's' : ''} · {cur.cores} core team members</p>}
            {canEdit(cur) ? (
              <div className="field"><span className="label">Photo (shown above the title)</span><PhotoPicker value={state.photos[`node:${sel}`] ? [state.photos[`node:${sel}`]] : []} onChange={(p) => { setPhoto(`node:${sel}`, p[0] || null); toast('Photo updated'); }} label="Upload photo" /></div>
            ) : <p className="tiny dim">Your Fellow or Head can add the photo for this role.</p>}
          </div>
        )}
      </Modal>
    </>
  );
}

export function Journey() {
  const [open, setOpen] = useState(CURRENT_SEM);
  return (
    <>
      <PageHead title="College journey" sub="Six semesters, six unlocks. Here is how your year builds, one level at a time." art="arrow-yellow" />
      <div className="card" style={{ marginBottom: 16 }}><div className="row-between"><div><p className="dim small">You are in</p><h3 className="display" style={{ fontSize: 40 }}>Sem {CURRENT_SEM}: {JOURNEY[CURRENT_SEM - 1].name}</h3></div><div style={{ minWidth: 240, flex: 1, maxWidth: 360 }}><Progress value={CURRENT_SEM - 0.5} max={6} /><p className="tiny dim" style={{ marginTop: 6 }}>{Math.round(((CURRENT_SEM - 0.5) / 6) * 100)}% of the journey</p></div></div></div>
      <div className="timeline">
        {JOURNEY.map((s) => (
          <div key={s.sem} className={`tl-item ${s.sem < CURRENT_SEM ? 'done' : s.sem === CURRENT_SEM ? 'now' : ''}`}>
            <span className="tl-dot">{s.sem < CURRENT_SEM && <Icon name="Check" size={12} strokeWidth={3.5} />}</span>
            <button className="card card-click" style={{ marginTop: -4 }} onClick={() => setOpen(open === s.sem ? 0 : s.sem)} aria-expanded={open === s.sem}>
              <div className="row-between"><div><span className="dim small">{s.when}</span><h3 style={{ fontSize: 26 }}>Sem {s.sem}: {s.name}</h3></div><Icon name="ChevronDown" style={{ transform: open === s.sem ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }} /></div>
              {open === s.sem && (
                <div className="grid g2" style={{ marginTop: 14 }}>
                  <div><h4>What you will do</h4><ul className="stack-sm" style={{ marginTop: 8 }}>{s.does.map((d) => <li key={d} className="small">• {d}</li>)}</ul></div>
                  <div><h4>What you unlock</h4><ul className="stack-sm" style={{ marginTop: 8 }}>{s.unlock.map((d) => <li key={d} className="small"><Icon name="Gift" size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6, color: 'var(--accent-text)' }} />{d}</li>)}</ul></div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export function Milestones() {
  const followers = 1180;
  const marks = [['Kickoff', 'August', 'done'], ['Club page launch', 'August', 'done'], ['Team recruitment', 'August', 'done'], ['Team launch', 'September', 'done'], ['First on-ground event', 'September', 'done'], ['Daan Utsav', 'October', 'done'], ['Under25 Plaque launch', 'November', 'now'], ['Student talent hunt', 'Nov to Jan', 'now'], ['Campus Awards', 'Dec to Apr', 'next'], ['Handovers', 'Apr to May', 'next']];
  return (
    <>
      <PageHead title="Milestones" sub="The moments that mark progress, and the incentives that keep effort visible." art="trophy-yellow" />
      <div className="stack">
        <div className="card">
          <div className="card-head"><div><h3>Under25 Club Plaque</h3><p className="dim small">Grow the club page to unlock the next tier.</p></div><span className="display" style={{ fontSize: 44 }}>{followers.toLocaleString('en-IN')}</span></div>
          <div className="grid g3">
            {PLAQUE.map((p) => (
              <div key={p.name} className="stack-sm"><div className="row-between"><b>{p.name}</b><span className="small dim num">{p.followers.toLocaleString('en-IN')}</span></div><Progress value={followers} max={p.followers} /><span className="tiny dim">{followers >= p.followers ? 'Unlocked' : `${(p.followers - followers).toLocaleString('en-IN')} to go`}</span></div>
            ))}
          </div>
        </div>
        <div className="grid g2">
          <div className="card"><h3>Program milestones</h3><div className="timeline" style={{ marginTop: 14 }}>{marks.map(([t, w, s]) => <div key={t} className={`tl-item ${s === 'done' ? 'done' : s === 'now' ? 'now' : ''}`}><span className="tl-dot">{s === 'done' && <Icon name="Check" size={12} strokeWidth={3.5} />}</span><b>{t}</b><p className="dim small">{w}</p></div>)}</div></div>
          <div className="card"><h3>Incentives</h3>{INCENTIVES.map(([t, d]) => <div className="list-row" key={t}><Icon name="Star" style={{ color: 'var(--accent-text)' }} /><div><b>{t}</b><p className="dim small">{d}</p></div></div>)}</div>
        </div>
      </div>
    </>
  );
}

export function Challenges() {
  const { flag, setFlag, submit } = useApp();
  const [ch, setCh] = useState(null);
  const pts = CHALLENGES.filter((c) => flag(`chal:${c.id}`)).reduce((a, c) => a + c.points, 100);
  return (
    <>
      <PageHead title="Challenges" sub="Team challenges with proof. Submit what you did and collect points." art="arrow-green" />
      <div className="stack">
        <div className="card row-between"><div><p className="dim small">Your team’s points</p><span className="big-num">{pts}</span></div><Sticker name="trophy-purple" size={90} float /></div>
        <div className="grid g2">
          {CHALLENGES.map((c) => {
            const sent = flag(`chal:${c.id}`);
            return (
              <div className="card" key={c.id}>
                <div className="row-between"><Tag tone={c.state === 'open' ? 'yellow' : ''}>{c.state === 'open' ? 'Open' : c.state === 'soon' ? 'Coming soon' : 'Closed'}</Tag><span className="tiny dim">{c.brief}</span></div>
                <h3 style={{ margin: '10px 0 4px', fontSize: 24 }}>{c.title}</h3><p className="dim small">{c.text}</p>
                <div className="row-between" style={{ marginTop: 14 }}><span className="small dim">{c.state === 'closed' ? 'Closed' : `Due ${fmtDate(c.due)}`} · {c.points} pts</span>
                  <button className={`btn btn-sm ${sent ? 'btn-soft' : ''}`} disabled={c.state !== 'open' || sent} onClick={() => setCh(c)}>{sent ? 'Submitted' : 'Submit proof'}</button></div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal open={!!ch} onClose={() => setCh(null)} title="Submit proof">
        <Form submitLabel="Submit" fields={[{ name: 'link', label: 'Link to your post, report or folder', required: true, placeholder: 'https://' }, { name: 'note', label: 'Notes', type: 'textarea' }]} onSubmit={(v) => { submit('challenge', { id: ch.id, ...v }, 'Proof submitted. Points added once reviewed.'); setFlag(`chal:${ch.id}`, true); setCh(null); }} />
      </Modal>
    </>
  );
}

export function Branded() {
  const { flag, toggle, user, state, submit } = useApp();
  const [tag, setTag] = useState('');
  const [add, setAdd] = useState(false);
  const extra = state.submissions.filter((s) => s.type === 'mission').map((s) => ({ id: s.id, brand: s.data.brand, title: s.data.title, text: s.data.text, reward: s.data.reward, due: new Date(s.data.due).toISOString(), spots: Number(s.data.spots) || 10, taken: 0, tag: s.data.tag }));
  const all = [...extra, ...BRANDED];
  const list = all.filter((b) => !tag || b.tag === tag);
  return (
    <>
      <PageHead title="Branded opportunities" sub="Live briefs from brands with real deadlines. Money, merch and CV points." art="ok-orange" right={user.role === 'admin' ? <button className="btn" onClick={() => setAdd(true)}>List a mission</button> : undefined} />
      <div className="stack">
        <Chips options={[...new Set(all.map((b) => b.tag))]} value={tag} onChange={setTag} />
        <div className="grid g2">
          {list.map((b) => {
            const on = flag(`brand:${b.id}`);
            const taken = b.taken + (on ? 1 : 0);
            return (
              <Tilt key={b.id} max={4}>
                <div className="lift">
                  <div className="row-between"><Tag tone="purple">{b.tag}</Tag><span className="tiny dim">Due {fmtDate(b.due)} ({relDay(b.due).toLowerCase()})</span></div>
                  <p className="dim small" style={{ marginTop: 12 }}>{b.brand}</p><h3 style={{ fontSize: 26 }}>{b.title}</h3><p className="small" style={{ margin: '6px 0 12px' }}>{b.text}</p>
                  <div className="callout" style={{ padding: '8px 12px' }}><Icon name="Wallet" size={18} /><b>{b.reward}</b></div>
                  <div style={{ margin: '14px 0' }}><Progress value={taken} max={b.spots} /><p className="tiny dim num" style={{ marginTop: 6 }}>{taken} of {b.spots} clubs in</p></div>
                  <button className={`btn btn-sm ${on ? 'btn-soft' : ''}`} onClick={() => toggle(`brand:${b.id}`)} aria-pressed={on}>{on ? 'Applied' : 'Apply for this brief'}</button>
                </div>
              </Tilt>
            );
          })}
        </div>
      </div>
      <Modal open={add} onClose={() => setAdd(false)} title="List a mission">
        <Form submitLabel="Publish mission" fields={[{ name: 'brand', label: 'Brand', required: true }, { name: 'title', label: 'Mission title', required: true }, { name: 'text', label: 'Brief', type: 'textarea', required: true }, { name: 'reward', label: 'Reward', required: true }, { name: 'due', label: 'Deadline', type: 'date', required: true }, { name: 'spots', label: 'Spots', type: 'number', default: '10' }, { name: 'tag', label: 'Type', type: 'select', options: ['Activation', 'Content', 'Growth', 'Event'], required: true }]}
          onSubmit={(v) => { submit('mission', v, 'Mission is live for Fellows.'); setAdd(false); }} />
      </Modal>
    </>
  );
}

export function Help() {
  const { submit, toast } = useApp();
  const [q, setQ] = useState('');
  const care = CARE_TEAM.filter((c) => `${c.name} ${c.note}`.toLowerCase().includes(q.toLowerCase()));
  const copy = (t) => { navigator.clipboard?.writeText(t); toast('Copied'); };
  return (
    <>
      <PageHead title="Need help?" sub="Under25 Care is your support system throughout the Fellowship. Pick the person who fits." art="ok-purple" />
      <div className="stack">
        <div className="split">
          <div className="card"><h3 style={{ marginBottom: 12 }}>Send us a note</h3>
            <Form submitLabel="Send to Under25 Care" fields={[{ name: 'topic', label: 'What do you need help with?', type: 'select', options: ['Management is not on board', 'My team has gone quiet', 'Event planning', 'Club page and content', 'Brand opportunity', 'Something else'], required: true }, { name: 'text', label: 'Tell us more', type: 'textarea', required: true }]} onSubmit={(v, reset) => { submit('help', v, 'Sent. Someone from Care will reply soon.'); reset(); }} /></div>
          <div className="card"><h3>Quick answers</h3>
            {[['Management is pushing back', 'Use the pitch deck and the Community Agreement. If it still stalls, we can join a meeting with them.'], ['A teammate went quiet', 'Reach out warmly within days. Check in, do not chase.'], ['Not sure what is allowed at events', 'Check Event guidelines. Under25 is alcohol-free, smoke-free and drug-free.']].map(([a, b]) => <div className="list-row" key={a} style={{ alignItems: 'flex-start' }}><Icon name="Info" style={{ color: 'var(--accent-text)', flex: 'none' }} /><div><b>{a}</b><p className="dim small">{b}</p></div></div>)}
          </div>
        </div>
        <SectionTitle right={<div style={{ width: 240 }}><input className="input" placeholder="Filter the team" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter the Care team" /></div>}>Your Care team</SectionTitle>
        <div className="grid g3">
          {care.map((c) => (
            <Tilt key={c.email} max={4}>
              <div className="lift stack-sm"><div className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={c.name} size="lg" /><div><b style={{ fontSize: 18 }}>{c.name}</b></div></div><p className="dim small">{c.note}</p>
                <div className="row" style={{ gap: 6 }}><a className="btn btn-sm btn-soft" href={`tel:${c.phone.replace(/\s/g, '')}`}><Icon name="Phone" size={15} /> Call</a><a className="btn btn-sm btn-soft" href={`mailto:${c.email}`}><Icon name="Mail" size={15} /> Email</a><button className="btn btn-sm btn-ghost" onClick={() => copy(c.phone)} aria-label={`Copy ${c.name}'s number`}><Icon name="Copy" size={15} /></button></div></div>
            </Tilt>
          ))}
        </div>
      </div>
    </>
  );
}
