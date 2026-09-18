import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { caseDiagrams, type CaseDiagramKey } from './case-diagrams';

interface CaseGalleryProps {
  gallery: ReadonlyArray<{ key: CaseDiagramKey; caption: string }>;
}

function getCenterDeltas(stage: HTMLElement, items: NodeListOf<HTMLElement>) {
  const stageRect = stage.getBoundingClientRect();
  const centerX = stageRect.width / 2;
  const centerY = stageRect.height / 2;
  return Array.from(items).map((el) => {
    const r = el.getBoundingClientRect();
    const elX = r.left - stageRect.left + r.width / 2;
    const elY = r.top - stageRect.top + r.height / 2;
    return { x: centerX - elX, y: centerY - elY };
  });
}

// Diagrams are laid out with fixed-ish content sizes that don't always
// reflow cleanly into a narrow phone screen. Rather than auditing every
// diagram's internal CSS, measure the actual rendered size and shrink the
// whole thing uniformly so it always fits inside the stage — never wraps
// into an extra row, never overflows.
function fitDiagramToStage(stage: HTMLElement, content: HTMLElement) {
  content.style.transform = 'none';
  const availW = stage.clientWidth;
  const availH = stage.clientHeight;
  const neededW = content.scrollWidth;
  const neededH = content.scrollHeight;
  const scale = Math.min(1, availW / (neededW || 1), availH / (neededH || 1));
  content.style.transform = scale < 0.999 ? `scale(${scale})` : '';
}

export default function CaseGallery({ gallery }: CaseGalleryProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const isFirstRender = useRef(true);
  const swapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Entrance: burst outward from the center orb into place
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    const items = content?.querySelectorAll<HTMLElement>('[data-diagram-el]');
    if (!stage || !content || !items || !items.length) return;

    // Scale must settle before we read any bounding rects below.
    fitDiagramToStage(stage, content);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: 'power2.out' });
      return;
    }

    const deltas = getCenterDeltas(stage, items);
    items.forEach((el, i) => {
      gsap.set(el, { x: deltas[i].x, y: deltas[i].y, scale: 0.15, opacity: 0 });
    });

    gsap.to(orbRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(items, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.045,
      ease: 'back.out(1.6)',
      onComplete: () => { isAnimating.current = false; },
    });

    return () => {
      if (swapTimeout.current) clearTimeout(swapTimeout.current);
    };
  }, [activeSlide]);

  // Re-fit on resize / orientation change without replaying the entrance animation
  useEffect(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!stage || !content) return;
    const onResize = () => fitDiagramToStage(stage, content);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function goTo(index: number) {
    const next = ((index % gallery.length) + gallery.length) % gallery.length;
    if (next === activeSlide || isAnimating.current) return;
    isAnimating.current = true;

    const stage = stageRef.current;
    const content = contentRef.current;
    const items = content?.querySelectorAll<HTMLElement>('[data-diagram-el]');
    if (!stage || !content || !items || !items.length) {
      setActiveSlide(next);
      return;
    }

    // Collapse: every element converges into a circle at the center
    const deltas = getCenterDeltas(stage, items);
    gsap.to(items, {
      x: (i) => deltas[i].x,
      y: (i) => deltas[i].y,
      scale: 0.15,
      opacity: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        gsap.fromTo(orbRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out' });
        swapTimeout.current = setTimeout(() => setActiveSlide(next), 150);
      },
    });
  }

  const Diagram = caseDiagrams[gallery[activeSlide].key];

  return (
    <>
      <div className="case-gallery-row">
        <button
          type="button"
          className="case-gallery-arrow case-gallery-arrow-left"
          onClick={() => goTo(activeSlide - 1)}
          aria-label="Previous image"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="case-diagram-stage" ref={stageRef}>
          <div className="case-gallery-orb" ref={orbRef} />
          <div className="diagram-scale-wrap" ref={contentRef}>
            <Diagram />
          </div>
        </div>

        <button
          type="button"
          className="case-gallery-arrow case-gallery-arrow-right"
          onClick={() => goTo(activeSlide + 1)}
          aria-label="Next image"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="case-gallery-nav">
        <div className="case-gallery-dots">
          {gallery.map((g, i) => (
            <button
              key={g.key}
              type="button"
              className={`case-gallery-dot ${i === activeSlide ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === activeSlide}
            />
          ))}
        </div>
        <p className="case-gallery-caption">{gallery[activeSlide].caption}</p>
      </div>
    </>
  );
}
