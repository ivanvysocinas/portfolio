import { lazy, Suspense } from 'react';
import { useI18n } from '../i18n/context';
import LazyVisible from './LazyVisible';
import { onSpotlightMove } from '../utils/spotlight';
const ShaderBlob = lazy(() => import('./ShaderBlob'));

const serviceIcons = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/></svg>',
];

export default function Services() {
  const { t } = useI18n();

  return (
    <section className="section services" id="services">
      {/* Diagonal wipe overlay */}
      <div className="section-wipe" data-wipe />
      <div className="container">
        <div className="services-layout">
          <div className="services-left" data-services-left>
            <div className="section-header">
              <span className="section-label">
                <span className="word-reveal"><span>{t.services.label}</span></span>
              </span>
              <h2 className="section-title" data-skew>
                <span className="word-reveal"><span>{t.services.title[0]}</span></span><br />
                <span className="word-reveal"><span>{t.services.title[1]}</span></span>
              </h2>
              <div className="line-reveal" />
            </div>

            <LazyVisible className="services-blob-wrap" data-blob-wrap>
              <Suspense fallback={null}><ShaderBlob /></Suspense>
            </LazyVisible>
          </div>

          <div className="services-right" data-services-cards>
            {t.services.items.map((s, i) => (
              <div key={s.num} className="service-card spotlight" data-service-card onMouseMove={onSpotlightMove}>
                <div className="service-head">
                  <span className="service-num">{s.num}</span>
                  {/* Static SVG icons — safe, no user input */}
                  <span className="service-icon" dangerouslySetInnerHTML={{ __html: serviceIcons[i] }} />
                </div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <div className="service-tags">
                  {s.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
