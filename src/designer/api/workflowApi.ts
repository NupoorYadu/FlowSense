import type { Edge, Node } from 'reactflow';
import type { WorkflowNodeData } from '../types/workflow';

type BackendNodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

interface BackendWorkflowNode {
  id: string;
  type: BackendNodeType;
  metadata: {
    title: string;
    role?: string;
    parameters?: Record<string, unknown>;
  };
}

interface BackendWorkflow {
  nodes: BackendWorkflowNode[];
  edges: Array<{
    source: string;
    target: string;
  }>;
}

export interface ValidationIssue {
  type: 'info' | 'warning' | 'critical';
  message: string;
  affected_nodes: string[];
}

export interface ScoreResponse {
  score: number;
  breakdown: {
    structure: number;
    completeness: number;
    risk: number;
    efficiency: number;
  };
  summary: string;
}

export interface BriefResponse {
  summary: string;
  key_risks: string[];
  suggested_improvements: string[];
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.detail || payload?.message || 'API request failed');
  }

  return payload as T;
};

const mapNodeType = (type: WorkflowNodeData['type']): BackendNodeType => {
  const typeMap: Record<WorkflowNodeData['type'], BackendNodeType> = {
    trigger: 'start',
    approval: 'approval',
    notification: 'task',
    assignment: 'task',
    condition: 'task',
    delay: 'automated',
    integration: 'automated',
  };

  return typeMap[type];
};

export const toBackendWorkflow = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): BackendWorkflow => ({
  nodes: nodes.map((node) => ({
    id: node.id,
    type: mapNodeType(node.data.type),
    metadata: {
      title: node.data.label,
      role: String(node.data.config.approver || node.data.config.assignee || node.data.config.role || ''),
      parameters: node.data.config,
    },
  })),
  edges: edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
  })),
});

export const checkApiHealth = async () => {
  const response = await fetch('/health');
  return parseResponse<{ ok: boolean; service: string }>(response);
};

export const validateWorkflow = async (workflow: BackendWorkflow) => {
  const response = await fetch('/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workflow),
  });
  return parseResponse<{ issues: ValidationIssue[] }>(response);
};

export const scoreWorkflow = async (workflow: BackendWorkflow) => {
  const response = await fetch('/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workflow),
  });
  return parseResponse<ScoreResponse>(response);
};

export const generateBrief = async (workflow: BackendWorkflow) => {
  const response = await fetch('/brief', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workflow),
  });
  return parseResponse<BriefResponse>(response);
};
