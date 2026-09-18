import { useI18n } from '../i18n/context';

export default function Process() {
  const { t } = useI18n();

  return (
    <section className="section process" id="process">
      <div className="section-wipe" data-wipe />
      <div className="container">
        <div className="section-header" data-process-header>
          <span className="section-label">
            <span className="word-reveal"><span>{t.process.label}</span></span>
          </span>
          <h2 className="section-title" data-skew>
            <span className="word-reveal"><span>{t.process.title[0]}</span></span><br />
            <span className="word-reveal"><span>{t.process.title[1]}</span></span>
          </h2>
          <div className="line-reveal" />
        </div>

        {/* Timeline */}
        <div className="process-timeline" data-process-timeline>
          {/* Vertical progress line */}
          <div className="process-line">
            <div className="process-line-fill" data-process-line-fill />
          </div>

          {t.process.steps.map((step, i) => (
            <div key={step.num} className="process-step" data-process-step>
              {/* Dot on the line */}
              <div className="process-dot" data-process-dot>
                <span>{step.num}</span>
              </div>

              {/* Content card */}
              <div className={`process-card ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="process-card-head">
                  <h3 className="process-card-title">{step.title}</h3>
                  <span className="process-duration">{step.duration}</span>
                </div>
                <p className="process-card-desc">{step.desc}</p>
                <ul className="process-details">
                  {step.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
