import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Services from '../components/Services';
import Industries from '../components/Industries';
import Process from '../components/Process';
import CTABanner from '../components/CTABanner';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollIndicator from '../components/ScrollIndicator';
import BackToTop from '../components/BackToTop';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  useEffect(() => {
    // Defer all scroll animations until after first paint
    const idleId = 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(init, { timeout: 300 })
      : setTimeout(init, 100);

    let ctx: ReturnType<typeof gsap.context> | null = null;

    function init() {
    ctx = gsap.context(() => {
      // ───────────────────────────────────────────
      // 1. HERO — word reveals on load + parallax fade
      // ───────────────────────────────────────────
      const heroWords = document.querySelectorAll('.hero .word-reveal > span');
      const heroBtns = document.querySelectorAll('.hero-btn');
      const heroContent = document.querySelector('[data-hero-content]');
      const heroHint = document.querySelector('[data-hero-hint]');

      gsap.set(heroWords, { yPercent: 120 });
      gsap.set(heroBtns, { opacity: 0, y: 30 });

      gsap.timeline({ delay: 0.3 })
        .to(heroWords, { yPercent: 0, duration: 1, stagger: 0.08, ease: 'power4.out' })
        .to(heroBtns, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.4');

      if (heroContent) {
        gsap.to(heroContent, {
          yPercent: -30, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      if (heroHint) {
        gsap.to(heroHint, {
          opacity: 0, y: -20, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: '10% top', end: '30% top', scrub: true },
        });
      }

      // ───────────────────────────────────────────
      // 2. DIAGONAL WIPE transitions
      // ───────────────────────────────────────────
      document.querySelectorAll('[data-wipe]').forEach((wipe) => {
        const section = wipe.closest('.section, .industries, .process');
        if (!section) return;
        gsap.fromTo(wipe,
          { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            ease: 'power2.inOut',
            scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 40%', scrub: true },
          },
        );
      });

      // ───────────────────────────────────────────
      // 3. WORD REVEALS — staggered per section
      // ───────────────────────────────────────────
      const revealGroups = [
        '[data-services-left]',
        '[data-industries-header]',
        '[data-industries-header-mobile]',
        '[data-process-header]',
        '[data-about-text]',
        '[data-contact-inner]',
      ];
      revealGroups.forEach((sel) => {
        const parent = document.querySelector(sel);
        if (!parent) return;
        const words = parent.querySelectorAll('.word-reveal > span');
        const section = parent.closest('.section, .industries');
        gsap.set(words, { yPercent: 120 });
        words.forEach((word, idx) => {
          gsap.to(word, {
            yPercent: 0, duration: 1.1, delay: idx * 0.06, ease: 'power4.out',
            scrollTrigger: { trigger: section || parent, start: 'top 70%', toggleActions: 'play none none reverse' },
          });
        });
      });

      // ───────────────────────────────────────────
      // 4. LINE REVEALS
      // ───────────────────────────────────────────
      document.querySelectorAll('.line-reveal').forEach((line) => {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: line, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });

      // ───────────────────────────────────────────
      // 5. SERVICES — cards slide in
      // ───────────────────────────────────────────
      document.querySelectorAll('[data-service-card]').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, x: 80, rotateY: -8 },
          {
            opacity: 1, x: 0, rotateY: 0, duration: 0.9, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          },
        );
      });

      const blobWrap = document.querySelector('[data-blob-wrap]');
      if (blobWrap) {
        gsap.fromTo(blobWrap, { opacity: 0, scale: 0.8 }, {
          opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: blobWrap, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }

      // ───────────────────────────────────────────
      // 6. INDUSTRIES — horizontal scroll
      // ───────────────────────────────────────────
      const hScrollWrap = document.querySelector('[data-hscroll-wrap]');
      const hScrollTrack = document.querySelector('[data-hscroll-track]');
      // Scroll-jacking a horizontal pin over touch scroll is unreliable on
      // mobile — below tablet width it's a native swipe carousel instead
      // (overflow-x + scroll-snap, see CSS), so skip the GSAP pin here.
      if (hScrollWrap && hScrollTrack && window.innerWidth > 768) {
        const getScrollWidth = () => (hScrollTrack as HTMLElement).scrollWidth - window.innerWidth;
        gsap.to(hScrollTrack, {
          x: () => -getScrollWidth(),
          ease: 'none',
          scrollTrigger: {
            trigger: hScrollWrap,
            start: 'top top',
            end: () => `+=${getScrollWidth()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Industry cards stagger reveal
      document.querySelectorAll('[data-industry-card]').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, delay: i * 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: hScrollWrap || card, start: 'top 70%', toggleActions: 'play none none none' },
          },
        );
      });

      // ───────────────────────────────────────────
      // 7. PROCESS — timeline animation
      // ───────────────────────────────────────────

      // Progress line fills as you scroll through the section
      const processTimeline = document.querySelector('[data-process-timeline]');
      const processLineFill = document.querySelector('[data-process-line-fill]');
      if (processTimeline && processLineFill) {
        gsap.fromTo(processLineFill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: processTimeline,
              start: 'top 60%',
              end: 'bottom 60%',
              scrub: true,
            },
          },
        );
      }

      // Steps: dots light up + cards slide in alternating from left/right
      document.querySelectorAll('[data-process-step]').forEach((step, i) => {
        const dot = step.querySelector('[data-process-dot]');
        const card = step.querySelector('.process-card');
        const isLeft = card?.classList.contains('left');

        // Dot activates
        if (dot) {
          gsap.fromTo(dot,
            { scale: 0, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
              scrollTrigger: { trigger: step, start: 'top 65%', toggleActions: 'play none none reverse' },
            },
          );
        }

        // Card slides in from the side
        if (card) {
          gsap.fromTo(card,
            { opacity: 0, x: isLeft ? -80 : 80, rotateY: isLeft ? 5 : -5 },
            {
              opacity: 1, x: 0, rotateY: 0, duration: 0.9, delay: 0.1,
              ease: 'power3.out',
              scrollTrigger: { trigger: step, start: 'top 65%', toggleActions: 'play none none reverse' },
            },
          );
        }
      });

      // ───────────────────────────────────────────
      // 8. ABOUT — paragraphs, stats, counters, graph
      // ───────────────────────────────────────────
      document.querySelectorAll('[data-about-p]').forEach((p, i) => {
        gsap.fromTo(p, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.9, delay: i * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      });

      document.querySelectorAll('[data-stat-card]').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 60, scale: 0.85 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.1, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '[data-stats-row]', start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      });

      // Animated counters
      document.querySelectorAll('[data-counter]').forEach((el) => {
        const target = parseInt(el.getAttribute('data-counter') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          scrollTrigger: {
            trigger: el, start: 'top 85%', toggleActions: 'play none none reverse',
            onLeaveBack: () => { obj.val = 0; (el as HTMLElement).textContent = `0${suffix}`; },
          },
          onUpdate: () => { (el as HTMLElement).textContent = `${Math.round(obj.val)}${suffix}`; },
        });
      });

      const aboutGraph = document.querySelector('[data-about-graph]');
      if (aboutGraph) {
        gsap.fromTo(aboutGraph, { opacity: 0, x: 80, scale: 0.9 }, {
          opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: aboutGraph, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
      }

      // ───────────────────────────────────────────
      // 9. CONTACT
      // ───────────────────────────────────────────
      const contactP = document.querySelector('[data-contact-p]');
      if (contactP) {
        gsap.fromTo(contactP, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: contactP, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }
      const contactCtas = document.querySelector('[data-contact-ctas]');
      if (contactCtas) {
        gsap.fromTo(contactCtas, { opacity: 0, y: 40, scale: 0.95 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: contactCtas, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }
      const contactModel = document.querySelector('[data-contact-model]');
      if (contactModel) {
        gsap.fromTo(contactModel, { opacity: 0, y: 120 }, {
          opacity: 1, y: 0, ease: 'power2.out',
          scrollTrigger: { trigger: contactModel, start: 'top 95%', end: 'top 50%', scrub: true },
        });
      }

      // ───────────────────────────────────────────
      // 10. SECTION PARALLAX
      // ───────────────────────────────────────────
      document.querySelectorAll('.section').forEach((section) => {
        const inner = section.querySelector('.container');
        if (!inner) return;
        gsap.fromTo(inner, { y: 60 }, {
          y: -30, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // ───────────────────────────────────────────
      // 12. CTA BANNER
      // ───────────────────────────────────────────
      const ctaBanner = document.querySelector('[data-cta-banner]');
      if (ctaBanner) {
        gsap.fromTo(ctaBanner, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ctaBanner, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }

      // ───────────────────────────────────────────
      // 14. TEXT SKEW ON SCROLL VELOCITY
      // ───────────────────────────────────────────
      const skewTargets = document.querySelectorAll('[data-skew]');
      let currentSkew = 0;
      let lastScrollTop = window.scrollY;

      const skewTicker = () => {
        const scrollTop = window.scrollY;
        const velocity = scrollTop - lastScrollTop;
        lastScrollTop = scrollTop;
        const targetSkew = Math.max(-4, Math.min(4, velocity * 0.15));
        currentSkew += (targetSkew - currentSkew) * 0.1;
        skewTargets.forEach((el) => {
          (el as HTMLElement).style.transform = `skewY(${currentSkew}deg)`;
        });
      };
      gsap.ticker.add(skewTicker);

      return () => { gsap.ticker.remove(skewTicker); };
    });
    } // end init()

    return () => {
      if ('requestIdleCallback' in window) (window as any).cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      ctx?.revert();
    };
  }, []);

  return (
    <>
      <Navbar />
      <ScrollIndicator />
      <BackToTop />
      <Hero />
      <Marquee />
      <Services />
      <Industries />
      <Process />
      <CTABanner />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
