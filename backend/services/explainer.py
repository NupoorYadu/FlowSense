from backend.models.workflow import Workflow
from backend.utils.graph import WorkflowGraph


def explain_workflow(workflow: Workflow) -> str:
    if not workflow.nodes:
        return "This workflow is empty and has no executable HR process yet."

    graph = WorkflowGraph(workflow)
    ordered_nodes = [graph.nodes_by_id[node_id] for node_id in graph.topological_execution_order()]
    phrases: list[str] = []

    for node in ordered_nodes:
        title = node.metadata.get("title", node.id)
        role = node.metadata.get("role")

        if node.type == "start":
            phrases.append(f"starts with {title}")
        elif node.type == "task":
            phrases.append(f"assigns {title} to {role or 'the responsible team'}")
        elif node.type == "approval":
            phrases.append(f"requires approval from {role or 'an approver'} for {title}")
        elif node.type == "automated":
            action = node.metadata.get("parameters", {}).get("action", title)
            phrases.append(f"runs the automated action {action}")
        elif node.type == "end":
            phrases.append(f"concludes with {title}")

    if len(phrases) == 1:
        return f"This workflow {phrases[0]}."

    return f"This workflow {', '.join(phrases[:-1])}, and {phrases[-1]}."
