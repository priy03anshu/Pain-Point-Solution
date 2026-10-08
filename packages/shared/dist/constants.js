"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POPULAR_COMPANIES_SUGGESTIONS = exports.POPULAR_ROLES_SUGGESTIONS = exports.POPULAR_DEGREES_SUGGESTIONS = exports.DEFAULT_ROLE_WEIGHTS = exports.READINESS_DIMENSIONS = exports.USER_ROLES = exports.QUESTION_TYPES = exports.QUESTION_DIFFICULTIES = exports.QUESTION_CATEGORIES = void 0;
exports.QUESTION_CATEGORIES = [
    'technical',
    'domain',
    'aptitude',
    'logical_reasoning',
    'communication',
    'problem_solving',
    'role_specific',
    'situational',
    'career_readiness'
];
exports.QUESTION_DIFFICULTIES = ['easy', 'medium', 'hard'];
exports.QUESTION_TYPES = ['single_choice', 'multi_choice', 'true_false', 'scenario'];
exports.USER_ROLES = ['student', 'admin'];
exports.READINESS_DIMENSIONS = [
    'technical',
    'problemSolving',
    'roleMatch',
    'communication',
    'interview',
    'resume',
    'profile',
    'consistency'
];
exports.DEFAULT_ROLE_WEIGHTS = {
    // Software / Engineering defaults
    engineering: {
        technical: 0.25,
        problemSolving: 0.20,
        roleMatch: 0.15,
        communication: 0.10,
        interview: 0.10,
        resume: 0.10,
        profile: 0.05,
        consistency: 0.05
    },
    // Product / Analytics
    product: {
        technical: 0.15,
        problemSolving: 0.25,
        roleMatch: 0.15,
        communication: 0.15,
        interview: 0.15,
        resume: 0.05,
        profile: 0.05,
        consistency: 0.05
    },
    // Sales / Marketing / HR / BD
    business: {
        technical: 0.10,
        problemSolving: 0.15,
        roleMatch: 0.15,
        communication: 0.25,
        interview: 0.20,
        resume: 0.05,
        profile: 0.05,
        consistency: 0.05
    },
    // Default general baseline
    default: {
        technical: 0.20,
        problemSolving: 0.20,
        roleMatch: 0.15,
        communication: 0.15,
        interview: 0.10,
        resume: 0.10,
        profile: 0.05,
        consistency: 0.05
    }
};
exports.POPULAR_DEGREES_SUGGESTIONS = [
    'B.Tech Computer Science & Engineering',
    'B.Tech Information Technology',
    'B.Tech Electronics & Communication',
    'B.Tech Mechanical Engineering',
    'BCA (Bachelor of Computer Applications)',
    'MCA (Master of Computer Applications)',
    'BBA (Bachelor of Business Administration)',
    'MBA (Master of Business Administration)',
    'B.Com (Honours)',
    'B.Sc Computer Science',
    'B.Sc Data Science & AI',
    'B.Sc Mathematics & Statistics',
    'B.A. Economics',
    'Diploma in Engineering'
];
exports.POPULAR_ROLES_SUGGESTIONS = [
    'Full Stack Developer',
    'Backend Engineer',
    'Frontend Engineer',
    'Software Engineer (SDE 1)',
    'Data Analyst',
    'Machine Learning Engineer',
    'Product Manager (Associate)',
    'Business Analyst',
    'Quality Assurance Engineer',
    'DevOps / Cloud Engineer',
    'Management Trainee',
    'Financial Analyst'
];
exports.POPULAR_COMPANIES_SUGGESTIONS = [
    'Google', 'Microsoft', 'Amazon', 'Adobe', 'Uber', 'Atlassian',
    'Goldman Sachs', 'J.P. Morgan', 'Morgan Stanley',
    'Flipkart', 'Swiggy', 'Zomato', 'Razorpay', 'CRED',
    'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Deloitte', 'PwC', 'EY'
];
