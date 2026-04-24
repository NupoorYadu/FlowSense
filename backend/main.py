from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.workflow_routes import router as workflow_router

app = FastAPI(
    title="Intelligent HR Workflow Designer API",
    description="Analytical backend for validating, explaining, simulating, scoring, and briefing HR workflow graphs.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str | bool]:
    return {
        "ok": True,
        "service": "intelligent-hr-workflow-designer",
    }


app.include_router(workflow_router)
