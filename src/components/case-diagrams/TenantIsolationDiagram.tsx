const lockIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const layers = [
  { title: 'Database queries', sub: 'Filtered by tenant_id on every read/write' },
  { title: 'File storage', sub: 'Partitioned per tenant' },
  { title: 'Cache keys', sub: 'Namespaced by tenant_id' },
];

export default function TenantIsolationDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">One Request, Three Enforced Boundaries</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-export-flow">
        <div className="diagram-source" data-diagram-el>
          <span className="diagram-source-title">JWT</span>
          <span className="diagram-source-sub">tenant_id + role</span>
        </div>

        <div className="diagram-branches">
          {layers.map((l) => (
            <div className="diagram-branch-row" key={l.title} data-diagram-el>
              <div className="diagram-branch-line" />
              <div className="diagram-out-card">
                <span className="diagram-out-icon">{lockIcon}</span>
                <div>
                  <div className="diagram-out-title">{l.title}</div>
                  <div className="diagram-out-sub">{l.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
