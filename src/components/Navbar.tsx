import { useEffect, useState } from 'react';
import { useI18n, type Lang } from '../i18n/context';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLang = () => setLang(lang === 'en' ? 'ru' : 'en' as Lang);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <button className="nav-logo" onClick={() => scrollTo('hero')}>
        Ivan Vysocinas
      </button>
      <div className="nav-links">
        <button onClick={() => scrollTo('services')}>{t.nav.services}</button>
        <button onClick={() => scrollTo('projects')}>{t.nav.projects}</button>
        <button onClick={() => scrollTo('process')}>{t.nav.process}</button>
        <button onClick={() => scrollTo('about')}>{t.nav.about}</button>
      </div>
      <div className="nav-right">
        <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
          {lang === 'en' ? 'RU' : 'EN'}
        </button>
        <button onClick={() => scrollTo('contact')} className="nav-cta">
          {t.nav.cta}
        </button>
      </div>
    </nav>
  );
}
