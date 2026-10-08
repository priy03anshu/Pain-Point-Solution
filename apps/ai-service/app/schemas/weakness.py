from pydantic import BaseModel, Field
from typing import List, Optional

class WeaknessItem(BaseModel):
    category: str
    topic: str
    accuracyRate: float
    mistakeCount: int

class WeaknessAnalysisRequest(BaseModel):
    studentDegree: str
    targetRole: str
    weaknesses: List[WeaknessItem]

class WeaknessInsightOutput(BaseModel):
    category: str
    topic: str
    severity: str
    plainLanguageInsight: str
    concreteRecommendation: str

class WeaknessAnalysisResponse(BaseModel):
    success: bool = True
    insights: List[WeaknessInsightOutput]
