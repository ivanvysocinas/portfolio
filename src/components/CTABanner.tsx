import MagneticButton from './MagneticButton';
import { useI18n } from '../i18n/context';

export default function CTABanner() {
  const { t } = useI18n();
  return (
    <div className="cta-banner" data-cta-banner>
      <div className="container">
        <div className="cta-banner-inner">
          <div className="cta-banner-text">
            <h3 className="cta-banner-title">{t.cta.title}</h3>
            <p className="cta-banner-desc">{t.cta.desc}</p>
          </div>
          <MagneticButton href="#contact" className="btn btn-primary btn-lg cta-banner-btn">
            {t.cta.btn}
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
