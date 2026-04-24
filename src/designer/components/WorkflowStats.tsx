import { Node, Edge } from 'reactflow';
import { WorkflowNodeData } from '../types/workflow';
import { Network, Link, Zap } from 'lucide-react';

interface WorkflowStatsProps {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export function WorkflowStats({ nodes, edges }: WorkflowStatsProps) {
  if (nodes.length === 0) return null;

  const stats = [
    { label: 'Nodes', value: nodes.length, icon: Network, gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/30' },
    { label: 'Connections', value: edges.length, icon: Link, gradient: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/30' },
    { label: 'Steps', value: nodes.length, icon: Zap, gradient: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/30' },
  ];

  return (
    <div className="absolute top-6 left-6 z-10 flex gap-3 animate-in slide-in-from-top-4 duration-500">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl ${stat.shadow} border border-white/60 overflow-hidden animate-in zoom-in duration-300`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            <div className="relative px-4 py-3 flex items-center gap-3">
              <div className={`bg-gradient-to-br ${stat.gradient} p-2 rounded-xl shadow-lg`}>
                <Icon className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className={`text-2xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-xs font-bold text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
