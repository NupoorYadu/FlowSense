import { RiskIssue } from '../types/workflow';
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface RiskInspectorProps {
  issues: RiskIssue[];
  onIssueClick: (nodeId: string) => void;
  onIssueHover: (nodeId: string | null) => void;
}

export function RiskInspector({ issues, onIssueClick, onIssueHover }: RiskInspectorProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  const toggleExpand = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  if (issues.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-green-600 bg-green-50 rounded-lg border border-green-200">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-green-500 text-white rounded-full p-3">
              <AlertCircle size={24} />
            </div>
          </div>
          <p className="font-semibold">No Issues Detected</p>
          <p className="text-sm text-gray-600 mt-1">Your workflow looks good!</p>
        </div>
      </div>
    );
  }

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warnings = issues.filter(i => i.severity === 'warning');
  const info = issues.filter(i => i.severity === 'info');

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Risk Analysis</h3>
        <div className="flex gap-2 text-xs">
          {criticalIssues.length > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
              {criticalIssues.length} Critical
            </span>
          )}
          {warnings.length > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              {warnings.length} Warning
            </span>
          )}
          {info.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {info.length} Info
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {issues.map((issue) => {
          const isExpanded = expandedIssues.has(issue.id);
          const Icon = issue.severity === 'critical' ? AlertCircle :
                      issue.severity === 'warning' ? AlertTriangle : Info;

          const colors = issue.severity === 'critical'
            ? 'border-red-300 bg-red-50 hover:bg-red-100'
            : issue.severity === 'warning'
            ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
            : 'border-blue-300 bg-blue-50 hover:bg-blue-100';

          const iconColor = issue.severity === 'critical'
            ? 'text-red-600'
            : issue.severity === 'warning'
            ? 'text-yellow-600'
            : 'text-blue-600';

          return (
            <div
              key={issue.id}
              className={`border rounded-lg transition-all duration-200 cursor-pointer ${colors}`}
              onMouseEnter={() => onIssueHover(issue.nodeId)}
              onMouseLeave={() => onIssueHover(null)}
            >
              <div
                className="flex items-start gap-3 p-3"
                onClick={() => toggleExpand(issue.id)}
              >
                <Icon className={`flex-shrink-0 mt-0.5 ${iconColor}`} size={18} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                </div>
                {isExpanded ? (
                  <ChevronDown className="flex-shrink-0 text-gray-400" size={16} />
                ) : (
                  <ChevronRight className="flex-shrink-0 text-gray-400" size={16} />
                )}
              </div>

              {isExpanded && issue.suggestion && (
                <div className="px-3 pb-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="bg-white rounded-md p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Suggestion:</p>
                    <p className="text-xs text-gray-600">{issue.suggestion}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onIssueClick(issue.nodeId);
                      }}
                      className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Focus Node
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
