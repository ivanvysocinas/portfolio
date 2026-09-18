const outputs = [
  {
    title: 'Web app',
    sub: 'Standalone deploy, own backend + DB',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 9h20" />
      </svg>
    ),
  },
  {
    title: 'Mobile app',
    sub: 'Offline-first, installable APK',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    title: 'Reports',
    sub: 'Versioned XLSX / DOCX / PDF',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  },
];

export default function ExportPipelineDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">One Config, Three Outputs</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-export-flow">
        <div className="diagram-source" data-diagram-el>
          <span className="diagram-source-title">Mini-app</span>
          <span className="diagram-source-sub">config.json</span>
        </div>

        <div className="diagram-branches">
          {outputs.map((o) => (
            <div className="diagram-branch-row" key={o.title} data-diagram-el>
              <div className="diagram-branch-line" />
              <div className="diagram-out-card">
                <span className="diagram-out-icon">{o.icon}</span>
                <div>
                  <div className="diagram-out-title">{o.title}</div>
                  <div className="diagram-out-sub">{o.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
