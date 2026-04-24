from typing import Any, Literal

from pydantic import BaseModel, Field, model_validator

NodeType = Literal["start", "task", "approval", "automated", "end"]
IssueType = Literal["info", "warning", "critical"]
SimulationStatus = Literal["pending", "completed", "failed"]


class WorkflowNode(BaseModel):
    id: str = Field(min_length=1)
    type: NodeType
    metadata: dict[str, Any] = Field(default_factory=dict)


class WorkflowEdge(BaseModel):
    source: str = Field(min_length=1)
    target: str = Field(min_length=1)


class Workflow(BaseModel):
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]

    @model_validator(mode="after")
    def validate_edge_references(self) -> "Workflow":
        node_ids = {node.id for node in self.nodes}
        missing = [
            f"{edge.source}->{edge.target}"
            for edge in self.edges
            if edge.source not in node_ids or edge.target not in node_ids
        ]

        if missing:
            raise ValueError(f"Edges reference unknown node ids: {', '.join(missing)}")

        return self


class ValidationIssue(BaseModel):
    type: IssueType
    message: str
    affected_nodes: list[str] = Field(default_factory=list)


class ValidationResponse(BaseModel):
    issues: list[ValidationIssue]


class ExplanationResponse(BaseModel):
    explanation: str


class SimulationScenario(BaseModel):
    approval_delay: bool = False
    rejection_node_id: str | None = None


class SimulationRequest(BaseModel):
    workflow: Workflow
    scenario: SimulationScenario | None = None


class SimulationStep(BaseModel):
    step_number: int
    node_id: str
    role: str | None = None
    status: SimulationStatus
    message: str


class SimulationResponse(BaseModel):
    steps: list[SimulationStep]


class ScoreBreakdown(BaseModel):
    structure: int
    completeness: int
    risk: int
    efficiency: int


class ScoreResponse(BaseModel):
    score: int
    breakdown: ScoreBreakdown
    summary: str


class BriefResponse(BaseModel):
    summary: str
    key_risks: list[str]
    suggested_improvements: list[str]


class AutomationAction(BaseModel):
    id: str
    label: str
    params: list[str]
