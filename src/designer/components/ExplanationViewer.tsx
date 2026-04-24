import { Node, Edge } from 'reactflow';
import { WorkflowNodeData } from '../types/workflow';
import { useState } from 'react';

interface ExplanationViewerProps {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodeHover: (nodeId: string | null) => void;
}

export function ExplanationViewer({ nodes, edges, onNodeHover }: ExplanationViewerProps) {
  const [hoveredSentence, setHoveredSentence] = useState<number | null>(null);

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl mb-4">
          <svg className="w-16 h-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Add nodes to see workflow explanation</p>
        <p className="text-gray-400 text-sm mt-1">Live narrative updates automatically</p>
      </div>
    );
  }

  const generateExplanation = () => {
    const sentences: { text: string; nodeId: string }[] = [];

    const triggerNode = nodes.find(n => n.data.type === 'trigger');
    if (triggerNode) {
      sentences.push({
        text: `This workflow starts when ${triggerNode.data.config.event || 'an event'} occurs.`,
        nodeId: triggerNode.id
      });
    }

    const sortedNodes = [...nodes].sort((a, b) => {
      const aY = a.position.y;
      const bY = b.position.y;
      return aY - bY;
    });

    sortedNodes.forEach((node, idx) => {
      if (node.data.type === 'trigger') return;

      switch (node.data.type) {
        case 'approval':
          sentences.push({
            text: `Then, an approval request is sent to ${node.data.config.approver || 'a designated approver'} with a ${node.data.config.timeout || 48}-hour timeout.`,
            nodeId: node.id
          });
          break;
        case 'notification':
          sentences.push({
            text: `A notification is sent via ${node.data.config.channel || 'email'}.`,
            nodeId: node.id
          });
          break;
        case 'assignment':
          sentences.push({
            text: `A task is assigned to ${node.data.config.assignee || 'a team member'} with ${node.data.config.priority || 'medium'} priority.`,
            nodeId: node.id
          });
          break;
        case 'condition':
          sentences.push({
            text: `The workflow checks if ${node.data.config.condition || 'a condition'} is met and branches accordingly.`,
            nodeId: node.id
          });
          break;
        case 'delay':
          sentences.push({
            text: `The workflow waits for ${node.data.config.duration || 1} ${node.data.config.unit || 'hours'}.`,
            nodeId: node.id
          });
          break;
        case 'integration':
          sentences.push({
            text: `The system connects to ${node.data.config.system || 'an external system'} to perform ${node.data.config.action || 'an action'}.`,
            nodeId: node.id
          });
          break;
      }
    });

    return sentences;
  };

  const explanation = generateExplanation();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200/50">
        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1.5 rounded-lg">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          Workflow Explanation
        </h3>
        <p className="text-xs text-gray-600">Hover to highlight nodes</p>
      </div>

      <div className="space-y-3">
        {explanation.map((sentence, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${
              hoveredSentence === idx
                ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-xl shadow-blue-500/30 scale-105'
                : 'bg-gradient-to-br from-white to-gray-50 hover:shadow-lg border border-gray-200'
            }`}
            onMouseEnter={() => {
              setHoveredSentence(idx);
              onNodeHover(sentence.nodeId);
            }}
            onMouseLeave={() => {
              setHoveredSentence(null);
              onNodeHover(null);
            }}
          >
            <div className="relative p-4 flex items-start gap-3">
              <div className={`
                flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-sm shadow-lg
                ${hoveredSentence === idx
                  ? 'bg-white text-blue-600'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                }
              `}>
                {idx + 1}
              </div>
              <p className={`text-sm leading-relaxed ${hoveredSentence === idx ? 'text-white' : 'text-gray-700'}`}>
                {sentence.text}
              </p>
            </div>
            {hoveredSentence === idx && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
