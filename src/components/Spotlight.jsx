import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Icon from './Icon';
import { ART, mascot } from '../lib/assets';
import { useApp, allEvents } from '../store/AppState';
import { gcalLink } from '../lib/image';
import { fmtDate, fmtTime } from '../lib/utils';

// Pinned banners at the top of Home, modelled on the Under25 app's Spotlight section.
// Event and session banners come from real events; MVPs, standouts and the challenge are managed by admin.
export function useBanners() {
  const { state, user } = useApp();
  return useMemo(() => {
    const now = new Date();
    const up = allEvents(state).filter((e) => new Date(e.when) >= now && (e.leaders ? user.role !== 'community' : true)).sort((a, b) => new Date(a.when) - new Date(b.when));
    const sessions = up.filter((e) => e.digital).slice(0, 2).map((e) => ({
      id: `b-${e.id}`, kind: e.title.includes('Hang') ? 'Weekly Hang Session' : 'Digital session', title: e.title, sub: `${fmtDate(e.when, { day: 'numeric', month: 'short' })} · ${fmtTime(e.when)} IST`,
      cta: 'RSVP on Google Calendar', href: gcalLink(e), tone: 'orange', mascot: true,
    }));
    const community = up.filter((e) => !e.digital && e.type !== 'On-ground').slice(0, 1).concat(up.filter((e) => e.type === 'On-ground' && e.city !== 'All').slice(0, 1)).map((e) => ({
      id: `b-${e.id}`, kind: 'Upcoming community event', title: e.title, sub: `${fmtDate(e.when, { day: 'numeric', month: 'short' })} · ${e.where}`, cta: 'See event', href: `/events${e.type === 'City meetup' ? '?type=City%20meetup' : ''}`, tone: 'yellow', art: e.type === 'City meetup' ? 'shapes-yellow' : 'ok-yellow',
    }));
    return [...sessions.slice(0, 1), ...community.slice(0, 1), ...state.spotlight.slice(0, 1), ...sessions.slice(1), ...state.spotlight.slice(1), ...community.slice(1)];
  }, [state, user.role]);
}

function Banner({ b, index }) {
  const external = /^https?:/.test(b.href);
  const body = (
    <>
      <div className="spot-copy">
        <span className="spot-kind">{b.kind}</span>
        <h3>{b.title}</h3>
        <p>{b.sub}</p>
        <span className="spot-cta">{b.cta} <Icon name={external ? 'ExternalLink' : 'ArrowRight'} size={16} /></span>
      </div>
      <div className="spot-art" aria-hidden="true">
        {b.mascot ? <img src={mascot} alt="" className="spot-mascot" /> : <img src={ART[b.art] || ART['shapes-yellow']} alt="" className="spot-sticker" />}
      </div>
    </>
  );
  const props = { className: `spot spot-${b.tone}`, 'data-index': index };
  return external
    ? <a {...props} href={b.href} target="_blank" rel="noreferrer noopener">{body}</a>
    : <Link {...props} to={b.href}>{body}</Link>;
}

export default function Spotlight() {
  const banners = useBanners();
  const rail = useRef(null);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const el = rail.current;
    if (!el) return undefined;
    const on = () => {
      const kids = [...el.children];
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let d = Infinity;
      kids.forEach((k, i) => { const dist = Math.abs(k.offsetLeft + k.offsetWidth / 2 - mid); if (dist < d) { d = dist; best = i; } });
      setAt(best);
    };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [banners.length]);

  const go = (dir) => {
    const el = rail.current;
    const kid = el?.children[Math.max(0, Math.min(banners.length - 1, at + dir))];
    kid?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  if (!banners.length) return null;
  return (
    <section aria-label="Spotlight" className="spotlight">
      <div className="row-between" style={{ marginBottom: 12 }}>
        <h2 className="display" style={{ fontSize: 34 }}>Spotlight <Icon name="Sparkles" size={24} style={{ display: 'inline', verticalAlign: '-2px', color: 'var(--yellow)' }} /></h2>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-icon" onClick={() => go(-1)} aria-label="Previous banner" disabled={at === 0}><Icon name="ChevronRight" size={18} style={{ transform: 'rotate(180deg)' }} /></button>
          <button className="btn btn-icon" onClick={() => go(1)} aria-label="Next banner" disabled={at >= banners.length - 1}><Icon name="ChevronRight" size={18} /></button>
        </div>
      </div>
      <motion.div ref={rail} className="spot-rail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
        {banners.map((b, i) => <Banner key={b.id} b={b} index={i} />)}
      </motion.div>
      <div className="spot-dots" aria-hidden="true">{banners.map((b, i) => <i key={b.id} data-on={i === at} />)}</div>
    </section>
  );
}
