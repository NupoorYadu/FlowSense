import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { NodeDefinition } from '../types/workflow';
import { Sparkles } from 'lucide-react';

interface SmartSidebarItemProps {
  definition: NodeDefinition;
  onDragStart: (event: React.DragEvent, definition: NodeDefinition) => void;
}

export function SmartSidebarItem({ definition, onDragStart }: SmartSidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = (LucideIcons as any)[definition.icon] || LucideIcons.Circle;

  const getGradient = () => {
    switch (definition.type) {
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
    switch (definition.type) {
      case 'trigger': return 'shadow-purple-500/30';
      case 'approval': return 'shadow-blue-500/30';
      case 'notification': return 'shadow-green-500/30';
      case 'assignment': return 'shadow-orange-500/30';
      case 'condition': return 'shadow-yellow-500/30';
      case 'delay': return 'shadow-indigo-500/30';
      case 'integration': return 'shadow-pink-500/30';
      default: return 'shadow-gray-500/30';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, definition)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-grab active:cursor-grabbing group"
    >
      <div className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden
        transition-all duration-300 backdrop-blur-sm
        ${isHovered ? 'scale-105 shadow-xl' : 'shadow-md hover:shadow-lg'}
      `}>
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-5 transition-opacity ${isHovered ? 'opacity-10' : ''}`} />

        <div className="relative flex items-center gap-3 w-full">
          <div className={`
            bg-gradient-to-br ${getGradient()} p-2.5 rounded-lg text-white
            shadow-lg ${getShadow()}
            transition-all duration-300
            ${isHovered ? 'scale-110 rotate-6 shadow-xl' : ''}
          `}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900">{definition.label}</p>
            <p className="text-xs text-gray-500 truncate">{definition.description}</p>
          </div>
          {isHovered && (
            <Sparkles className="text-yellow-500 animate-pulse" size={16} />
          )}
        </div>

        {isHovered && (
          <div className={`absolute inset-0 bg-gradient-to-r ${getGradient()} opacity-5 animate-pulse`} />
        )}
      </div>

      {isHovered && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 w-72 animate-in fade-in slide-in-from-left-2 duration-200">
          <div className={`relative bg-gradient-to-br ${getGradient()} p-4 rounded-xl shadow-2xl`}>
            <div className="absolute inset-0 bg-black/20 rounded-xl" />
            <div className="relative text-white">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} strokeWidth={2.5} />
                <p className="font-bold">{definition.label}</p>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">{definition.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-white/70">
                <Sparkles size={12} />
                <span>Drag to canvas to add</span>
              </div>
            </div>
            <div className={`absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-current`} style={{ color: `rgb(${definition.type === 'trigger' ? '168, 85, 247' : '59, 130, 246'})` }} />
          </div>
        </div>
      )}
    </div>
  );
}
