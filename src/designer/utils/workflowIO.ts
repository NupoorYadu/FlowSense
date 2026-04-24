import { Node, Edge } from 'reactflow';
import { WorkflowNodeData } from '../types/workflow';

export interface WorkflowExport {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  metadata: {
    description: string;
    author: string;
    tags: string[];
  };
}

export const exportWorkflow = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  name: string = 'workflow',
  description: string = ''
): WorkflowExport => {
  return {
    id: `workflow_${Date.now()}`,
    name,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes,
    edges,
    metadata: {
      description,
      author: 'Workflow Designer',
      tags: ['hr', 'automation'],
    },
  };
};

export const importWorkflow = (data: WorkflowExport): [Node<WorkflowNodeData>[], Edge[]] => {
  return [data.nodes, data.edges];
};

export const downloadWorkflow = (workflow: WorkflowExport, filename?: string) => {
  const dataStr = JSON.stringify(workflow, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${workflow.name}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const uploadWorkflow = (): Promise<WorkflowExport> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      try {
        const text = await file.text();
        const workflow = JSON.parse(text) as WorkflowExport;
        resolve(workflow);
      } catch (error) {
        reject(new Error('Invalid workflow file'));
      }
    };
    input.click();
  });
};

export const serializeWorkflow = (nodes: Node<WorkflowNodeData>[], edges: Edge[]): string => {
  return JSON.stringify({ nodes, edges }, null, 2);
};

export const deserializeWorkflow = (data: string): [Node<WorkflowNodeData>[], Edge[]] => {
  const parsed = JSON.parse(data);
  return [parsed.nodes, parsed.edges];
};
