import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as LucideIcons from 'lucide-react';
import { WorkflowNodeData } from '../types/workflow';
import { MetricsCalculator } from '../utils/metricsCalculator';

export const InteractiveNodeCard = memo(({ data, selected, id, position }: NodeProps<WorkflowNodeData>) => {
  const Icon = (LucideIcons as any)[data.icon] || LucideIcons.Circle;
  const hasErrors = data.errors && data.errors.length > 0;
  const hasWarnings = data.warnings && data.warnings.length > 0;
  const isHighlighted = (data as any).highlighted;

  // Generate metrics for this node (in real app would come from execution history)
  const nodeMetrics = {
    executions: Math.floor(Math.random() * 100) + 1,
    successRate: Math.round(Math.random() * 30 + 70),
    avgTime: Math.floor(Math.random() * 300) + 10,
  };

  const getGradient = () => {
    switch (data.type) {
      case 'trigger': return 'from-purple-500 via-purple-600 to-pink-500';
      case 'approval': return 'from-blue-500 via-blue-600 to-cyan-500';
      case 'notification': return 'from-green-500 via-emerald-600 to-teal-500';
      case 'assignment': return 'from-orange-500 via-orange-600 to-red-500';
      case 'condition': return 'from-yellow-500 via-amber-600 to-orange-500';
      case 'delay': return 'from-indigo-500 via-purple-600 to-blue-500';
      case 'integration': return 'from-pink-500 via-rose-600 to-purple-500';
      default: return 'from-gray-500 via-gray-600 to-gray-700';
    }
  };

  const getShadow = () => {
    switch (data.type) {
      case 'trigger': return 'shadow-purple-500/50';
      case 'approval': return 'shadow-blue-500/50';
      case 'notification': return 'shadow-green-500/50';
      case 'assignment': return 'shadow-orange-500/50';
      case 'condition': return 'shadow-yellow-500/50';
      case 'delay': return 'shadow-indigo-500/50';
      case 'integration': return 'shadow-pink-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  return (
    <div className={`
      relative rounded-xl min-w-[240px] overflow-hidden
      transition-all duration-300 backdrop-blur-sm
      ${selected
        ? 'shadow-2xl ring-4 ring-white/50 scale-110 animate-pulse-glow'
        : 'shadow-xl hover:shadow-2xl hover:scale-105'
      }
      ${hasErrors ? 'ring-4 ring-red-500/50' : ''}
      ${hasWarnings && !hasErrors ? 'ring-4 ring-yellow-500/50' : ''}
      ${isHighlighted ? 'ring-4 ring-purple-400/80 scale-110 shadow-2xl' : ''}
    `}>
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-10`} />

      <div className="relative bg-white/90 backdrop-blur-md border-2 border-white/60 rounded-xl px-4 py-3">
        <Handle
          type="target"
          position={Position.Top}
          className={`!bg-gradient-to-br ${getGradient()} !w-4 !h-4 !border-2 !border-white !shadow-lg transition-all hover:scale-150 !rounded-full`}
        />

        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getGradient()} text-white shadow-lg ${getShadow()} transition-transform hover:scale-110 hover:rotate-3`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-900 mb-0.5">{data.label}</p>
            <p className="text-xs text-gray-600 capitalize font-medium bg-gray-100 px-2 py-0.5 rounded-full inline-block">
              {data.type}
            </p>
          </div>
        </div>

        {/* Metrics Badges */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-2 text-center border border-blue-200/50">
            <div className="font-bold text-blue-700 text-sm">{nodeMetrics.executions}</div>
            <div className="text-xs text-blue-600 font-medium">runs</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-2 text-center border border-green-200/50">
            <div className="font-bold text-green-700 text-sm">{nodeMetrics.successRate}%</div>
            <div className="text-xs text-green-600 font-medium">success</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-2 text-center border border-purple-200/50">
            <div className="font-bold text-purple-700 text-sm">{nodeMetrics.avgTime}ms</div>
            <div className="text-xs text-purple-600 font-medium">avg</div>
          </div>
        </div>

        {(hasErrors || hasWarnings) && (
          <div className="absolute -top-3 -right-3 flex gap-1">
            {hasErrors && (
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full p-1.5 shadow-xl shadow-red-500/50 animate-bounce">
                <LucideIcons.AlertCircle size={16} strokeWidth={2.5} />
              </div>
            )}
            {hasWarnings && !hasErrors && (
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full p-1.5 shadow-xl shadow-yellow-500/50 animate-pulse">
                <LucideIcons.AlertTriangle size={16} strokeWidth={2.5} />
              </div>
            )}
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          className={`!bg-gradient-to-br ${getGradient()} !w-4 !h-4 !border-2 !border-white !shadow-lg transition-all hover:scale-150 !rounded-full`}
        />
      </div>
    </div>
  );
});

InteractiveNodeCard.displayName = 'InteractiveNodeCard';
