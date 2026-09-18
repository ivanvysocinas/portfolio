import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/context';
import SmoothScroll from './components/SmoothScroll';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import ScrollToTop from './components/ScrollToTop';
import PageTransitionProvider from './components/PageTransition';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <I18nProvider>
      <BrowserRouter basename="/portfolio">
        <SmoothScroll />
        <ScrollToTop />
        <PageTransitionProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
          </Routes>
        </PageTransitionProvider>
      </BrowserRouter>
    </I18nProvider>
  );
}
