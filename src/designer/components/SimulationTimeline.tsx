import { SimulationStep } from '../types/workflow';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SimulationTimelineProps {
  steps: SimulationStep[];
  onStepChange: (stepIndex: number) => void;
  onActiveNodeChange: (nodeId: string | null) => void;
}

export function SimulationTimeline({ steps, onStepChange, onActiveNodeChange }: SimulationTimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [includeDelay, setIncludeDelay] = useState(true);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        onStepChange(nextStep);
        onActiveNodeChange(steps[nextStep].nodeId);
      }, includeDelay ? 1500 : 500);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps, includeDelay, onStepChange, onActiveNodeChange]);

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      onStepChange(0);
      onActiveNodeChange(steps[0].nodeId);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    onStepChange(0);
    onActiveNodeChange(null);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange(nextStep);
      onActiveNodeChange(steps[nextStep].nodeId);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange(prevStep);
      onActiveNodeChange(steps[prevStep].nodeId);
    }
  };

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl mb-4">
          <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Create a workflow to simulate execution</p>
        <p className="text-gray-400 text-sm mt-1">Test your workflow step-by-step</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-1.5 rounded-lg">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900">Simulation</h3>
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={includeDelay}
              onChange={(e) => setIncludeDelay(e.target.checked)}
              className="rounded"
            />
            Realistic timing
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gradient-to-br from-white to-gray-50 p-3 rounded-xl border border-gray-200 shadow-md">
        <button
          onClick={handleReset}
          className="p-2 hover:bg-gray-200 rounded-lg transition-all hover:scale-110 active:scale-95"
          title="Reset"
        >
          <RotateCcw size={18} strokeWidth={2.5} />
        </button>
        <button
          onClick={handleStepBack}
          disabled={currentStep === 0}
          className="p-2 hover:bg-gray-200 rounded-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Step Back"
        >
          <SkipBack size={18} strokeWidth={2.5} />
        </button>
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 rounded-lg transition-all shadow-lg shadow-orange-500/30 hover:scale-110 active:scale-95"
            title="Pause"
          >
            <Pause size={18} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-lg transition-all shadow-lg shadow-green-500/30 hover:scale-110 active:scale-95"
            title="Play"
          >
            <Play size={18} strokeWidth={2.5} />
          </button>
        )}
        <button
          onClick={handleStepForward}
          disabled={currentStep >= steps.length - 1}
          className="p-2 hover:bg-gray-200 rounded-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Step Forward"
        >
          <SkipForward size={18} strokeWidth={2.5} />
        </button>
        <div className="flex-1 text-center">
          <div className="font-bold text-sm text-gray-900">Step {currentStep + 1} / {steps.length}</div>
          <div className="text-xs text-gray-500">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const isPending = idx > currentStep;

          return (
            <div
              key={step.id}
              className={`
                relative overflow-hidden rounded-xl transition-all duration-300
                ${isActive ? 'shadow-xl shadow-blue-500/30 scale-105' : ''}
                ${isCompleted ? 'shadow-md' : ''}
                ${isPending ? 'opacity-60' : ''}
              `}
            >
              <div className={`
                absolute inset-0 bg-gradient-to-br
                ${isActive ? 'from-blue-500 to-indigo-500' : ''}
                ${isCompleted ? 'from-green-500 to-emerald-500' : ''}
                ${isPending ? 'from-gray-400 to-gray-500' : ''}
              `} />
              <div className="relative bg-white/90 backdrop-blur-sm m-0.5 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-lg
                    ${isActive ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white animate-pulse' : ''}
                    ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' : ''}
                    ${isPending ? 'bg-gray-300 text-gray-600' : ''}
                  `}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{step.label}</p>
                    {isActive && (
                      <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                        Currently executing...
                      </p>
                    )}
                    {isCompleted && (
                      <p className="text-xs text-green-600 mt-1 font-medium">✓ Completed</p>
                    )}
                    {isPending && (
                      <p className="text-xs text-gray-500 mt-1 font-medium">Pending</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
