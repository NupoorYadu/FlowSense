import { WorkflowNodeData } from '../types/workflow';

interface LiveFormPanelProps {
  nodeData: WorkflowNodeData | null;
  onConfigChange: (config: Record<string, any>) => void;
}

const fieldClass =
  'w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md';

export function LiveFormPanel({ nodeData, onConfigChange }: LiveFormPanelProps) {
  if (!nodeData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl mb-4 animate-pulse">
          <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Select a node to configure</p>
        <p className="text-gray-400 text-sm mt-1">Click any node on the canvas</p>
      </div>
    );
  }

  const updateConfig = (key: string, value: any) => {
    onConfigChange({ ...nodeData.config, [key]: value });
  };

  return (
    <div className="space-y-5 animate-slide-in-bounce">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
        <h3 className="font-bold text-gray-900 mb-1">Node Configuration</h3>
        <p className="text-xs text-gray-600">Customize settings for {nodeData.label}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Label</label>
          <input type="text" value={nodeData.label} readOnly className={`${fieldClass} bg-gray-50`} />
        </div>

        {nodeData.type === 'approval' && (
          <>
            <TextField label="Approver" value={nodeData.config.approver || ''} placeholder="manager@company.com" onChange={(value) => updateConfig('approver', value)} />
            <NumberField label="Timeout (hours)" value={nodeData.config.timeout || 48} onChange={(value) => updateConfig('timeout', value)} />
          </>
        )}

        {nodeData.type === 'notification' && (
          <>
            <SelectField label="Channel" value={nodeData.config.channel || 'email'} options={['email', 'slack', 'teams']} onChange={(value) => updateConfig('channel', value)} />
            <TextAreaField label="Template" value={nodeData.config.template || ''} placeholder="Enter notification message..." onChange={(value) => updateConfig('template', value)} />
          </>
        )}

        {nodeData.type === 'assignment' && (
          <>
            <TextField label="Assignee" value={nodeData.config.assignee || ''} placeholder="team-member@company.com" onChange={(value) => updateConfig('assignee', value)} />
            <SelectField label="Priority" value={nodeData.config.priority || 'medium'} options={['low', 'medium', 'high']} onChange={(value) => updateConfig('priority', value)} />
          </>
        )}

        {nodeData.type === 'condition' && (
          <TextField label="Condition" value={nodeData.config.condition || ''} placeholder="department === 'Engineering'" onChange={(value) => updateConfig('condition', value)} />
        )}

        {nodeData.type === 'delay' && (
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Duration" value={nodeData.config.duration || 1} onChange={(value) => updateConfig('duration', value)} />
            <SelectField label="Unit" value={nodeData.config.unit || 'hours'} options={['minutes', 'hours', 'days']} onChange={(value) => updateConfig('unit', value)} />
          </div>
        )}

        {nodeData.type === 'integration' && (
          <>
            <SelectField label="System" value={nodeData.config.system || ''} options={['salesforce', 'workday', 'bamboohr', 'greenhouse']} onChange={(value) => updateConfig('system', value)} />
            <TextField label="Action" value={nodeData.config.action || ''} placeholder="create_user" onChange={(value) => updateConfig('action', value)} />
          </>
        )}
      </div>
    </div>
  );
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <input type="text" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={fieldClass} />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className={fieldClass} />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <textarea value={value} placeholder={placeholder} rows={3} onChange={(event) => onChange(event.target.value)} className={fieldClass} />
    </div>
  );
}
