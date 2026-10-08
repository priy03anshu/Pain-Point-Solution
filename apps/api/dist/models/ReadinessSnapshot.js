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
exports.ReadinessSnapshot = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ReadinessSnapshotSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetRole: { type: String, required: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    dimensionScores: {
        technical: { type: Number, min: 0, max: 100, required: true },
        problemSolving: { type: Number, min: 0, max: 100, required: true },
        roleMatch: { type: Number, min: 0, max: 100, required: true },
        communication: { type: Number, min: 0, max: 100, required: true },
        interview: { type: Number, min: 0, max: 100, required: true },
        resume: { type: Number, min: 0, max: 100, required: true },
        profile: { type: Number, min: 0, max: 100, required: true },
        consistency: { type: Number, min: 0, max: 100, required: true }
    },
    weightsApplied: {
        technical: Number,
        problemSolving: Number,
        roleMatch: Number,
        communication: Number,
        interview: Number,
        resume: Number,
        profile: Number,
        consistency: Number
    },
    topImprovementOpportunities: [
        {
            area: String,
            potentialGainPoints: Number,
            action: String
        }
    ],
    triggerEvent: {
        type: String,
        enum: [
            'initial_assessment',
            'quiz_completed',
            'interview_completed',
            'resume_analyzed',
            'task_completed',
            'manual_recalculate'
        ],
        required: true
    },
    deltaFromPrevious: { type: Number, default: 0 },
    computedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });
ReadinessSnapshotSchema.index({ student: 1, computedAt: -1 });
exports.ReadinessSnapshot = mongoose_1.default.model('ReadinessSnapshot', ReadinessSnapshotSchema);
