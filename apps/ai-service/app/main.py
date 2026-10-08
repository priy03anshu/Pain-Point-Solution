from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.schemas.assessment import GenerateAssessmentRequest, GenerateAssessmentResponse, GeneratedQuestion
from app.schemas.weakness import WeaknessAnalysisRequest, WeaknessAnalysisResponse, WeaknessInsightOutput
from app.llm.provider import LLMProvider

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PlacementOS Intelligence Microservice: Adaptive assessment generation and NLP diagnostic reasoning."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "provider": settings.LLM_PROVIDER,
        "version": settings.VERSION
    }

@app.post("/api/v1/assessment/generate", response_model=GenerateAssessmentResponse)
def generate_assessment(request: GenerateAssessmentRequest):
    try:
        raw_questions = LLMProvider.generate_assessment_questions(
            target_role=request.targetRole,
            degree=request.degree,
            skills=request.skills,
            count=request.questionCount
        )
        validated_questions = [GeneratedQuestion(**q) for q in raw_questions]
        return GenerateAssessmentResponse(
            success=True,
            targetRole=request.targetRole,
            questions=validated_questions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/weakness/analyze", response_model=WeaknessAnalysisResponse)
def analyze_weakness(request: WeaknessAnalysisRequest):
    try:
        raw_insights = LLMProvider.analyze_weakness_patterns([w.dict() for w in request.weaknesses])
        validated_insights = [WeaknessInsightOutput(**i) for i in raw_insights]
        return WeaknessAnalysisResponse(
            success=True,
            insights=validated_insights
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
