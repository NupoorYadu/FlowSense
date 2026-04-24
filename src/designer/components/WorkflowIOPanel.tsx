import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Node, Edge } from 'reactflow';
import { WorkflowNodeData } from '../types/workflow';
import { exportWorkflow, downloadWorkflow, uploadWorkflow, WorkflowExport } from '../utils/workflowIO';

interface WorkflowIOPanelProps {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onImport: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void;
}

export const WorkflowIOPanel: React.FC<WorkflowIOPanelProps> = ({ nodes, edges, onImport }) => {
  const [workflowName, setWorkflowName] = useState('my-workflow');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentWorkflows, setRecentWorkflows] = useState<WorkflowExport[]>(() => {
    const saved = localStorage.getItem('recent-workflows');
    return saved ? JSON.parse(saved) : [];
  });

  const handleExport = async () => {
    const workflow = exportWorkflow(nodes, edges, workflowName, description);

    // Save to recent workflows
    const updated = [workflow, ...recentWorkflows].slice(0, 5);
    localStorage.setItem('recent-workflows', JSON.stringify(updated));
    setRecentWorkflows(updated);

    downloadWorkflow(workflow, `${workflowName}.json`);
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      const workflow = await uploadWorkflow();
      onImport(workflow.nodes, workflow.edges);

      // Add to recent
      const updated = [workflow, ...recentWorkflows].slice(0, 5);
      localStorage.setItem('recent-workflows', JSON.stringify(updated));
      setRecentWorkflows(updated);
    } catch (error) {
      alert('Failed to import workflow: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadRecent = (workflow: WorkflowExport) => {
    onImport(workflow.nodes, workflow.edges);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LucideIcons.FileUp className="w-5 h-5" />
          Workflow Management
        </h3>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Workflow Name</label>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="e.g., onboarding-flow"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your workflow..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <button
          onClick={handleExport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LucideIcons.Download className="w-4 h-4" />
          Export as JSON
        </button>
      </div>

      {/* Import Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        <button
          onClick={handleImport}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LucideIcons.Upload className="w-4 h-4" />
          {isLoading ? 'Loading...' : 'Import from JSON'}
        </button>
      </div>

      {/* Recent Workflows */}
      {recentWorkflows.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Recent Workflows</h4>
          <div className="space-y-2">
            {recentWorkflows.map((workflow) => (
              <button
                key={workflow.id}
                onClick={() => handleLoadRecent(workflow)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{workflow.name}</div>
                    <div className="text-xs text-gray-500 truncate">{workflow.metadata.description}</div>
                  </div>
                  <LucideIcons.ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Copy JSON Section */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
          <LucideIcons.Code2 className="w-4 h-4" />
          Share as JSON
        </h4>
        <button
          onClick={() => {
            const workflow = exportWorkflow(nodes, edges, workflowName, description);
            navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
            alert('Workflow JSON copied to clipboard!');
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};
