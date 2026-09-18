import VisualBuilderDiagram from './VisualBuilderDiagram';
import DynamicSchemaDiagram from './DynamicSchemaDiagram';
import ExportPipelineDiagram from './ExportPipelineDiagram';
import RoleViewsDiagram from './RoleViewsDiagram';
import TwoWaySyncDiagram from './TwoWaySyncDiagram';
import BeyondTicketDiagram from './BeyondTicketDiagram';
import ExportToLocationDiagram from './ExportToLocationDiagram';
import HealthMonitoringDiagram from './HealthMonitoringDiagram';
import BeyondMonitoringDiagram from './BeyondMonitoringDiagram';
import TenantIsolationDiagram from './TenantIsolationDiagram';
import RedFlagScoringDiagram from './RedFlagScoringDiagram';
import BeyondAssessmentDiagram from './BeyondAssessmentDiagram';

export const caseDiagrams = {
  builder: VisualBuilderDiagram,
  schema: DynamicSchemaDiagram,
  export: ExportPipelineDiagram,
  roles: RoleViewsDiagram,
  sync: TwoWaySyncDiagram,
  features: BeyondTicketDiagram,
  exportToLocation: ExportToLocationDiagram,
  monitoring: HealthMonitoringDiagram,
  beyondMonitoring: BeyondMonitoringDiagram,
  isolation: TenantIsolationDiagram,
  redFlag: RedFlagScoringDiagram,
  beyondAssessment: BeyondAssessmentDiagram,
} as const;

export type CaseDiagramKey = keyof typeof caseDiagrams;
