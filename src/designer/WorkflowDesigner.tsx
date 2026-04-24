import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeMouseHandler,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import * as LucideIcons from 'lucide-react';
import { InteractiveNodeCard } from './components/InteractiveNodeCard';
import { SmartSidebarItem } from './components/SmartSidebarItem';
import { LiveFormPanel } from './components/LiveFormPanel';
import { ExplanationViewer } from './components/ExplanationViewer';
import { RiskInspector } from './components/RiskInspector';
import { SimulationTimeline } from './components/SimulationTimeline';
import { SmartSuggestions } from './components/SmartSuggestions';
import { WelcomeOverlay } from './components/WelcomeOverlay';
import { EmptyCanvasState } from './components/EmptyCanvasState';
import { WorkflowStats } from './components/WorkflowStats';
import { NODE_DEFINITIONS } from './config/nodeDefinitions';
import { WorkflowNodeData, NodeDefinition, RiskIssue, SimulationStep } from './types/workflow';

const nodeTypes = Object.freeze({
  custom: InteractiveNodeCard,
});

const tabs = [
  { value: 'configuration', label: 'Configuration', icon: LucideIcons.Settings2, accent: 'blue' },
  { value: 'explanation', label: 'Explanation', icon: LucideIcons.FileText, accent: 'purple' },
  { value: 'risks', label: 'Risks', icon: LucideIcons.Shield, accent: 'orange' },
  { value: 'simulation', label: 'Simulation', icon: LucideIcons.Play, accent: 'green' },
];

const getTabClasses = (accent: string, isActive: boolean) => {
  const activeText = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    green: 'text-green-600',
  }[accent] || 'text-blue-600';

  return `relative px-4 py-2.5 text-sm font-bold transition-all hover:text-gray-900 ${isActive ? activeText : 'text-gray-600'}`;
};

const getTabIndicatorClasses = (accent: string, isActive: boolean) => {
  const gradient = {
    blue: 'from-blue-600 to-indigo-600 shadow-blue-500/50',
    purple: 'from-purple-600 to-pink-600 shadow-purple-500/50',
    orange: 'from-orange-600 to-red-600 shadow-orange-500/50',
    green: 'from-green-600 to-emerald-600 shadow-green-500/50',
  }[accent] || 'from-blue-600 to-indigo-600 shadow-blue-500/50';

  return `absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} rounded-full shadow-lg transition-transform ${isActive ? 'scale-x-100' : 'scale-x-0'}`;
};

