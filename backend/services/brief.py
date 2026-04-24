from backend.models.workflow import BriefResponse, Workflow
from backend.services.explainer import explain_workflow
from backend.services.scoring import score_workflow
from backend.services.validator import validate_workflow


def generate_brief(workflow: Workflow) -> BriefResponse:
    explanation = explain_workflow(workflow)
    score = score_workflow(workflow)
    issues = validate_workflow(workflow)

    key_risks = [
        issue.message
        for issue in issues
        if issue.type in {"critical", "warning"}
    ][:3]

    suggested_improvements: list[str] = []
    if score.breakdown.structure < 80:
        suggested_improvements.append("Resolve structural issues such as missing start/end nodes, cycles, or unreachable steps.")
    if score.breakdown.completeness < 80:
        suggested_improvements.append("Add approval safeguards and ensure every operational step has a clear owner.")
    if score.breakdown.risk < 80:
        suggested_improvements.append("Reduce bottlenecks by distributing responsibility across backup roles or parallel paths.")
    if score.breakdown.efficiency < 80:
        suggested_improvements.append("Remove redundant transitions and simplify long workflow paths.")

    if not key_risks:
        key_risks.append("No material structural risks detected.")

    if not suggested_improvements:
        suggested_improvements.append("Continue monitoring execution metrics as the workflow scales.")

    return BriefResponse(
        summary=f"{explanation} Overall intelligence score is {score.score}/100, indicating: {score.summary}",
        key_risks=key_risks,
        suggested_improvements=suggested_improvements,
    )
