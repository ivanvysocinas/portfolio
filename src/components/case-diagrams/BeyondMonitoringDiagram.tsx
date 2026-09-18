const features = [
  {
    title: 'Encrypted vault',
    sub: 'Access credentials, not a spreadsheet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="16" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    title: 'Uptime history',
    sub: 'Worst-first, per location',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-6 3 4 5-8" />
      </svg>
    ),
  },
  {
    title: 'RBAC + audit log',
    sub: 'Every action traced to a user',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        <path d="M9.5 12l1.8 1.8L14.5 10" />
      </svg>
    ),
  },
  {
    title: 'Sentry AI',
    sub: 'Ops questions, answered in chat',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function BeyondMonitoringDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">Beyond Monitoring</span>
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
