import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/context';

export default function ScrollIndicator() {
  const { t } = useI18n();
  const sections = t.scrollSections;
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);

      const viewMid = scrollTop + window.innerHeight * 0.4;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= viewMid) {
          setActive(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Top progress bar */}
      <div className="scroll-progress-bar">
        <div className="scroll-progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* Side dots */}
      <nav className="scroll-dots" aria-label="Page sections">
        {sections.map((s, i) => (
          <button
            key={s.id}
            className={`scroll-dot-btn ${i === active ? 'active' : ''}`}
            onClick={() => scrollTo(s.id)}
            title={s.label}
          >
            <span className="scroll-dot-pip" />
            <span className="scroll-dot-label">{s.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
