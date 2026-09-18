const watched = [
  { region: 'EEMEA', status: 'online', detail: 'Online · 4ms avg' },
  { region: 'APAC', status: 'online', detail: 'Online · 6ms avg' },
  { region: 'LATAM', status: 'offline', detail: 'No locations yet' },
  { region: 'EU', status: 'online', detail: 'Online · 5ms avg' },
];

export default function HealthMonitoringDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">Every Location, Watched Continuously</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-export-flow">
        <div className="diagram-source" data-diagram-el>
          <span className="diagram-source-title">Sentry</span>
          <span className="diagram-source-sub">pings /health + /api/config</span>
        </div>

        <div className="diagram-branches">
          {watched.map((w) => (
            <div className="diagram-branch-row" key={w.region} data-diagram-el>
              <div className="diagram-branch-line" />
              <div className="diagram-out-card">
                <span className={`diagram-status-dot ${w.status}`} />
                <div>
                  <div className="diagram-out-title">{w.region}</div>
                  <div className="diagram-out-sub">{w.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
