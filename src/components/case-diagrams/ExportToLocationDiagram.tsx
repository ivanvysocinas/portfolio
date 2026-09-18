export default function ExportToLocationDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">Every Export Becomes a Monitored Location</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-schema-row">
        <div className="diagram-code-card" data-diagram-el>
          <span className="diagram-card-tag">.diconfig-export.json</span>
          <div className="diagram-code-line">{'{'}</div>
          <div className="diagram-code-line">
            &nbsp;&nbsp;<span className="diagram-key">"version"</span>
            <span className="diagram-punc">:</span> <span className="diagram-val">"2.1.0"</span>
            <span className="diagram-punc">,</span>
          </div>
          <div className="diagram-code-line">
            &nbsp;&nbsp;<span className="diagram-key">"ports"</span>
            <span className="diagram-punc">:</span> <span className="diagram-val">&#123; web: 8080 &#125;</span>
          </div>
          <div className="diagram-code-line">{'}'}</div>
        </div>

        <div className="diagram-sync" data-diagram-el>
          <span className="diagram-sync-badge">Auto-parsed</span>
          <div className="diagram-sync-line" />
        </div>

        <div className="diagram-table-card" data-diagram-el>
          <span className="diagram-card-tag">Location record</span>
          <div className="diagram-col-pills">
            <span className="diagram-col-pill">REGION-Country-City-1</span>
            <span className="diagram-col-pill new">● online</span>
            <span className="diagram-col-pill">git · versioned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
