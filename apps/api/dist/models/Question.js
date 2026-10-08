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
exports.Question = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const shared_1 = require("@placementos/shared");
const QuestionSchema = new mongoose_1.Schema({
    category: {
        type: String,
        required: true,
        enum: shared_1.QUESTION_CATEGORIES,
        index: true
    },
    topic: { type: String, required: true, index: true },
    subTopic: String,
    questionType: {
        type: String,
        enum: ['single_choice', 'multi_choice', 'true_false', 'scenario'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
        index: true
    },
    prompt: { type: String, required: true },
    scenarioContext: String,
    options: [
        {
            optionId: { type: String, required: true },
            text: { type: String, required: true }
        }
    ],
    correctOptionIds: [{ type: String, required: true }],
    explanation: { type: String, required: true },
    suggestedActionOnFailure: String,
    targetRoles: [{ type: String }],
    targetSkills: [{ type: String }],
    aiGenerated: { type: Boolean, default: false },
    reviewStatus: {
        type: String,
        enum: ['pending_review', 'approved', 'rejected'],
        default: 'approved',
        index: true
    },
    reviewedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    usageCount: { type: Number, default: 0 },
    accuracyRate: { type: Number, default: 0 }
}, { timestamps: true });
QuestionSchema.index({ category: 1, difficulty: 1, reviewStatus: 1 });
QuestionSchema.index({ targetRoles: 1 });
exports.Question = mongoose_1.default.model('Question', QuestionSchema);
