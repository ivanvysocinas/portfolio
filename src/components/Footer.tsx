import { useI18n } from '../i18n/context';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-logo">Ivan Vysocinas</span>
        <span className="footer-copy">{t.footer.copy}</span>
      </div>
    </footer>
  );
}
