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
exports.GDSession = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const GDSessionSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true },
    timeLimitMinutes: { type: Number, default: 15 },
    aiParticipants: [
        {
            participantId: String,
            name: String,
            persona: {
                type: String,
                enum: ['aggressive', 'quiet', 'logical', 'dominating', 'fact_based']
            },
            avatarUrl: String
        }
    ],
    transcript: [
        {
            speakerId: String,
            speakerName: String,
            isStudent: Boolean,
            message: String,
            timestamp: { type: Date, default: Date.now },
            durationSeconds: Number
        }
    ],
    report: {
        overallScore: Number,
        metrics: {
            communication: Number,
            confidence: Number,
            clarity: Number,
            relevance: Number,
            leadership: Number,
            listening: Number,
            interruptionControl: Number,
            vocabulary: Number,
            argumentQuality: Number,
            reasoning: Number,
            conclusionQuality: Number
        },
        keyStrengths: [String],
        priorityFixes: [String]
    },
    status: { type: String, enum: ['active', 'concluded'], default: 'active' },
    completedAt: Date
}, { timestamps: true });
exports.GDSession = mongoose_1.default.model('GDSession', GDSessionSchema);
