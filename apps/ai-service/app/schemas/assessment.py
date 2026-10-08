from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionOption(BaseModel):
    optionId: str
    text: str

class GeneratedQuestion(BaseModel):
    category: str
    topic: str
    subTopic: Optional[str] = None
    questionType: str = "single_choice"
    difficulty: str = "medium"
    prompt: str
    scenarioContext: Optional[str] = None
    options: List[QuestionOption]
    correctOptionIds: List[str]
    explanation: str
    suggestedActionOnFailure: Optional[str] = None

class GenerateAssessmentRequest(BaseModel):
    targetRole: str
    degree: str
    skills: List[str] = Field(default_factory=list)
    questionCount: int = Field(default=5, ge=1, le=20)
    difficulty: str = Field(default="medium")

class GenerateAssessmentResponse(BaseModel):
    success: bool = True
    targetRole: str
    questions: List[GeneratedQuestion]
