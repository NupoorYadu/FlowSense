import React from 'react';
import * as LucideIcons from 'lucide-react';

interface WorkflowInsight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  icon: string;
  action?: string;
}

interface WorkflowAnalyticsProps {
  insights: WorkflowInsight[];
}

export const WorkflowAnalytics: React.FC<WorkflowAnalyticsProps> = ({ insights }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'from-red-100 to-red-50 border-red-300 bg-red-50';
      case 'warning':
        return 'from-yellow-100 to-yellow-50 border-yellow-300 bg-yellow-50';
      case 'success':
        return 'from-green-100 to-green-50 border-green-300 bg-green-50';
      default:
        return 'from-blue-100 to-blue-50 border-blue-300 bg-blue-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return LucideIcons.AlertTriangle;
      case 'warning':
        return LucideIcons.AlertCircle;
      case 'success':
        return LucideIcons.CheckCircle;
      default:
        return LucideIcons.Info;
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'success':
        return 'text-green-700';
      default:
        return 'text-blue-700';
    }
  };

  return (
    <div className="space-y-3">
      {insights.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-gradient-to-br from-green-100 to-emerald-50 rounded-lg p-6 border border-green-200">
            <LucideIcons.CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-green-700 font-semibold">All Good!</p>
            <p className="text-green-600 text-sm">No issues detected in your workflow</p>
          </div>
        </div>
      ) : (
        insights.map((insight) => {
          const Icon = getSeverityIcon(insight.severity);
          return (
            <div
              key={insight.id}
              className={`bg-gradient-to-br ${getSeverityColor(insight.severity)} rounded-lg p-4 border-2 dotted-border hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getSeverityTextColor(insight.severity)}`} />
                <div className="flex-1">
                  <h4 className={`font-bold ${getSeverityTextColor(insight.severity)}`}>{insight.title}</h4>
                  <p className="text-sm opacity-80 mt-1">{insight.description}</p>
                  {insight.action && (
                    <button className="mt-2 text-xs font-semibold underline hover:no-underline opacity-75 hover:opacity-100">
                      {insight.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

interface PerformanceChartProps {
  data: { label: string; value: number; color: string }[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-xs font-bold text-gray-600">{item.value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${item.color}`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

interface NodeStatsGridProps {
  stats: {
    label: string;
    value: string | number;
    icon: string;
    color: string;
  }[];
}

export const NodeStatsGrid: React.FC<NodeStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, idx) => {
        const Icon = (LucideIcons as any)[stat.icon] || LucideIcons.Square;
        const bgColor = {
          blue: 'from-blue-100 to-blue-50 border-blue-200',
          green: 'from-green-100 to-green-50 border-green-200',
          orange: 'from-orange-100 to-orange-50 border-orange-200',
          purple: 'from-purple-100 to-purple-50 border-purple-200',
          red: 'from-red-100 to-red-50 border-red-200',
          yellow: 'from-yellow-100 to-yellow-50 border-yellow-200',
        }[stat.color as keyof typeof bgColor] || 'from-gray-100 to-gray-50 border-gray-200';

        const textColor = {
          blue: 'text-blue-700',
          green: 'text-green-700',
          orange: 'text-orange-700',
          purple: 'text-purple-700',
          red: 'text-red-700',
          yellow: 'text-yellow-700',
        }[stat.color as keyof typeof textColor] || 'text-gray-700';

        return (
          <div key={idx} className={`bg-gradient-to-br ${bgColor} rounded-lg p-3 border-2 dotted-border`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${textColor}`} />
              <span className="text-xs font-medium text-gray-700">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${textColor}`}>{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
};
