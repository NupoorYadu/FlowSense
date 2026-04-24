import { Node, Edge } from 'reactflow';
import { WorkflowNodeData } from '../types/workflow';
import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';

interface SmartSuggestionsProps {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

interface Suggestion {
  id: string;
  message: string;
  type: 'tip' | 'best-practice' | 'optimization';
}

export function SmartSuggestions({ nodes, edges }: SmartSuggestionsProps) {
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    const approvalNodes = nodes.filter(n => n.data.type === 'approval');
    const notificationNodes = nodes.filter(n => n.data.type === 'notification');

    if (approvalNodes.length > 0 && notificationNodes.length === 0) {
      suggestions.push({
        id: 'add-notification',
        message: 'Consider adding a notification node to inform stakeholders about approval requests',
        type: 'best-practice'
      });
    }

    const delayNodes = nodes.filter(n => n.data.type === 'delay');
    if (delayNodes.length > 0) {
      delayNodes.forEach(node => {
        if (node.data.config.duration > 24 && node.data.config.unit === 'hours') {
          suggestions.push({
            id: `delay-optimization-${node.id}`,
            message: 'Long delays detected. Consider adding a reminder notification before the delay expires',
            type: 'optimization'
          });
        }
      });
    }

    const conditionNodes = nodes.filter(n => n.data.type === 'condition');
    if (conditionNodes.length > 0) {
      conditionNodes.forEach(node => {
        const outgoing = edges.filter(e => e.source === node.id);
        if (outgoing.length < 2) {
          suggestions.push({
            id: `condition-path-${node.id}`,
            message: 'Condition nodes typically have two paths (true and false). Ensure both outcomes are handled',
            type: 'tip'
          });
        }
      });
    }

    if (nodes.length >= 3 && edges.length === 0) {
      suggestions.push({
        id: 'connect-nodes',
        message: 'You have multiple nodes but they are not connected. Connect them to create a workflow',
        type: 'tip'
      });
    }

    return suggestions.filter(s => !dismissedSuggestions.has(s.id));
  };

  const suggestions = generateSuggestions();

  const handleDismiss = (id: string) => {
    setDismissedSuggestions(prev => new Set([...prev, id]));
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-6 z-10 w-96 animate-in slide-in-from-bottom-8 duration-500">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10" />

        <div className="relative p-5 space-y-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2.5 rounded-xl shadow-lg shadow-yellow-500/30">
              <Lightbulb size={20} className="text-white animate-pulse" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Smart Suggestions</h4>
              <p className="text-xs text-gray-600">AI-powered workflow insights</p>
            </div>
          </div>

          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 flex items-start gap-3 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${
                    suggestion.type === 'best-practice'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : suggestion.type === 'optimization'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  }`}>
                    {suggestion.type === 'best-practice' ? '✓ Best Practice' :
                     suggestion.type === 'optimization' ? '⚡ Optimization' : '💡 Tip'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{suggestion.message}</p>
              </div>
              <button
                onClick={() => handleDismiss(suggestion.id)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>
    </div>
  );
}
