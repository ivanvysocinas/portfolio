export default function RedFlagScoringDiagram() {
  return (
    <div className="diagram-panel">
      <div className="diagram-head" data-diagram-el>
        <span className="diagram-label">A Score Nobody Can Quietly Override</span>
        <div className="diagram-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="diagram-schema-row">
        <div className="diagram-code-card" data-diagram-el>
          <span className="diagram-card-tag">Weighted categories</span>
          <div className="diagram-code-line">
            <span className="diagram-key">Compliance</span> <span className="diagram-punc">·</span> <span className="diagram-val">40%</span>
          </div>
          <div className="diagram-code-line">
            <span className="diagram-key">Financial</span> <span className="diagram-punc">·</span> <span className="diagram-val">35%</span>
          </div>
          <div className="diagram-code-line new">
            <span className="diagram-key">Safety answer</span> <span className="diagram-punc">·</span> <span className="diagram-val">flagged</span>
          </div>
        </div>

        <div className="diagram-sync" data-diagram-el>
          <span className="diagram-sync-badge">Overrides</span>
          <div className="diagram-sync-line" />
        </div>

        <div className="diagram-table-card" data-diagram-el>
          <span className="diagram-card-tag">Final tier</span>
          <div className="diagram-col-pills">
            <span className="diagram-col-pill new">High risk</span>
            <span className="diagram-col-pill">overridden</span>
            <span className="diagram-col-pill">no manual edit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
