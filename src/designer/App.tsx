import { ReactFlowProvider } from 'reactflow';
import { WorkflowDesigner } from './WorkflowDesigner';

export default function DesignerApp() {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner />
    </ReactFlowProvider>
  );
}
