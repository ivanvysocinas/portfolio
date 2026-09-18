import type { MouseEvent } from 'react';
import { useI18n } from '../i18n/context';
import { onSpotlightMove } from '../utils/spotlight';
import { withBase } from '../utils/withBase';
import { usePageTransition } from './PageTransition';

// Placeholder covers (no real screenshots yet) — dark gradient + card index,
// generated locally so nothing depends on external images.
function placeholderCover(i: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1a1e"/>
        <stop offset="100%" stop-color="#0c0c0e"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#g)"/>
    <text x="40" y="430" font-family="monospace" font-size="220" fill="#e8860c" fill-opacity="0.14">0${i + 1}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function onTiltMove(e: MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty('--tilt-x', `${(-py * 8).toFixed(2)}deg`);
  el.style.setProperty('--tilt-y', `${(px * 8).toFixed(2)}deg`);
}
function onTiltLeave(e: MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.setProperty('--tilt-x', '0deg');
  el.style.setProperty('--tilt-y', '0deg');
}

export default function Industries() {
  const { t } = useI18n();
  const goTo = usePageTransition();

  function handleCardClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goTo(href, { state: { fromScrollY: window.scrollY } });
  }

  // Plain text, no word-reveal / scroll-trigger dependency — this header
  // sits right next to a pin: true horizontal-scroll ScrollTrigger, and
  // that combination kept leaving it permanently stuck invisible.
  const headerContent = (
    <>
      <span className="section-label">{t.projects.label}</span>
      <h2 className="section-title" data-skew>
        {t.projects.title[0]}<br />{t.projects.title[1]}
      </h2>
      <div className="line-reveal-static" />
    </>
  );

  const moreLink = (
    <a href="https://github.com/ivanvysocinas" target="_blank" rel="noopener noreferrer">
      <span>{t.projects.more}</span>
    </a>
  );

  return (
    <section className="industries" id="projects">
      <div className="section-wipe" data-wipe />

      {/* Mobile only: title sits above the swipe zone, which then holds
          nothing but project cards (see .hscroll-header-desktop/-mobile
          and .hscroll-end-desktop/-mobile in index.css). Plain text, no
          word-reveal — it should just be there, not wait on a scroll
          trigger tied to a section it no longer sits inside of. */}
      <div className="hscroll-header hscroll-header-mobile">
        <span className="section-label">{t.projects.label}</span>
        <h2 className="section-title">
          {t.projects.title[0]}<br />{t.projects.title[1]}
        </h2>
        <div className="line-reveal-static" />
      </div>

      {/* The whole panel is pinned on desktop — header lives inside the track there */}
      <div className="hscroll-wrap" data-hscroll-wrap>
        <div className="hscroll-track" data-hscroll-track>
          {/* Header as the first "slide" (desktop only — hidden on mobile) */}
          <div className="hscroll-header hscroll-header-desktop">
            {headerContent}
          </div>

          {t.projects.items.map((p, i) => {
            const hasCaseStudy = 'slug' in p && !!p.slug && 'detail' in p && !!p.detail;
            const cardInner = (
              <>
                <div className="industry-card-top" onMouseMove={onTiltMove} onMouseLeave={onTiltLeave}>
                  <img
                    className="industry-card-img"
                    src={hasCaseStudy && 'detail' in p && p.detail ? withBase(p.detail.cover) : placeholderCover(i)}
                    alt={p.title}
                    loading="lazy"
                    width={800}
                    height={500}
                    decoding="async"
                  />
                  <div className="industry-card-overlay" />
                  <span className="industry-card-label">{p.title}</span>
                  <span className="industry-stat">{p.stats}</span>
                </div>
                <div className="industry-card-body">
                  <h3 className="industry-title">{p.title}</h3>
                  <p className="industry-desc">{p.desc}</p>
                  <div className="industry-nda">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="4" y="11" width="16" height="9" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t.projects.ndaNote}
                  </div>
                  <div className="industry-tags">
                    {p.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  {hasCaseStudy && (
                    <span className="industry-readmore">
                      {t.projects.viewCase}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>
              </>
            );

            return hasCaseStudy && 'slug' in p ? (
              <a
                key={p.title}
                href={withBase(`/projects/${p.slug}`)}
                onClick={(e) => handleCardClick(e, `/projects/${p.slug}`)}
                className="industry-card spotlight industry-card-link"
                data-industry-card
                onMouseMove={onSpotlightMove}
              >
                {cardInner}
              </a>
            ) : (
              <div key={p.title} className="industry-card spotlight" data-industry-card onMouseMove={onSpotlightMove}>
                {cardInner}
              </div>
            );
          })}

          {/* Desktop only — mobile keeps this out of the swipe zone (below) */}
          <div className="hscroll-end hscroll-end-desktop">{moreLink}</div>
        </div>
      </div>

      {/* Mobile only: the same link, placed under the swipe zone instead of inside it */}
      <div className="hscroll-end hscroll-end-mobile">{moreLink}</div>
    </section>
  );
}
