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
exports.StudentProfile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const StudentProfileSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    degree: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    graduationYear: { type: Number, required: true },
    currentSemester: { type: Number, required: true },
    skills: [
        {
            name: { type: String, required: true, trim: true },
            category: { type: String, default: 'technical' },
            proficiency: { type: Number, min: 1, max: 5, default: 3 },
            verifiedScore: { type: Number, min: 0, max: 100, default: 0 }
        }
    ],
    interests: [{ type: String, trim: true }],
    targetRoles: [{ type: String, required: true, trim: true }],
    targetCompanies: [{ type: String, trim: true }],
    expectedPackageLPA: { type: Number, min: 0 },
    experienceLevel: {
        type: String,
        enum: ['fresher', 'internship', '0-1_years', '1-3_years'],
        default: 'fresher'
    },
    dailyPrepTimeMinutes: { type: Number, min: 15, max: 480, default: 60 },
    placementDeadline: { type: Date, required: true },
    resumeUrl: { type: String },
    projects: [
        {
            title: { type: String, required: true },
            description: String,
            techStack: [String],
            liveUrl: String,
            githubUrl: String
        }
    ],
    certifications: [
        {
            title: String,
            issuer: String,
            issueDate: Date,
            credentialUrl: String
        }
    ],
    onboardingCompleted: { type: Boolean, default: false, index: true },
    currentReadinessScore: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });
StudentProfileSchema.index({ targetRoles: 1 });
exports.StudentProfile = mongoose_1.default.model('StudentProfile', StudentProfileSchema);
