import { useRef, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  strength?: number;
  'aria-label'?: string;
}

export default function MagneticButton({ children, className = '', href, target, rel, onClick, strength = 0.35, 'aria-label': ariaLabel }: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    },
    [strength],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }, []);

  const props = {
    ref: ref as any,
    className: `magnetic ${className}`,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    'aria-label': ariaLabel,
  };

  if (href) {
    return <a {...props} href={href} target={target} rel={rel}>{children}</a>;
  }
  return <button {...props}>{children}</button>;
}
