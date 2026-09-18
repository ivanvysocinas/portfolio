import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    const restoreY = (state as { restoreScrollY?: number } | null)?.restoreScrollY;
    if (typeof restoreY === 'number') {
      window.scrollTo(0, restoreY);
      return;
    }
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, state]);

  return null;
}
