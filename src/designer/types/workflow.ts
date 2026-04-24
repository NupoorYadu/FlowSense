export type NodeType = 'trigger' | 'approval' | 'notification' | 'assignment' | 'condition' | 'delay' | 'integration';

export interface WorkflowNodeData {
  label: string;
  type: NodeType;
  icon: string;
  config: Record<string, any>;
  valid?: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface RiskIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  nodeId: string;
  message: string;
  suggestion?: string;
}

export interface SimulationStep {
  id: string;
  nodeId: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  timestamp?: number;
}

export interface NodeDefinition {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
  defaultConfig: Record<string, any>;
  color: string;
}
