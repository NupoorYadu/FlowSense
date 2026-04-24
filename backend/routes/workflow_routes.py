from fastapi import APIRouter

from backend.models.workflow import (
    AutomationAction,
    BriefResponse,
    ExplanationResponse,
    ScoreResponse,
    SimulationRequest,
    SimulationResponse,
    ValidationResponse,
    Workflow,
)
from backend.services.automations import list_automations
from backend.services.brief import generate_brief
from backend.services.explainer import explain_workflow
from backend.services.scoring import score_workflow
from backend.services.simulator import simulate_workflow
from backend.services.validator import validate_workflow

router = APIRouter(tags=["workflow intelligence"])


@router.get("/automations", response_model=list[AutomationAction])
def get_automations() -> list[AutomationAction]:
    return list_automations()


@router.post("/validate", response_model=ValidationResponse)
def validate(workflow: Workflow) -> ValidationResponse:
    return ValidationResponse(issues=validate_workflow(workflow))


@router.post("/explain", response_model=ExplanationResponse)
def explain(workflow: Workflow) -> ExplanationResponse:
    return ExplanationResponse(explanation=explain_workflow(workflow))


@router.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest) -> SimulationResponse:
    return SimulationResponse(steps=simulate_workflow(request.workflow, request.scenario))


@router.post("/score", response_model=ScoreResponse)
def score(workflow: Workflow) -> ScoreResponse:
    return score_workflow(workflow)


@router.post("/brief", response_model=BriefResponse)
def brief(workflow: Workflow) -> BriefResponse:
    return generate_brief(workflow)
