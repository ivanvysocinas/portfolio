const roles = [
  { title: 'Engineer', sub: 'Own tasks, own estimates' },
  { title: 'Team lead', sub: "Team's load & estimate accuracy" },
  { title: 'Project manager', sub: 'Cross-project view + timesheets' },
  { title: 'Director', sub: 'Read-only strategic snapshot' },
];

const userIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

export default function RoleViewsDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">One Source, Four Views</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-export-flow">
        <div className="diagram-source" data-diagram-el>
          <span className="diagram-source-title">Tasks</span>
          <span className="diagram-source-sub">synced from Azure DevOps</span>
        </div>

        <div className="diagram-branches diagram-branches-4">
          {roles.map((r) => (
            <div className="diagram-branch-row" key={r.title} data-diagram-el>
              <div className="diagram-branch-line" />
              <div className="diagram-out-card">
                <span className="diagram-out-icon">{userIcon}</span>
                <div>
                  <div className="diagram-out-title">{r.title}</div>
                  <div className="diagram-out-sub">{r.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
