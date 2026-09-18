import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { caseDiagrams, type CaseDiagramKey } from './case-diagrams';

interface CaseGalleryProps {
  gallery: ReadonlyArray<{ key: CaseDiagramKey; caption: string }>;
}

interface StageRefs {
  stage: HTMLDivElement | null;
  content: HTMLDivElement | null;
  orb: HTMLDivElement | null;
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
// whole thing uniformly so it always fits inside the stage — like a photo
// scaled with object-fit: contain — instead of wrapping into an extra row.
function fitDiagramToStage(stage: HTMLElement, content: HTMLElement) {
  content.style.transform = 'none';
  const availW = stage.clientWidth;
  const availH = stage.clientHeight;
  const neededW = content.scrollWidth;
  const neededH = content.scrollHeight;
  const scale = Math.min(1, availW / (neededW || 1), availH / (neededH || 1));
  content.style.transform = scale < 0.999 ? `scale(${scale})` : '';
}

function playEntrance(refs: StageRefs, isFirst: boolean, onDone?: () => void) {
  const { stage, content, orb } = refs;
  const items = content?.querySelectorAll<HTMLElement>('[data-diagram-el]');
  if (!stage || !content || !items || !items.length) { onDone?.(); return; }

  fitDiagramToStage(stage, content);

  if (isFirst) {
    gsap.fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: 'power2.out', onComplete: onDone });
    return;
  }

  const deltas = getCenterDeltas(stage, items);
  items.forEach((el, i) => {
    gsap.set(el, { x: deltas[i].x, y: deltas[i].y, scale: 0.15, opacity: 0 });
  });

  gsap.to(orb, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
  gsap.to(items, {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 0.6,
    stagger: 0.045,
    ease: 'back.out(1.6)',
    onComplete: onDone,
  });
}

function playCollapse(refs: StageRefs, onDone: () => void) {
  const { stage, content, orb } = refs;
  const items = content?.querySelectorAll<HTMLElement>('[data-diagram-el]');
  if (!stage || !content || !items || !items.length) { onDone(); return; }

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
      gsap.fromTo(orb, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out' });
      onDone();
    },
  });
}

export default function CaseGallery({ gallery }: CaseGalleryProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  const lightboxStageRef = useRef<HTMLDivElement>(null);
  const lightboxContentRef = useRef<HTMLDivElement>(null);
  const lightboxOrbRef = useRef<HTMLDivElement>(null);

  const isAnimating = useRef(false);
  const isFirstRender = useRef(true);
  const lightboxFirstForSlide = useRef(true);
  const swapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inline gallery entrance — driven only by slide changes, never by the
  // lightbox opening/closing (that must not replay this animation).
  useLayoutEffect(() => {
    const first = isFirstRender.current;
    isFirstRender.current = false;
    playEntrance({ stage: stageRef.current, content: contentRef.current, orb: orbRef.current }, first, () => {
      isAnimating.current = false;
    });

    return () => {
      if (swapTimeout.current) clearTimeout(swapTimeout.current);
    };
  }, [activeSlide]);

  // Lightbox entrance — a plain fade the first time it opens for this
  // slide, then the same burst as the inline gallery on every slide change
  // while it stays open.
  useLayoutEffect(() => {
    if (!isFullscreen) { lightboxFirstForSlide.current = true; return; }
    const first = lightboxFirstForSlide.current;
    lightboxFirstForSlide.current = false;
    playEntrance({ stage: lightboxStageRef.current, content: lightboxContentRef.current, orb: lightboxOrbRef.current }, first);
  }, [activeSlide, isFullscreen]);

  // Re-fit on resize / orientation change without replaying the entrance animation
  useEffect(() => {
    function onResize() {
      if (stageRef.current && contentRef.current) fitDiagramToStage(stageRef.current, contentRef.current);
      if (lightboxStageRef.current && lightboxContentRef.current) fitDiagramToStage(lightboxStageRef.current, lightboxContentRef.current);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock page scroll and allow Escape while the lightbox is open
  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowLeft') goTo(activeSlide - 1);
      if (e.key === 'ArrowRight') goTo(activeSlide + 1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, activeSlide]);

  function goTo(index: number) {
    const next = ((index % gallery.length) + gallery.length) % gallery.length;
    if (next === activeSlide || isAnimating.current) return;
    isAnimating.current = true;

    let pending = 1;
    const proceed = () => {
      pending -= 1;
      if (pending <= 0) swapTimeout.current = setTimeout(() => setActiveSlide(next), 150);
    };

    playCollapse({ stage: stageRef.current, content: contentRef.current, orb: orbRef.current }, proceed);
    if (isFullscreen) {
      pending += 1;
      playCollapse({ stage: lightboxStageRef.current, content: lightboxContentRef.current, orb: lightboxOrbRef.current }, proceed);
    }
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

        <div
          className="case-diagram-stage case-diagram-stage-btn"
          ref={stageRef}
          role="button"
          tabIndex={0}
          onClick={() => setIsFullscreen(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFullscreen(true); } }}
          aria-label="View diagram fullscreen"
        >
          <div className="case-gallery-orb" ref={orbRef} />
          <div className="diagram-scale-wrap" ref={contentRef}>
            <Diagram />
          </div>
          <span className="case-diagram-expand" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </span>
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

      {isFullscreen && (
        <div className="diagram-lightbox" onClick={() => setIsFullscreen(false)}>
          <button
            type="button"
            className="diagram-lightbox-close"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            className="diagram-lightbox-arrow diagram-lightbox-arrow-left"
            onClick={(e) => { e.stopPropagation(); goTo(activeSlide - 1); }}
            aria-label="Previous image"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="case-diagram-stage diagram-lightbox-stage" ref={lightboxStageRef} onClick={(e) => e.stopPropagation()}>
            <div className="case-gallery-orb" ref={lightboxOrbRef} />
            <div className="diagram-scale-wrap" ref={lightboxContentRef}>
              <Diagram />
            </div>
          </div>

          <button
            type="button"
            className="diagram-lightbox-arrow diagram-lightbox-arrow-right"
            onClick={(e) => { e.stopPropagation(); goTo(activeSlide + 1); }}
            aria-label="Next image"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <p className="diagram-lightbox-caption" onClick={(e) => e.stopPropagation()}>{gallery[activeSlide].caption}</p>
        </div>
      )}
    </>
  );
}
