import Icon from './Icon';
import { useApp } from '../store/AppState';
import { gcalLink } from '../lib/image';

// RSVP rules:
//  - digital sessions (Weekly Hang, Draft Room, Townhall, Academy): RSVP happens on Google Calendar, for everyone
//  - on-ground events: only community members RSVP (core team, HoO, HoC and Fellow run them, admin only watches)
//  - city meetups and the talent hunt: RSVP in the app for every role except admin
export const canRsvpInApp = (e, role) => {
  if (e.digital || role === 'admin') return false;
  if (e.type === 'On-ground') return role === 'community';
  return true;
};

export function RsvpAction({ e, className = 'btn btn-sm' }) {
  const { user, flag, toggle, setFlag } = useApp();
  if (new Date(e.when) < new Date()) return null;
  if (e.digital) {
    const opened = flag(`cal:${e.id}`);
    return (
      <a className={`${className} ${opened ? 'btn-soft' : ''}`} href={gcalLink(e)} target="_blank" rel="noreferrer noopener" onClick={() => setFlag(`cal:${e.id}`, true)}>
        <Icon name="CalendarPlus" size={15} /> {opened ? 'Opened in Google Calendar' : 'RSVP on Google Calendar'}
      </a>
    );
  }
  if (!canRsvpInApp(e, user.role)) return null;
  const on = flag(`rsvp:${e.id}`);
  const full = (e.going || 0) + (on ? 1 : 0) >= e.cap && !on;
  return (
    <button className={`${className} ${on ? 'btn-soft' : ''}`} disabled={full} onClick={() => toggle(`rsvp:${e.id}`)} aria-pressed={on}>
      {on ? <><Icon name="Check" size={15} /> You’re going</> : full ? 'Full' : 'RSVP'}
    </button>
  );
}
