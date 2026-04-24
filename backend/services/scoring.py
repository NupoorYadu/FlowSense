from backend.models.workflow import ScoreBreakdown, ScoreResponse, Workflow
from backend.services.validator import validate_workflow
from backend.utils.graph import WorkflowGraph


def _clamp(value: float) -> int:
    return max(0, min(100, round(value)))


def score_workflow(workflow: Workflow) -> ScoreResponse:
    graph = WorkflowGraph(workflow)
    issues = validate_workflow(workflow)

    has_start = bool(graph.start_nodes)
    has_end = bool(graph.end_nodes)
    has_cycles = bool(graph.cycle_nodes())
    unreachable_count = len([node for node in workflow.nodes if has_start and node.id not in graph.reachable_from_starts()])

    structure = 100
    if not has_start:
        structure -= 30
    if not has_end:
        structure -= 30
    if has_cycles:
        structure -= 30
    structure -= min(30, unreachable_count * 10)

    approval_score = 40 if any(node.type == "approval" for node in workflow.nodes) else 0
    assigned_nodes = [
        node for node in workflow.nodes if node.type in {"task", "approval", "automated"}
    ]
    assigned_ratio = (
        sum(1 for node in assigned_nodes if node.metadata.get("role")) / len(assigned_nodes)
        if assigned_nodes
        else 1
    )
    completeness = approval_score + assigned_ratio * 60

    warning_count = sum(1 for issue in issues if issue.type == "warning")
    critical_count = sum(1 for issue in issues if issue.type == "critical")
    risk = 100 - critical_count * 30 - warning_count * 15

    node_count = len(workflow.nodes)
    duplicate_edges = len(workflow.edges) - len({(edge.source, edge.target) for edge in workflow.edges})
    efficiency = 100
    if node_count > 12:
        efficiency -= min(30, (node_count - 12) * 3)
    efficiency -= min(25, duplicate_edges * 10)
    if workflow.edges and node_count > 1 and len(workflow.edges) < node_count - 1:
        efficiency -= 15

    breakdown = ScoreBreakdown(
        structure=_clamp(structure),
        completeness=_clamp(completeness),
        risk=_clamp(risk),
        efficiency=_clamp(efficiency),
    )
    score = _clamp(
        breakdown.structure * 0.30
        + breakdown.completeness * 0.25
        + breakdown.risk * 0.25
        + breakdown.efficiency * 0.20
    )

    if score >= 85:
        summary = "Strong workflow with reliable structure and low operational risk."
    elif score >= 70:
        summary = "Moderately efficient workflow with some improvement opportunities."
    elif score >= 50:
        summary = "Functional but risky workflow that needs stronger controls."
    else:
        summary = "High-risk workflow with structural or governance gaps."

    return ScoreResponse(score=score, breakdown=breakdown, summary=summary)
