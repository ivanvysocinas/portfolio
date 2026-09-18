import { lazy, Suspense } from 'react';
import { useI18n } from '../i18n/context';
import LazyVisible from './LazyVisible';
const NetworkGraph = lazy(() => import('./NetworkGraph'));

export default function About() {
  const { t } = useI18n();
  const stats = t.about.stats;
  return (
    <section className="section about" id="about">
      <div className="section-wipe" data-wipe />
      <div className="container about-container">
        <div className="about-layout">
          <div className="about-left">
            <div className="about-text" data-about-text>
              <span className="section-label">
                <span className="word-reveal"><span>{t.about.label}</span></span>
              </span>
              <h2 className="section-title" data-skew>
                <span className="word-reveal"><span>{t.about.title[0]}</span></span><br />
                <span className="word-reveal"><span>{t.about.title[1]}</span></span><br />
                <span className="word-reveal"><span>{t.about.title[2]}</span></span>
              </h2>
              <div className="line-reveal" />
              <p className="about-desc" data-about-p>
                {t.about.desc1}
              </p>
              <p className="about-desc" data-about-p>
                {t.about.desc2}
              </p>
            </div>

            <div className="stats-row" data-stats-row>
              {stats.map((s, i) => (
                <div key={i} className="stat-card" data-stat-card>
                  <span className="stat-value" data-counter={s.num} data-suffix={s.suffix}>0{s.suffix}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <LazyVisible className="about-right" data-about-graph>
            <Suspense fallback={null}><NetworkGraph /></Suspense>
          </LazyVisible>
        </div>
      </div>
    </section>
  );
}
