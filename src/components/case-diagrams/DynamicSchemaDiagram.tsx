export default function DynamicSchemaDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">Dynamic Schema</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-schema-row">
        <div className="diagram-code-card" data-diagram-el>
          <span className="diagram-card-tag">config.json</span>
          <div className="diagram-code-line">{'{'}</div>
          <div className="diagram-code-line">
            &nbsp;&nbsp;<span className="diagram-key">"vessel_voyage"</span>
            <span className="diagram-punc">:</span> <span className="diagram-val">"text"</span>
            <span className="diagram-punc">,</span>
          </div>
          <div className="diagram-code-line">
            &nbsp;&nbsp;<span className="diagram-key">"loading_port"</span>
            <span className="diagram-punc">:</span> <span className="diagram-val">"text"</span>
            <span className="diagram-punc">,</span>
          </div>
          <div className="diagram-code-line new">
            &nbsp;&nbsp;<span className="diagram-key">"seal_number"</span>
            <span className="diagram-punc">:</span> <span className="diagram-val">"text"</span>
          </div>
          <div className="diagram-code-line">{'}'}</div>
        </div>

        <div className="diagram-sync" data-diagram-el>
          <span className="diagram-sync-badge">Auto-sync</span>
          <div className="diagram-sync-line" />
        </div>

        <div className="diagram-table-card" data-diagram-el>
          <span className="diagram-card-tag">miniapp_&lt;id&gt; table</span>
          <div className="diagram-col-pills">
            <span className="diagram-col-pill">vessel_voyage</span>
            <span className="diagram-col-pill">loading_port</span>
            <span className="diagram-col-pill new">seal_number</span>
          </div>
        </div>
      </div>
    </div>
  );
}
