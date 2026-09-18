import { useEffect, type MouseEvent } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import Footer from '../components/Footer';
import CaseGallery from '../components/CaseGallery';
import { usePageTransition } from '../components/PageTransition';
import { withBase } from '../utils/withBase';

export default function ProjectPage() {
  const { slug } = useParams();
  const { t } = useI18n();
  const goTo = usePageTransition();
  const location = useLocation();
  const fromScrollY = (location.state as { fromScrollY?: number } | null)?.fromScrollY;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  function handleBackClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goTo('/', typeof fromScrollY === 'number' ? { state: { restoreScrollY: fromScrollY } } : undefined);
  }

  const project = t.projects.items.find(
    (p): p is Extract<typeof p, { detail: any }> => 'slug' in p && p.slug === slug && 'detail' in p && !!p.detail,
  );

  if (!project) {
    return (
      <div className="case-page">
        <CaseNav />
        <section className="section case-not-found">
          <div className="container">
            <h1 className="section-title">{t.caseStudy.notFoundTitle}</h1>
            <p className="case-not-found-desc">{t.caseStudy.notFoundDesc}</p>
            <a href={withBase('/#projects')} className="btn btn-primary" onClick={handleBackClick}>{t.caseStudy.back}</a>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const { detail } = project;

  return (
    <div className="case-page">
      <CaseNav />

      <header className="case-hero">
        <div className="container">
          <a href={withBase('/#projects')} className="case-back" onClick={handleBackClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.caseStudy.back}
          </a>
          <span className="section-label">{project.title}</span>
          <h1 className="case-title">{detail.subtitle}</h1>
          <div className="case-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="case-cover-wrap">
        {'gallery' in detail && detail.gallery ? (
          <CaseGallery gallery={detail.gallery} />
        ) : (
          <img src={withBase(detail.cover)} alt={project.title} className="case-cover" loading="eager" />
        )}
      </div>

      <section className="section case-body">
        <div className="container case-body-grid">
          <div className="case-content">
            <div className="case-block">
              <span className="section-label">{t.caseStudy.contextLabel}</span>
              <p className="case-text">{detail.context}</p>
            </div>
            <div className="case-block">
              <span className="section-label">{t.caseStudy.solutionLabel}</span>
              <p className="case-text">{detail.solution}</p>
            </div>
            <div className="case-block">
              <span className="section-label">{t.caseStudy.resultLabel}</span>
              <ul className="case-results">
                {detail.results.map((r: string) => (
                  <li key={r}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="case-meta">
            <div className="case-meta-item">
              <span className="case-meta-label">{t.caseStudy.roleLabel}</span>
              <span className="case-meta-value">{detail.role}</span>
            </div>
            <div className="case-meta-item">
              <span className="case-meta-label">{t.caseStudy.timelineLabel}</span>
              <span className="case-meta-value">{detail.timeline}</span>
            </div>
            <div className="case-meta-item">
              <span className="case-meta-label">{t.caseStudy.stackLabel}</span>
              <div className="case-tags">
                {detail.stack.map((s: string) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="cta-banner case-cta">
        <div className="container cta-banner-inner">
          <h2 className="cta-banner-title">{t.caseStudy.ctaTitle}</h2>
          <p className="cta-banner-desc">{t.caseStudy.ctaDesc}</p>
          <Link to="/#contact" className="btn btn-primary btn-lg">{t.caseStudy.ctaBtn}</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CaseNav() {
  const { lang, setLang, t } = useI18n();
  return (
    <nav className="navbar scrolled case-navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="nav-logo">Ivan Vysocinas</Link>
      <div className="nav-right">
        <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'ru' : 'en')} aria-label="Switch language">
          {lang === 'en' ? 'RU' : 'EN'}
        </button>
        <Link to="/#contact" className="nav-cta">{t.nav.cta}</Link>
      </div>
    </nav>
  );
}
