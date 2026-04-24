import { NodeDefinition } from '../types/workflow';

export const NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    icon: 'Zap',
    description: 'Start workflow when an event occurs',
    defaultConfig: { event: 'employee_onboard' },
    color: 'bg-purple-500'
  },
  {
    type: 'approval',
    label: 'Approval',
    icon: 'CheckCircle',
    description: 'Request approval from designated person',
    defaultConfig: { approver: '', timeout: 48 },
    color: 'bg-blue-500'
  },
  {
    type: 'notification',
    label: 'Notification',
    icon: 'Bell',
    description: 'Send notification via email or Slack',
    defaultConfig: { channel: 'email', template: '' },
    color: 'bg-green-500'
  },
  {
    type: 'assignment',
    label: 'Assignment',
    icon: 'UserPlus',
    description: 'Assign task to team member',
    defaultConfig: { assignee: '', priority: 'medium' },
    color: 'bg-orange-500'
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: 'GitBranch',
    description: 'Branch workflow based on conditions',
    defaultConfig: { condition: '', truePath: '', falsePath: '' },
    color: 'bg-yellow-500'
  },
  {
    type: 'delay',
    label: 'Delay',
    icon: 'Clock',
    description: 'Wait for specified duration',
    defaultConfig: { duration: 1, unit: 'hours' },
    color: 'bg-indigo-500'
  },
  {
    type: 'integration',
    label: 'Integration',
    icon: 'Link',
    description: 'Connect to external system',
    defaultConfig: { system: '', action: '' },
    color: 'bg-pink-500'
  }
];
