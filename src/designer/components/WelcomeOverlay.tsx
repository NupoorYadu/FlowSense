import { useEffect } from 'react';
import { X, Zap, MousePointer2, Keyboard, Eye } from 'lucide-react';

interface WelcomeOverlayProps {
  onClose: () => void;
}

export function WelcomeOverlay({ onClose }: WelcomeOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-black/60 via-blue-900/40 to-purple-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-500"
      onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMS0yLjY5LTYtNi02cy02IDIuNjktNiA2YzAgMy4zMSAyLjY5IDYgNiA2czYtMi42OSA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40 animate-pulse" />

      <div
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in duration-500 flex flex-col"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-pink-400 to-orange-600 rounded-full blur-3xl opacity-20 animate-pulse" />

        <div className="relative p-6 sm:p-8 overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-3 rounded-2xl shadow-xl shadow-blue-500/30 animate-pulse">
                  <Zap className="text-white" size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    Welcome to Workflow Designer
                  </h2>
                  <p className="text-gray-600 font-medium">Build intelligent HR workflows with real-time AI-powered feedback</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all"
            >
              <X size={28} strokeWidth={2.5} />
            </button>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-2xl p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/30 w-fit mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <MousePointer2 className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Drag & Drop</h3>
            <p className="text-sm text-gray-700 leading-relaxed">Drag nodes from the sidebar to build your workflow with ease</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 rounded-2xl p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-purple-500/30 w-fit mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Zap className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Smart Suggestions</h3>
            <p className="text-sm text-gray-700 leading-relaxed">Get intelligent AI-powered recommendations as you build</p>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50 rounded-2xl p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg shadow-green-500/30 w-fit mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Eye className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Path Highlighting</h3>
            <p className="text-sm text-gray-700 leading-relaxed">Hover over nodes to see connected workflow paths</p>
          </div>

          <div className="group bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50 rounded-2xl p-5 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg shadow-orange-500/30 w-fit mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Keyboard className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Keyboard Shortcuts</h3>
            <p className="text-sm text-gray-700 leading-relaxed">Press Delete to remove selected nodes quickly</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200/50 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg shadow-lg shadow-yellow-500/30">
              <Eye className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <h4 className="font-bold text-gray-900">Quick Tips</h4>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3 bg-white/60 p-3 rounded-xl">
              <span className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 shadow-lg">1</span>
              <span className="leading-relaxed">Click on any node to configure its settings in the right panel</span>
            </li>
            <li className="flex items-start gap-3 bg-white/60 p-3 rounded-xl">
              <span className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 shadow-lg">2</span>
              <span className="leading-relaxed">Connect nodes by dragging from the bottom handle to the top handle</span>
            </li>
            <li className="flex items-start gap-3 bg-white/60 p-3 rounded-xl">
              <span className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 shadow-lg">3</span>
              <span className="leading-relaxed">Check the Risk Analysis tab to see validation issues</span>
            </li>
            <li className="flex items-start gap-3 bg-white/60 p-3 rounded-xl">
              <span className="bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 shadow-lg">4</span>
              <span className="leading-relaxed">Use the Simulation tab to test your workflow execution</span>
            </li>
          </ul>
        </div>

        </div>

        <div className="relative bg-white/90 backdrop-blur-xl border-t border-indigo-100 p-4">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
          >
            <Zap size={24} strokeWidth={2.5} />
            Start Designing
            <Zap size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
