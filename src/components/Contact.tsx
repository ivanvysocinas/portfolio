import { useRef, useState, lazy, Suspense, type FormEvent } from 'react';
import type { ContactModelHandle } from './ContactModel';
import MagneticButton from './MagneticButton';
import { useI18n } from '../i18n/context';
import LazyVisible from './LazyVisible';
import { withBase } from '../utils/withBase';
const ContactModel = lazy(() => import('./ContactModel'));

export default function Contact() {
  const { t } = useI18n();
  const socials = t.contact.socials;
  const modelRef = useRef<ContactModelHandle>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');

  function switchTo(idx: number) {
    if (idx === activeIdx || animating) return;
    setAnimating(true);
    modelRef.current?.switchModel(withBase(socials[idx].model));
    setActiveIdx(idx);
    setTimeout(() => setAnimating(false), 1200);
  }

  function goPrev() { switchTo((activeIdx - 1 + socials.length) % socials.length); }
  function goNext() { switchTo((activeIdx + 1) % socials.length); }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('sending');
    const form = e.currentTarget;
    try {
      await fetch('https://formspree.io/f/xvkggwqo', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      setFormState('sent');
      form.reset();
    } catch {
      setFormState('idle');
    }
  }

  const social = socials[activeIdx];

  return (
    <section className="section contact" id="contact">
      <div className="section-wipe" data-wipe />
      <div className="container">
        <div className="contact-layout">
          {/* Left — text + form */}
          <div className="contact-left" data-contact-inner>
            <span className="section-label">
              <span className="word-reveal"><span>{t.contact.label}</span></span>
            </span>
            <h2 className="contact-title" data-skew>
              <span className="word-reveal"><span>{t.contact.title[0]}</span></span><br />
              <span className="word-reveal"><span>{t.contact.title[1]}</span></span>
            </h2>
            <div className="line-reveal" />
            <p className="contact-desc" data-contact-p>
              {t.contact.desc}
            </p>

            {formState === 'sent' ? (
              <div className="form-success" data-contact-ctas>
                <span className="form-success-icon">✓</span>
                <p>{t.contact.form.sent}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} data-contact-ctas>
                <div className="form-row">
                  <input type="text" name="name" placeholder={t.contact.form.name} required className="form-input" />
                  <input type="email" name="email" placeholder={t.contact.form.email} required className="form-input" />
                </div>
                <textarea name="message" placeholder={t.contact.form.message} rows={4} required className="form-input form-textarea" />
                <button type="submit" className="btn btn-primary btn-lg" disabled={formState === 'sending'}>
                  {formState === 'sending' ? t.contact.form.sending : t.contact.form.send}
                </button>
              </form>
            )}

            <div className="contact-links" style={{ marginTop: 24 }}>
              <MagneticButton href="https://www.linkedin.com/in/ivan-vysocinas-20716b38a" target="_blank" rel="noopener noreferrer" className="glass-icon" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M6.5 8.5v10M6.5 5.5v.01M11.5 18.5v-6c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v6M11.5 12.5v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
              <MagneticButton href="https://github.com/ivanvysocinas" target="_blank" rel="noopener noreferrer" className="glass-icon" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 4v-3.4c0-1 .1-1.4-.5-2 2-.2 4.5-1 4.5-4.5 0-1-.4-1.8-1-2.5.1-.3.5-1.4-.1-2.9 0 0-.8-.3-2.7 1a9.4 9.4 0 0 0-5 0c-1.9-1.3-2.7-1-2.7-1-.6 1.5-.2 2.6-.1 2.9-.6.7-1 1.5-1 2.5 0 3.5 2.5 4.3 4.5 4.5-.3.3-.5.7-.5 1.4V19" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
              <MagneticButton href="https://t.me/Bugzers" target="_blank" rel="noopener noreferrer" className="glass-icon" aria-label="Telegram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M21 4L3 11l6 2.5M21 4l-3 16-8-6.5M21 4L9 13.5m0 0V19l3-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
              <MagneticButton href="mailto:ivanvysocinas@gmail.com" className="glass-icon" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* 3D model with switcher */}
      <div className="contact-model-section" data-contact-model>
        <div className="model-switcher">
          <button className="model-arrow model-arrow-left" onClick={goPrev} disabled={animating} aria-label="Previous social">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <LazyVisible className="contact-model-wrap">
            <Suspense fallback={null}><ContactModel ref={modelRef} initialModel={withBase(socials[0].model)} /></Suspense>
          </LazyVisible>

          <button className="model-arrow model-arrow-right" onClick={goNext} disabled={animating} aria-label="Next social">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="model-dots">
          {socials.map((_, i) => (
            <button
              key={i}
              className={`model-dot ${i === activeIdx ? 'active' : ''}`}
              onClick={() => switchTo(i)}
            />
          ))}
        </div>

        {/* Animated CTA button */}
        <a
          key={social.url}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost contact-social-btn"
        >
          <span className="contact-social-text" key={activeIdx}>
            {social.label}
          </span>
        </a>
      </div>
    </section>
  );
}
