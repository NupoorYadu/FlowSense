from backend.models.workflow import SimulationScenario, SimulationStep, Workflow
from backend.utils.graph import WorkflowGraph


def simulate_workflow(workflow: Workflow, scenario: SimulationScenario | None = None) -> list[SimulationStep]:
    graph = WorkflowGraph(workflow)
    scenario = scenario or SimulationScenario()
    steps: list[SimulationStep] = []

    for index, node_id in enumerate(graph.topological_execution_order(), start=1):
        node = graph.nodes_by_id[node_id]
        role = node.metadata.get("role")
        title = node.metadata.get("title", node.id)

        if scenario.rejection_node_id == node_id:
            steps.append(
                SimulationStep(
                    step_number=index,
                    node_id=node_id,
                    role=role,
                    status="failed",
                    message=f"{title} failed because the rejection scenario was triggered.",
                )
            )
            break

        if scenario.approval_delay and node.type == "approval":
            status = "pending"
            message = f"{title} is pending because approval is delayed."
        else:
            status = "completed"
            message = f"{title} completed successfully."

        steps.append(
            SimulationStep(
                step_number=index,
                node_id=node_id,
                role=role,
                status=status,
                message=message,
            )
        )

    return steps
