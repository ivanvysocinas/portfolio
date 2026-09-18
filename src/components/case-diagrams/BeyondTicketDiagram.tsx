const features = [
  {
    title: 'Estimate accuracy',
    sub: 'Did the work take as long as planned',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    title: 'Portfolio overview',
    sub: 'Every project and team, one screen',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: 'Workload & timesheets',
    sub: 'Attendance with an approval flow',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </svg>
    ),
  },
  {
    title: 'Reporting exports',
    sub: 'Payroll-style record keeping',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M4 19h16" />
      </svg>
    ),
  },
];

export default function BeyondTicketDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">Beyond the Ticket Queue</span>
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
