export default function TwoWaySyncDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">Write to Azure First, Then the Database</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-sync-flow">
        <div className="diagram-sync-node" data-diagram-el>
          <span className="diagram-sync-node-title">Azure DevOps</span>
          <div className="diagram-sync-org-row">
            <span className="diagram-sync-org">Org 1</span>
            <span className="diagram-sync-org">Org 2</span>
          </div>
        </div>

        <div className="diagram-sync-link" data-diagram-el>
          <span className="diagram-sync-link-label">scheduled sync</span>
          <div className="diagram-sync-link-line" />
        </div>

        <div className="diagram-sync-node active" data-diagram-el>
          <span className="diagram-sync-node-title">Portal</span>
          <span className="diagram-sync-node-sub">PostgreSQL</span>
        </div>

        <div className="diagram-sync-link" data-diagram-el>
          <span className="diagram-sync-link-label">drag &amp; drop</span>
          <div className="diagram-sync-link-line" />
        </div>

        <div className="diagram-sync-node" data-diagram-el>
          <span className="diagram-sync-node-title">Kanban board</span>
          <span className="diagram-sync-node-sub">6 statuses</span>
        </div>
      </div>

      <p className="diagram-sync-note" data-diagram-el>
        A status change writes to Azure DevOps first — the local database only updates once Azure confirms it.
      </p>
    </div>
  );
}
