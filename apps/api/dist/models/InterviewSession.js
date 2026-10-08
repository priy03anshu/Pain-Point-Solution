"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewSession = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const InterviewSessionSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mode: {
        type: String,
        enum: ['hr', 'technical', 'behavioral', 'role_specific', 'company_specific', 'resume_based', 'project_based'],
        required: true,
        index: true
    },
    targetRole: { type: String, required: true },
    targetCompany: String,
    turns: [
        {
            turnIndex: Number,
            interviewerQuestion: String,
            studentAnswer: String,
            evaluation: {
                relevanceScore: Number,
                structureScore: Number,
                technicalCorrectness: Number,
                communicationClarity: Number,
                confidenceScore: Number,
                critique: String,
                betterAnswerSuggestion: String
            },
            followUpGenerated: String
        }
    ],
    finalReport: {
        overallScore: Number,
        relevanceAvg: Number,
        structureAvg: Number,
        communicationAvg: Number,
        technicalAvg: Number,
        confidenceIndicators: [String],
        strengths: [String],
        areasForImprovement: [String],
        recommendedFollowUpQuestions: [String]
    },
    durationSeconds: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'cancelled'],
        default: 'in_progress'
    },
    startedAt: { type: Date, default: Date.now, index: true },
    completedAt: Date
}, { timestamps: true });
exports.InterviewSession = mongoose_1.default.model('InterviewSession', InterviewSessionSchema);
