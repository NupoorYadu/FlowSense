import { Sparkles, Zap, MousePointer2 } from 'lucide-react';

export function EmptyCanvasState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center max-w-lg px-8">
        <div className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 blur-3xl opacity-30">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-64 h-64 mx-auto rounded-full" />
          </div>

          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl shadow-blue-500/30">
            <Zap className="text-white" size={64} strokeWidth={2} />
            <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-2">
              <Sparkles className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <div className="absolute bottom-2 left-2 bg-pink-500 rounded-full p-2">
              <MousePointer2 className="text-white" size={16} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Start Building Your Workflow
        </h3>

        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          Drag nodes from the left sidebar to create your first intelligent HR workflow
        </p>

        <div className="flex items-center justify-center gap-4">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 px-4 py-2 rounded-full border border-blue-300/50 shadow-lg">
            <p className="text-sm font-bold text-blue-700 flex items-center gap-2">
              <MousePointer2 size={16} strokeWidth={2.5} />
              Drag & Drop
            </p>
          </div>
          <div className="text-gray-400 font-bold">-&gt;</div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 px-4 py-2 rounded-full border border-purple-300/50 shadow-lg">
            <p className="text-sm font-bold text-purple-700 flex items-center gap-2">
              <Zap size={16} strokeWidth={2.5} />
              Create
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
          {[
            { icon: 'Zap', label: 'Trigger', color: 'from-purple-500 to-pink-500' },
            { icon: 'Check', label: 'Approval', color: 'from-blue-500 to-cyan-500' },
            { icon: 'Mail', label: 'Notify', color: 'from-green-500 to-teal-500' },
          ].map((item) => (
            <div
              key={item.label}
              className={`bg-gradient-to-br ${item.color} p-3 rounded-xl shadow-lg text-white opacity-60 hover:opacity-100 transition-opacity`}
            >
              <div className="text-sm mb-1 font-black">{item.icon}</div>
              <div className="text-xs font-bold">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
