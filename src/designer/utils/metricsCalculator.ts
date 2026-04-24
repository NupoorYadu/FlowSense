import { Node } from 'reactflow';
import { WorkflowNodeData } from '../types/workflow';

export interface NodeMetrics {
  nodeId: string;
  executionCount: number;
  averageExecutionTime: number;
  successRate: number;
  errorRate: number;
  lastExecuted: string | null;
  dependencies: number;
  dependents: number;
  complexity: 'low' | 'medium' | 'high';
}

export interface WorkflowMetrics {
  totalNodes: number;
  totalEdges: number;
  averageDepth: number;
  criticalPaths: number;
  nodeMetrics: Map<string, NodeMetrics>;
  overallHealth: number; // 0-100
  performanceScore: number; // 0-100
  complexityScore: number; // 0-100
}

export class MetricsCalculator {
  static calculateNodeMetrics(
    nodeId: string,
    nodes: Node<WorkflowNodeData>[],
    edges: any[]
  ): NodeMetrics {
    const incomingEdges = edges.filter((e) => e.target === nodeId).length;
    const outgoingEdges = edges.filter((e) => e.source === nodeId).length;

    // Simulate metrics (in real app, would come from execution history)
    return {
      nodeId,
      executionCount: Math.floor(Math.random() * 100) + 1,
      averageExecutionTime: Math.floor(Math.random() * 300) + 10,
      successRate: Math.random() * 30 + 70,
      errorRate: Math.random() * 10,
      lastExecuted: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      dependencies: incomingEdges,
      dependents: outgoingEdges,
      complexity: this.calculateComplexity(incomingEdges + outgoingEdges),
    };
  }

  static calculateComplexity(connectionCount: number): 'low' | 'medium' | 'high' {
    if (connectionCount <= 2) return 'low';
    if (connectionCount <= 4) return 'medium';
    return 'high';
  }

  static calculateWorkflowMetrics(
    nodes: Node<WorkflowNodeData>[],
    edges: any[]
  ): WorkflowMetrics {
    const nodeMetrics = new Map<string, NodeMetrics>();
    const depths: number[] = [];

    nodes.forEach((node) => {
      const metrics = this.calculateNodeMetrics(node.id, nodes, edges);
      nodeMetrics.set(node.id, metrics);

      const depth = this.calculateNodeDepth(node.id, edges);
      depths.push(depth);
    });

    const averageDepth = depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;
    const criticalPaths = this.findCriticalPaths(nodes, edges);

    // Calculate scores
    const healthScore = nodes.length === 0 ? 100 : Math.min(100, 100 - nodeMetrics.size * 5);
    const performanceScore = nodeMetrics.size === 0 ? 100 : Math.max(
      0,
      100 - Array.from(nodeMetrics.values()).reduce((sum, m) => sum + m.errorRate, 0) / nodeMetrics.size
    );
    const complexityScore = nodes.length === 0 ? 100 : Math.max(
      0,
      100 - (averageDepth * 10 + nodes.length * 2)
    );

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      averageDepth,
      criticalPaths,
      nodeMetrics,
      overallHealth: healthScore,
      performanceScore,
      complexityScore,
    };
  }

  private static calculateNodeDepth(nodeId: string, edges: any[]): number {
    let maxDepth = 0;
    const visited = new Set<string>();

    const traverse = (id: string, depth: number) => {
      if (visited.has(id)) return;
      visited.add(id);

      maxDepth = Math.max(maxDepth, depth);

      const outgoing = edges.filter((e) => e.source === id);
      outgoing.forEach((edge) => {
        traverse(edge.target, depth + 1);
      });
    };

    traverse(nodeId, 0);
    return maxDepth;
  }

  private static findCriticalPaths(nodes: Node<WorkflowNodeData>[], edges: any[]): number {
    // Simplified: count paths from start to end nodes
    const startNodes = nodes.filter((n) => n.data?.type === 'trigger').map((n) => n.id);
    const endNodes = nodes.filter((n) => n.data?.type === 'end').map((n) => n.id);

    let pathCount = 0;
    const findPaths = (current: string, visited: Set<string>): boolean => {
      if (visited.has(current)) return false;
      if (endNodes.includes(current)) {
        pathCount++;
        return true;
      }

      visited.add(current);
      const outgoing = edges.filter((e) => e.source === current);

      for (const edge of outgoing) {
        findPaths(edge.target, new Set(visited));
      }
      return false;
    };

    startNodes.forEach((start) => findPaths(start, new Set()));
    return Math.max(1, pathCount);
  }

  static formatMetric(value: number, type: 'time' | 'percentage' | 'count' = 'count'): string {
    switch (type) {
      case 'time':
        return `${Math.round(value)}ms`;
      case 'percentage':
        return `${Math.round(value)}%`;
      case 'count':
      default:
        return Math.round(value).toString();
    }
  }
}
