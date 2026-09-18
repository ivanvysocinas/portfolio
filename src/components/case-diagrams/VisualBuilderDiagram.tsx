export default function VisualBuilderDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">Visual App Builder</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-flow">
        <div className="diagram-node" data-diagram-el>
          <span className="diagram-node-title">Screen</span>
          <div className="diagram-node-bars">
            <div className="diagram-bar" style={{ width: '80%' }} />
            <div className="diagram-bar" style={{ width: '55%' }} />
          </div>
        </div>
        <div className="diagram-connector" data-diagram-el />
        <div className="diagram-node active" data-diagram-el>
          <span className="diagram-node-title">Widget</span>
          <div className="diagram-node-bars">
            <div className="diagram-bar fill" style={{ width: '90%' }} />
            <div className="diagram-bar" style={{ width: '60%' }} />
          </div>
        </div>
        <div className="diagram-connector" data-diagram-el />
        <div className="diagram-node" data-diagram-el>
          <span className="diagram-node-title">Logic</span>
          <div className="diagram-node-bars">
            <div className="diagram-bar" style={{ width: '70%' }} />
            <div className="diagram-bar" style={{ width: '40%' }} />
          </div>
        </div>
        <div className="diagram-connector" data-diagram-el />
        <div className="diagram-node active" data-diagram-el>
          <span className="diagram-node-title">Scenario</span>
          <div className="diagram-node-bars">
            <div className="diagram-bar fill" style={{ width: '85%' }} />
            <div className="diagram-bar" style={{ width: '65%' }} />
          </div>
        </div>
      </div>

      <div className="diagram-stats-row">
        <div className="diagram-stat-box" data-diagram-el>
          <div className="diagram-stat-num"><span>10+</span> clients</div>
          <div className="diagram-stat-cap">Onboarded without new code</div>
        </div>
        <div className="diagram-stat-box" data-diagram-el>
          <div className="diagram-stat-num"><span>100s</span> of reports</div>
          <div className="diagram-stat-cap">Generated straight to XLSX/PDF</div>
        </div>
        <div className="diagram-stat-box" data-diagram-el>
          <div className="diagram-stat-num"><span>GBs</span> of data</div>
          <div className="diagram-stat-cap">Submissions &amp; photo evidence</div>
        </div>
      </div>
    </div>
  );
}
