import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { Bars, CheckItem, Chips, DataTable, PageHead, Progress, SectionTitle, Stat, Tabs, Tag, Tilt, ExtLink } from '../components/ui';
import { PlanCalendar } from './Club';
import { useApp } from '../store/AppState';
import { EVENT_IDEAS, EVENT_SERIES, inDays } from '../data/mock';

export function EventStats() {
  const rows = [
    { id: 1, name: 'Club Orientation', date: 'Sep', att: 142, rsvp: 168, report: 'Filed' },
    { id: 2, name: 'Daan Utsav drive', date: 'Oct', att: 96, rsvp: 120, report: 'Filed' },
    { id: 3, name: 'Open mic night', date: 'Oct', att: 118, rsvp: 150, report: 'Filed' },
    { id: 4, name: 'Quiz league', date: 'Nov', att: 164, rsvp: 190, report: 'Filed' },
    { id: 5, name: 'Letter writing evening', date: 'Nov', att: 61, rsvp: 80, report: 'Due' },
  ];
  return (
    <>
      <PageHead title="Event statistics" sub="Attendance, events run and how many people who RSVP actually show up." art="arrow-green" />
      <div className="stack">
        <div className="card"><div className="grid g4"><Stat label="Events this semester" value={9} /><Stat label="Total attendance" value={760} /><Stat label="RSVP to attendance" value={78} suffix="%" /><Stat label="Reports on time" value={89} suffix="%" /></div></div>
        <div className="split">
          <div className="card"><div className="card-head"><h3>Events per month</h3></div><Bars data={EVENT_SERIES.map((e) => e.held || e.plan)} labels={EVENT_SERIES.map((e) => (e.plan ? `${e.m} (plan)` : e.m))} /></div>
          <div className="card"><div className="card-head"><h3>Attendance</h3></div><Bars data={EVENT_SERIES.map((e) => e.att)} labels={EVENT_SERIES.map((e) => e.m)} /></div>
        </div>
        <SectionTitle>Recent events</SectionTitle>
        <DataTable rows={rows} csv="events.csv" cols={[{ key: 'name', label: 'Event' }, { key: 'date', label: 'Month' }, { key: 'rsvp', label: 'RSVPs' }, { key: 'att', label: 'Attended' }, { key: 'report', label: 'Report', render: (r) => <Tag tone={r.report === 'Filed' ? 'green' : 'orange'}>{r.report}</Tag> }]} />
      </div>
    </>
  );
}

export function EventIdeas() {
  const { flag, toggle, addTask, user, toast } = useApp();
  const [type, setType] = useState('');
  const [eff, setEff] = useState('');
  const list = EVENT_IDEAS.filter((e) => (!type || e.type === type) && (!eff || e.effort === eff));
  return (
    <>
      <PageHead title="Event ideas" sub="Formats that are easy to run on campus and easy to show on camera." art="ok-orange" />
      <div className="stack">
        <div className="row-between"><Chips options={[...new Set(EVENT_IDEAS.map((e) => e.type))]} value={type} onChange={setType} all="All types" /><Chips all="Any effort" options={['Low', 'Medium', 'High']} value={eff} onChange={setEff} /></div>
        <div className="grid g3">
          {list.map((e) => (
            <Tilt key={e.id} max={5}>
              <div className="lift stack-sm">
                <div className="row-between"><Tag tone="orange">{e.type}</Tag><button className="btn btn-icon" style={{ width: 34, height: 34 }} aria-label={flag(`saved:${e.id}`) ? 'Unsave idea' : 'Save idea'} aria-pressed={flag(`saved:${e.id}`)} onClick={() => toggle(`saved:${e.id}`)}><Icon name="Star" size={16} style={flag(`saved:${e.id}`) ? { fill: 'var(--yellow)', color: 'var(--yellow)' } : null} /></button></div>
                <h3 style={{ fontSize: 22 }}>{e.title}</h3><p className="dim small">{e.hook}</p>
                <p className="tiny dim">{e.people} people · {e.budget} · effort {e.effort.toLowerCase()}</p>
                <div className="row" style={{ marginTop: 6 }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => { addTask({ title: `Plan: ${e.title}`, text: e.hook, assignee: user.id, due: inDays(7), by: user.name, priority: 'Medium' }); toast('Added to your tasks'); }}>Make it a task</button>
                  <Link className="btn btn-sm btn-soft" to="/listevent">List it</Link>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </>
  );
}

export const EventCal = () => (<><PageHead title="Event calendar" sub="Upcoming festivals, milestones and an event to run around each one." art="arrow-yellow" /><PlanCalendar kind="events" /></>);
