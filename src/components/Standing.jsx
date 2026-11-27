import { CountUp, Tilt } from './ui';
import { ART } from '../lib/assets';
import { CURRENT_SEM, JOURNEY } from '../data/content';

// "Where you stand": big colourful tiles, the first thing on Home.
export function StandingTiles({ tiles, showJourney }) {
  const sem = JOURNEY[CURRENT_SEM - 1];
  return (
    <section aria-label="Where you stand" className="standing-wrap">
      {showJourney && (
        <div className="journey-strip">
          <div className="js-copy"><span>You are in</span><b>Sem {CURRENT_SEM}: {sem.name}</b><em>{sem.when}</em></div>
          <div className="js-steps" role="img" aria-label={`Semester ${CURRENT_SEM} of 6`}>
            {JOURNEY.map((s) => <i key={s.sem} data-state={s.sem < CURRENT_SEM ? 'done' : s.sem === CURRENT_SEM ? 'now' : 'next'}><b>{s.sem}</b></i>)}
          </div>
        </div>
      )}
      <div className="grid g4 standing-grid">
        {tiles.map((t) => (
          <Tilt key={t.label} className={`standing solid-${t.tone}`} max={7}>
            <div className="lift">
              <span className="st-label">{t.label}</span>
              <b className="st-num num"><CountUp value={t.value} />{t.suffix && <span className="st-suf">{t.suffix}</span>}</b>
              <span className="st-sub">{t.sub}</span>
              {t.progress != null && <div className="st-bar" role="progressbar" aria-valuenow={Math.round(t.progress * 100)} aria-valuemin={0} aria-valuemax={100}><i style={{ transform: `scaleX(${Math.min(1, t.progress)})` }} /></div>}
            </div>
            <img className="st-art sticker" src={ART[t.art]} alt="" draggable="false" />
          </Tilt>
        ))}
      </div>
    </section>
  );
}
