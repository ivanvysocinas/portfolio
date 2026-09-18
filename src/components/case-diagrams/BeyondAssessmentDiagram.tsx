const features = [
  {
    title: 'Workflow & audit trail',
    sub: 'Every status change traced and reasoned',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'Dashboards & reporting',
    sub: 'Gauges, KPIs, year-over-year, bulk export',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-6 3 4 5-8" />
      </svg>
    ),
  },
  {
    title: 'Notification engine',
    sub: 'Configurable triggers, per-tenant templates',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    title: 'E-signature & documents',
    sub: 'Program library, tracked sign-off status',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
];

export default function BeyondAssessmentDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">Beyond the Assessment Itself</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-feature-grid">
        {features.map((f) => (
          <div className="diagram-feature-card" key={f.title} data-diagram-el>
            <span className="diagram-out-icon">{f.icon}</span>
            <div className="diagram-out-title">{f.title}</div>
            <div className="diagram-out-sub">{f.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