export function WorkflowDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('configuration');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('workflow-designer-welcome-seen') !== 'true');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const idCounter = useRef(1);

  const closeWelcome = useCallback(() => {
    localStorage.setItem('workflow-designer-welcome-seen', 'true');
    setShowWelcome(false);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: {
          stroke: '#6366f1',
          strokeWidth: 3,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDraggingOver(false);

      const definitionData = event.dataTransfer.getData('application/reactflow');
      if (!definitionData) return;

      const definition: NodeDefinition = JSON.parse(definitionData);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<WorkflowNodeData> = {
        id: `node-${idCounter.current++}`,
        type: 'custom',
        position,
        data: {
          label: definition.label,
          type: definition.type,
          icon: definition.icon,
          config: { ...definition.defaultConfig },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node as Node<WorkflowNodeData>);
    setActiveTab('configuration');
  }, []);

  const onNodeMouseEnter: NodeMouseHandler = useCallback((_, node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const onDragStart = (event: React.DragEvent, definition: NodeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(definition));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleConfigChange = useCallback(
    (config: Record<string, any>) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? {
                ...node,
                data: { ...node.data, config },
              }
            : node
        )
      );

      setSelectedNode((prev) =>
        prev
          ? {
              ...prev,
              data: { ...prev.data, config },
            }
          : null
      );
    },
    [selectedNode, setNodes]
  );

  const validateWorkflow = useCallback((): RiskIssue[] => {
    const issues: RiskIssue[] = [];

    const triggerNodes = nodes.filter((n) => n.data.type === 'trigger');
    if (triggerNodes.length === 0) {
      issues.push({
        id: 'no-trigger',
        severity: 'critical',
        nodeId: '',
        message: 'Workflow has no trigger node',
        suggestion: 'Add a trigger node to start the workflow',
      });
    } else if (triggerNodes.length > 1) {
      issues.push({
        id: 'multiple-triggers',
        severity: 'warning',
        nodeId: triggerNodes[1].id,
        message: 'Multiple trigger nodes detected',
        suggestion: 'Consider using a single trigger node',
      });
    }

    nodes.forEach((node) => {
      if (node.data.type === 'approval' && !node.data.config.approver) {
        issues.push({
          id: `approval-${node.id}`,
          severity: 'critical',
          nodeId: node.id,
          message: 'Approval node missing approver',
          suggestion: 'Configure an approver for this approval step',
        });
      }

      if (node.data.type === 'condition' && !node.data.config.condition) {
        issues.push({
          id: `condition-${node.id}`,
          severity: 'warning',
          nodeId: node.id,
          message: 'Condition node has no condition defined',
          suggestion: 'Define a condition to evaluate',
        });
      }

      const outgoingEdges = edges.filter((e) => e.source === node.id);
      if (outgoingEdges.length === 0 && node.data.type !== 'notification' && node.data.type !== 'assignment') {
        issues.push({
          id: `disconnected-${node.id}`,
          severity: 'info',
          nodeId: node.id,
          message: `${node.data.label} has no outgoing connections`,
          suggestion: 'Connect this node to continue the workflow',
        });
      }
    });

    return issues;
  }, [nodes, edges]);

  const generateSimulationSteps = useCallback((): SimulationStep[] => {
    if (nodes.length === 0) return [];

    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);

    return sortedNodes.map((node, idx) => ({
      id: `step-${idx}`,
      nodeId: node.id,
      label: node.data.label,
      status: 'pending' as const,
    }));
  }, [nodes]);

  const handleIssueClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setHighlightedNodeId(nodeId);
      setTimeout(() => setHighlightedNodeId(null), 2000);
    }
  };

  const handleSimulationStepChange = (stepIndex: number) => {
    const steps = generateSimulationSteps();
    if (steps[stepIndex]) {
      setHighlightedNodeId(steps[stepIndex].nodeId);
    }
  };

  const issues = validateWorkflow();
  const simulationSteps = generateSimulationSteps();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedNode) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
          setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
          setSelectedNode(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, setNodes, setEdges]);

  const getConnectedNodeIds = useCallback((nodeId: string): Set<string> => {
    const connected = new Set<string>([nodeId]);

    const addUpstream = (id: string) => {
      edges.filter(e => e.target === id).forEach(e => {
        if (!connected.has(e.source)) {
          connected.add(e.source);
          addUpstream(e.source);
        }
      });
    };

    const addDownstream = (id: string) => {
      edges.filter(e => e.source === id).forEach(e => {
        if (!connected.has(e.target)) {
          connected.add(e.target);
          addDownstream(e.target);
        }
      });
    };

    addUpstream(nodeId);
    addDownstream(nodeId);

    return connected;
  }, [edges]);

  const pathHighlightedNodeIds = hoveredNodeId ? getConnectedNodeIds(hoveredNodeId) : new Set<string>();

  const highlightedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      highlighted: node.id === highlightedNodeId,
    },
    style: {
      ...node.style,
      opacity: hoveredNodeId ? (pathHighlightedNodeIds.has(node.id) ? 1 : 0.3) : 1,
    },
  }));

  const highlightedEdges = edges.map((edge) => ({
    ...edge,
    animated: edge.animated || (hoveredNodeId ? pathHighlightedNodeIds.has(edge.source) && pathHighlightedNodeIds.has(edge.target) : false),
    style: {
      ...edge.style,
      opacity: hoveredNodeId ? (pathHighlightedNodeIds.has(edge.source) && pathHighlightedNodeIds.has(edge.target) ? 1 : 0.2) : 1,
      strokeWidth: hoveredNodeId && pathHighlightedNodeIds.has(edge.source) && pathHighlightedNodeIds.has(edge.target) ? 3 : 2,
    },
  }));

  return (
    <>
      {showWelcome && <WelcomeOverlay onClose={closeWelcome} />}
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMS0yLjY5LTYtNi02cy02IDIuNjktNiA2YzAgMy4zMSAyLjY5IDYgNiA2czYtMi42OSA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

      <div className="relative w-64 bg-white/80 backdrop-blur-xl border-r border-white/60 shadow-2xl p-4 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
              <LucideIcons.Workflow className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Workflow Designer
              </h2>
            </div>
          </div>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <LucideIcons.Sparkles size={14} className="text-yellow-500" />
            Drag nodes to canvas
          </p>
        </div>

        <div className="space-y-2">
          {NODE_DEFINITIONS.map((definition) => (
            <SmartSidebarItem
              key={definition.type}
              definition={definition}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <div className={`absolute inset-0 transition-all duration-500 ${isDraggingOver ? 'bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10' : ''}`} />

        <ReactFlow
          nodes={highlightedNodes}
          edges={highlightedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          nodeTypes={nodeTypes}
          fitView
          className="transition-all duration-300"
        >
          <Background
            color="#cbd5e1"
            gap={20}
            size={1.5}
            className="opacity-30"
          />
          <Controls className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-xl shadow-2xl !shadow-blue-500/20" />
          <MiniMap
            className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-xl shadow-2xl !shadow-indigo-500/20"
            nodeColor={(node) => {
              const data = node.data as WorkflowNodeData;
              switch (data.type) {
                case 'trigger': return '#a855f7';
                case 'approval': return '#3b82f6';
                case 'notification': return '#10b981';
                case 'assignment': return '#f97316';
                case 'condition': return '#eab308';
                case 'delay': return '#6366f1';
                case 'integration': return '#ec4899';
                default: return '#6b7280';
              }
            }}
            maskColor="rgb(240, 240, 255, 0.8)"
          />
        </ReactFlow>

        <WorkflowStats nodes={nodes} edges={edges} />
        {nodes.length === 0 && !isDraggingOver && <EmptyCanvasState />}

        {isDraggingOver && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl text-xl font-bold animate-bounce border-4 border-white/50">
              <div className="flex items-center gap-3">
                <LucideIcons.Sparkles className="animate-spin" size={24} />
                Drop to add node
                <LucideIcons.Sparkles className="animate-spin" size={24} />
              </div>
            </div>
          </div>
        )}
        <SmartSuggestions nodes={nodes} edges={edges} />
      </div>

      <div className="relative w-96 bg-white/80 backdrop-blur-xl border-l border-white/60 shadow-2xl overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 pointer-events-none" />

        <div className="relative flex flex-col h-full">
          <div className="flex border-b border-white/60 bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm px-4 pt-4 shadow-sm overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={getTabClasses(tab.accent, isActive)}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon size={16} />
                    {tab.label}
                    {tab.value === 'risks' && issues.length > 0 && (
                      <span className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-red-500/50 animate-pulse">
                        {issues.length}
                      </span>
                    )}
                  </span>
                  <div className={getTabIndicatorClasses(tab.accent, isActive)} />
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'configuration' && (
              <LiveFormPanel nodeData={selectedNode?.data || null} onConfigChange={handleConfigChange} />
            )}

            {activeTab === 'explanation' && (
              <ExplanationViewer
                nodes={nodes}
                edges={edges}
                onNodeHover={(nodeId) => setHighlightedNodeId(nodeId)}
              />
            )}

            {activeTab === 'risks' && (
              <RiskInspector
                issues={issues}
                onIssueClick={handleIssueClick}
                onIssueHover={(nodeId) => setHighlightedNodeId(nodeId)}
              />
            )}

            {activeTab === 'simulation' && (
              <SimulationTimeline
                steps={simulationSteps}
                onStepChange={handleSimulationStepChange}
                onActiveNodeChange={(nodeId) => setHighlightedNodeId(nodeId)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
