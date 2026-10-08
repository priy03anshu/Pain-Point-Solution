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
exports.CareerRoadmap = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CareerRoadmapSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    targetDreamJob: { type: String, required: true, trim: true, index: true },
    industryContext: { type: String, default: 'Technology & Product' },
    weeklyHours: { type: Number, default: 10 },
    targetMonths: { type: Number, default: 6 },
    totalEstimatedHours: { type: Number, default: 240 },
    phases: [
        {
            phaseIndex: Number,
            title: String,
            durationWeeks: Number,
            targetRoleMilestone: String,
            description: String
        }
    ],
    nodes: [
        {
            id: String,
            title: String,
            subtitle: String,
            category: String,
            phaseIndex: Number,
            tier: Number,
            prerequisites: [String],
            estimatedHours: Number,
            status: {
                type: String,
                enum: ['locked', 'unlocked', 'in_progress', 'completed', 'skipped'],
                default: 'locked'
            },
            skills: [String],
            summary: String,
            realisticProject: {
                title: String,
                description: String,
                architectureNotes: String,
                deliverables: [String],
                techStack: [String]
            },
            githubInspirations: [
                {
                    repoName: String,
                    description: String,
                    url: String
                }
            ],
            interviewQuestions: [
                {
                    question: String,
                    answer: String,
                    difficulty: String
                }
            ],
            certifications: [
                {
                    name: String,
                    issuer: String,
                    relevance: String
                }
            ],
            icon: String,
            x: Number,
            y: Number
        }
    ],
    edges: [
        {
            id: String,
            source: String,
            target: String,
            isActive: Boolean
        }
    ],
    precedentProfiles: [
        {
            id: String,
            name: String,
            currentRole: String,
            company: String,
            startingPoint: String,
            timeTakenMonths: Number,
            steppingStoneRoles: [String],
            keyBreakthroughProject: String,
            quote: String
        }
    ],
    completionPercentage: { type: Number, default: 0 }
}, { timestamps: true });
exports.CareerRoadmap = mongoose_1.default.model('CareerRoadmap', CareerRoadmapSchema);
