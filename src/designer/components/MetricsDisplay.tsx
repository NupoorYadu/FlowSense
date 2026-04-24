import React from 'react';
import { NodeMetrics } from '../utils/metricsCalculator';
import * as LucideIcons from 'lucide-react';

interface MetricsBadgeProps {
  metrics: NodeMetrics;
  compact?: boolean;
}

export const MetricsBadge: React.FC<MetricsBadgeProps> = ({ metrics, compact = false }) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
          {metrics.executionCount}
        </span>
        <span className={`px-2 py-1 rounded-full font-semibold ${getSuccessRateColor(metrics.successRate)} bg-opacity-10`}>
          {Math.round(metrics.successRate)}%
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-2 gap-3">
        {/* Execution Count */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 rounded-lg p-2">
            <LucideIcons.Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Executions</div>
            <div className="font-bold text-blue-600">{metrics.executionCount}</div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="flex items-center gap-2">
          <div className={`rounded-lg p-2 ${getSuccessRateColor(metrics.successRate)} bg-opacity-10`}>
            <LucideIcons.CheckCircle className={`w-4 h-4 ${getSuccessRateColor(metrics.successRate)}`} />
          </div>
          <div>
            <div className="text-xs text-gray-500">Success</div>
            <div className={`font-bold ${getSuccessRateColor(metrics.successRate)}`}>
              {Math.round(metrics.successRate)}%
            </div>
          </div>
        </div>

        {/* Avg Time */}
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 rounded-lg p-2">
            <LucideIcons.Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Avg Time</div>
            <div className="font-bold text-purple-600">{metrics.averageExecutionTime}ms</div>
          </div>
        </div>

        {/* Complexity */}
        <div className="flex items-center gap-2">
          <div className={`rounded-lg p-2 ${getComplexityColor(metrics.complexity)}`}>
            <LucideIcons.Layers className={`w-4 h-4 ${getComplexityColor(metrics.complexity).split(' ')[1]}`} />
          </div>
          <div>
            <div className="text-xs text-gray-500">Complexity</div>
            <div className={`font-bold capitalize ${getComplexityColor(metrics.complexity).split(' ')[1]}`}>
              {metrics.complexity}
            </div>
          </div>
        </div>

        {/* Dependencies */}
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 rounded-lg p-2">
            <LucideIcons.Link className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Dependencies</div>
            <div className="font-bold text-orange-600">{metrics.dependencies}</div>
          </div>
        </div>

        {/* Dependents */}
        <div className="flex items-center gap-2">
          <div className="bg-green-100 rounded-lg p-2">
            <LucideIcons.GitBranch className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Dependents</div>
            <div className="font-bold text-green-600">{metrics.dependents}</div>
          </div>
        </div>
      </div>

      {metrics.lastExecuted && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Last executed: {new Date(metrics.lastExecuted).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

interface WorkflowMetricsDisplayProps {
  overallHealth: number;
  performanceScore: number;
  complexityScore: number;
  totalNodes: number;
  totalEdges: number;
  criticalPaths: number;
}

export const WorkflowMetricsDisplay: React.FC<WorkflowMetricsDisplayProps> = ({
  overallHealth,
  performanceScore,
  complexityScore,
  totalNodes,
  totalEdges,
  criticalPaths,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const MetricCard = ({ label, value, icon: Icon, gradient }: any) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-lg p-4 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-90">{label}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
        </div>
        <Icon className="w-8 h-8 opacity-50" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Health"
          value={`${Math.round(overallHealth)}%`}
          icon={LucideIcons.Heart}
          gradient={getScoreColor(overallHealth)}
        />
        <MetricCard
          label="Performance"
          value={`${Math.round(performanceScore)}%`}
          icon={LucideIcons.Zap}
          gradient={getScoreColor(performanceScore)}
        />
        <MetricCard
          label="Complexity"
          value={`${Math.round(complexityScore)}%`}
          icon={LucideIcons.GitBranch}
          gradient={getScoreColor(complexityScore)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalNodes}</div>
          <div className="text-sm text-gray-600">Nodes</div>
        </div>
        <div className="text-center border-l border-r border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{totalEdges}</div>
          <div className="text-sm text-gray-600">Connections</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{criticalPaths}</div>
          <div className="text-sm text-gray-600">Paths</div>
        </div>
      </div>
    </div>
  );
};
