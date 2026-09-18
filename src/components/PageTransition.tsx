import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

type GoFn = (to: string, options?: { state?: Record<string, unknown> }) => void;

const PageTransitionContext = createContext<GoFn>(() => {});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  function go(to: string, options?: { state?: Record<string, unknown> }) {
    const overlay = overlayRef.current;
    const orb = orbRef.current;
    if (!overlay || !orb || isAnimating.current) return;
    isAnimating.current = true;

    // We never animate the real page (it's heavy — WebGL particles, a 3D
    // model, GSAP ScrollTrigger pins, Lenis all fighting for the same
    // frame). Instead we fade in one cheap, isolated overlay, swap routes
    // while it's fully opaque, then fade it back out. Only that one plain
    // div is ever animated, so it stays smooth no matter how heavy the
    // page underneath is.
    gsap.set(overlay, { display: 'block' });
    gsap.fromTo(
      overlay,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.32,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.fromTo(orb, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: 'power2.out' });

          navigate(to, options?.state ? { state: options.state } : undefined);

          requestAnimationFrame(() => {
            gsap.to(orb, { scale: 0, opacity: 0, duration: 0.4, delay: 0.05, ease: 'power2.in' });
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.4,
              delay: 0.05,
              ease: 'power2.inOut',
              onComplete: () => {
                gsap.set(overlay, { display: 'none' });
                isAnimating.current = false;
              },
            });
          });
        },
      },
    );
  }

  return (
    <PageTransitionContext.Provider value={go}>
      {children}
      <div className="page-transition-overlay" ref={overlayRef} />
      <div className="page-transition-orb" ref={orbRef} />
    </PageTransitionContext.Provider>
  );
}
