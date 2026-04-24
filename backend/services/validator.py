from collections import Counter

from backend.models.workflow import ValidationIssue, Workflow
from backend.utils.graph import WorkflowGraph


def validate_workflow(workflow: Workflow) -> list[ValidationIssue]:
    graph = WorkflowGraph(workflow)
    issues: list[ValidationIssue] = []

    if not graph.start_nodes:
        issues.append(ValidationIssue(type="critical", message="Workflow is missing a start node.", affected_nodes=[]))
    elif len(graph.start_nodes) > 1:
        issues.append(
            ValidationIssue(
                type="warning",
                message="Workflow has multiple start nodes, which may create ambiguous ownership.",
                affected_nodes=[node.id for node in graph.start_nodes],
            )
        )

    if not graph.end_nodes:
        issues.append(ValidationIssue(type="critical", message="Workflow is missing an end node.", affected_nodes=[]))

    cycle_nodes = graph.cycle_nodes()
    if cycle_nodes:
        issues.append(
            ValidationIssue(
                type="critical",
                message="Workflow contains a cycle and may never terminate.",
                affected_nodes=sorted(cycle_nodes),
            )
        )

    reachable = graph.reachable_from_starts()
    unreachable = [node.id for node in workflow.nodes if graph.start_nodes and node.id not in reachable]
    if unreachable:
        issues.append(
            ValidationIssue(
                type="critical",
                message="Some nodes are unreachable from the start node.",
                affected_nodes=unreachable,
            )
        )

    can_reach_end = graph.nodes_that_can_reach_end()
    dead_ends = [
        node.id
        for node in workflow.nodes
        if node.type != "end" and graph.end_nodes and node.id not in can_reach_end
    ]
    if dead_ends:
        issues.append(
            ValidationIssue(
                type="warning",
                message="Some paths cannot reach an end node.",
                affected_nodes=dead_ends,
            )
        )

    if workflow.nodes and not any(node.type == "approval" for node in workflow.nodes):
        issues.append(
            ValidationIssue(
                type="warning",
                message="No approval step detected. HR workflows usually need an approval safeguard.",
                affected_nodes=[],
            )
        )

    role_counts = Counter(
        str(node.metadata.get("role"))
        for node in workflow.nodes
        if node.type not in {"start", "end"} and node.metadata.get("role")
    )
    total_role_nodes = sum(role_counts.values())
    bottleneck_roles = [
        role
        for role, count in role_counts.items()
        if total_role_nodes >= 3 and count / total_role_nodes >= 0.5
    ]
    if bottleneck_roles:
        issues.append(
            ValidationIssue(
                type="warning",
                message=f"Potential role bottleneck detected for: {', '.join(bottleneck_roles)}.",
                affected_nodes=[
                    node.id
                    for node in workflow.nodes
                    if str(node.metadata.get("role")) in bottleneck_roles
                ],
            )
        )

    overloaded_nodes = [
        node.id
        for node in workflow.nodes
        if graph.in_degree[node.id] + graph.out_degree[node.id] >= 5
    ]
    if overloaded_nodes:
        issues.append(
            ValidationIssue(
                type="info",
                message="Some nodes have many dependencies and may become operational bottlenecks.",
                affected_nodes=overloaded_nodes,
            )
        )

    return issues
