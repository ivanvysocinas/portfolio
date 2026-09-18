import { lazy, Suspense } from 'react';
import MagneticButton from './MagneticButton';
import { useI18n } from '../i18n/context';
const ParticleCanvas = lazy(() => import('./ParticleCanvas'));

function getResponsiveFont() {
  if (typeof window === 'undefined') return 160;
  const w = window.innerWidth;
  if (w < 400) return 100;
  if (w < 768) return 130;
  if (w < 1024) return 140;
  return 160;
}

function getResponsiveCount() {
  if (typeof window === 'undefined') return 3750;
  return window.innerWidth < 768 ? 1875 : 3750;
}

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="hero" id="hero">
      <Suspense fallback={null}>
        <ParticleCanvas text="IV" fontSize={getResponsiveFont()} particleCount={getResponsiveCount()} />
      </Suspense>
      <div className="hero-overlay" data-hero-content>
        <p className="hero-tagline">
          {t.hero.tagline.map((w, i) => (
            <span key={i} className="word-reveal"><span>{w}</span></span>
          )).reduce((a: any[], b: any) => a.length ? [...a, ' ', b] : [b], [] as any[])}
        </p>
        <p className="hero-sub">
          {t.hero.sub.map((line, i) => (
            <span key={i} className="word-reveal"><span>{line}</span></span>
          )).reduce((a: any[], b: any) => a.length ? [...a, ' ', b] : [b], [] as any[])}
        </p>
        <div className="hero-ctas">
          <MagneticButton href="#contact" className="btn btn-primary hero-btn">
            {t.hero.cta1}
          </MagneticButton>
          <MagneticButton href="#projects" className="btn btn-ghost hero-btn">
            {t.hero.cta2}
          </MagneticButton>
        </div>
      </div>
      <div className="hero-scroll-hint" data-hero-hint>
        <div className="scroll-mouse">
          <div className="scroll-dot" />
        </div>
      </div>
    </section>
  );
}
