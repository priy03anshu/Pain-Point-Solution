import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { Question } from '../models/Question';
import { Company } from '../models/Company';
import { Assessment } from '../models/Assessment';
import { Gamification } from '../models/Gamification';
import { hashPassword } from '../common/utils/hash';
import { config } from '../config/env';

const sampleQuestions = [
  // --- Technical: Data Structures & Algorithms ---
  {
    category: 'technical',
    topic: 'Data Structures',
    subTopic: 'Hash Tables',
    questionType: 'single_choice',
    difficulty: 'easy',
    prompt: 'What is the average time complexity of searching for an element in a well-balanced Hash Table?',
    options: [
      { optionId: 'A', text: 'O(1)' },
      { optionId: 'B', text: 'O(n)' },
      { optionId: 'C', text: 'O(log n)' },
      { optionId: 'D', text: 'O(n log n)' }
    ],
    correctOptionIds: ['A'],
    explanation: 'Hash tables offer O(1) average time complexity for lookups when collision resolution is balanced with a good hash function.',
    suggestedActionOnFailure: 'Review hashing fundamentals and collision resolution techniques.',
    targetRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Engineer'],
    targetSkills: ['Data Structures', 'Algorithms'],
    reviewStatus: 'approved'
  },
  {
    category: 'technical',
    topic: 'Data Structures',
    subTopic: 'Trees',
    questionType: 'single_choice',
    difficulty: 'medium',
    prompt: 'Which traversal of a Binary Search Tree (BST) produces keys in ascending sorted order?',
    options: [
      { optionId: 'A', text: 'Pre-order Traversal' },
      { optionId: 'B', text: 'In-order Traversal' },
      { optionId: 'C', text: 'Post-order Traversal' },
      { optionId: 'D', text: 'Level-order Traversal' }
    ],
    correctOptionIds: ['B'],
    explanation: 'An in-order traversal (Left, Root, Right) of a BST visits nodes in strictly ascending numerical order.',
    suggestedActionOnFailure: 'Practice recursive tree traversal implementations.',
    targetRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Engineer'],
    targetSkills: ['Trees', 'Data Structures'],
    reviewStatus: 'approved'
  },
  {
    category: 'technical',
    topic: 'System Design',
    subTopic: 'Databases & Indexing',
    questionType: 'single_choice',
    difficulty: 'medium',
    prompt: 'What is the primary trade-off when adding secondary indexes to a database table?',
    options: [
      { optionId: 'A', text: 'Faster read operations at the expense of slower write operations and extra disk usage' },
      { optionId: 'B', text: 'Faster write operations at the expense of slower read operations' },
      { optionId: 'C', text: 'Elimination of all table locking during large migrations' },
      { optionId: 'D', text: 'Automatic data deduplication across foreign keys' }
    ],
    correctOptionIds: ['A'],
    explanation: 'Secondary indexes significantly accelerate SELECT queries, but every INSERT, UPDATE, and DELETE must also update index tree structures, adding write latency and storage overhead.',
    suggestedActionOnFailure: 'Study B-Tree indexing and query execution planning.',
    targetRoles: ['Software Engineer', 'Backend Engineer', 'Full Stack Developer'],
    targetSkills: ['SQL', 'Database Design'],
    reviewStatus: 'approved'
  },
  {
    category: 'technical',
    topic: 'Object-Oriented Programming',
    subTopic: 'Polymorphism',
    questionType: 'single_choice',
    difficulty: 'medium',
    prompt: 'In OOP, what mechanism allows a subclass to provide a specific implementation of a method already defined in its superclass?',
    options: [
      { optionId: 'A', text: 'Method Overloading' },
      { optionId: 'B', text: 'Method Overriding' },
      { optionId: 'C', text: 'Encapsulation' },
      { optionId: 'D', text: 'Multiple Inheritance' }
    ],
    correctOptionIds: ['B'],
    explanation: 'Method Overriding occurs when a child class provides a custom implementation of an inherited parent method with identical signature (runtime polymorphism).',
    suggestedActionOnFailure: 'Review runtime polymorphism vs compile-time overloading.',
    targetRoles: ['Software Engineer', 'Java Developer', 'Full Stack Developer'],
    targetSkills: ['Java', 'C++', 'OOP'],
    reviewStatus: 'approved'
  },
  {
    category: 'technical',
    topic: 'Web Development',
    subTopic: 'HTTP & REST',
    questionType: 'single_choice',
    difficulty: 'easy',
    prompt: 'Which HTTP method is specified as idempotent according to RFC HTTP specifications?',
    options: [
      { optionId: 'A', text: 'POST' },
      { optionId: 'B', text: 'PUT' },
      { optionId: 'C', text: 'PATCH' },
      { optionId: 'D', text: 'CONNECT' }
    ],
    correctOptionIds: ['B'],
    explanation: 'PUT and DELETE are idempotent; making multiple identical requests has the same side-effect on the server as making a single request.',
    suggestedActionOnFailure: 'Read the HTTP/1.1 REST spec for idempotency guidelines.',
    targetRoles: ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer'],
    targetSkills: ['REST APIs', 'Web Development'],
    reviewStatus: 'approved'
  },

  // --- Aptitude & Logical Reasoning ---
  {
    category: 'aptitude',
    topic: 'Quantitative Aptitude',
    subTopic: 'Time and Work',
    questionType: 'single_choice',
    difficulty: 'medium',
    prompt: 'Worker A can complete a project in 12 days, and Worker B can complete the same project in 24 days. Working together, in how many days will they finish the project?',
    options: [
      { optionId: 'A', text: '6 days' },
      { optionId: 'B', text: '8 days' },
      { optionId: 'C', text: '10 days' },
      { optionId: 'D', text: '16 days' }
    ],
    correctOptionIds: ['B'],
    explanation: 'Combined daily rate = (1/12) + (1/24) = 3/24 = 1/8. Therefore, the total project takes 8 days.',
    suggestedActionOnFailure: 'Practice unit rate time & work calculation formulas.',
    targetRoles: ['All Roles'],
    targetSkills: ['Aptitude', 'Problem Solving'],
    reviewStatus: 'approved'
  },
  {
    category: 'aptitude',
    topic: 'Logical Reasoning',
    subTopic: 'Number Series',
    questionType: 'single_choice',
    difficulty: 'easy',
    prompt: 'Identify the next number in the sequence: 4, 9, 19, 39, 79, ?',
    options: [
      { optionId: 'A', text: '159' },
      { optionId: 'B', text: '149' },
      { optionId: 'C', text: '169' },
      { optionId: 'D', text: '158' }
    ],
    correctOptionIds: ['A'],
    explanation: 'Each term is generated by (previous number * 2) + 1. (79 * 2) + 1 = 158 + 1 = 159.',
    suggestedActionOnFailure: 'Practice multi-operation pattern series identification.',
    targetRoles: ['All Roles'],
    targetSkills: ['Logical Reasoning'],
    reviewStatus: 'approved'
  },
  {
    category: 'aptitude',
    topic: 'Quantitative Aptitude',
    subTopic: 'Percentages & Profit',
    questionType: 'single_choice',
    difficulty: 'medium',
    prompt: 'A software subscription is discounted by 20% and then taxes add 10% to the discounted price. If the original price is $100, what is the final price paid?',
    options: [
      { optionId: 'A', text: '$88' },
      { optionId: 'B', text: '$90' },
      { optionId: 'C', text: '$92' },
      { optionId: 'D', text: '$80' }
    ],
    correctOptionIds: ['A'],
    explanation: 'Discounted price = $100 - $20 = $80. Tax = 10% of $80 = $8. Final price = $80 + $8 = $88.',
    suggestedActionOnFailure: 'Review compound and successive percentage formulas.',
    targetRoles: ['All Roles'],
    targetSkills: ['Quantitative Aptitude'],
    reviewStatus: 'approved'
  },

  // --- Communication & Situational Judgment ---
  {
    category: 'communication',
    topic: 'Professional Communication',
    subTopic: 'Interview Structure',
    questionType: 'single_choice',
    difficulty: 'easy',
    prompt: 'When answering behavioral interview questions (e.g., "Tell me about a time you handled conflict"), what does the STAR method stand for?',
    options: [
      { optionId: 'A', text: 'Strategy, Target, Action, Review' },
      { optionId: 'B', text: 'Situation, Task, Action, Result' },
      { optionId: 'C', text: 'Scope, Timeline, Assessment, Resolution' },
      { optionId: 'D', text: 'Statement, Topic, Argument, Rebuttal' }
    ],
    correctOptionIds: ['B'],
    explanation: 'STAR stands for Situation, Task, Action, and Result. It is the gold standard framework for framing behavioral placement interview responses.',
    suggestedActionOnFailure: 'Structure all past project stories using the STAR format.',
    targetRoles: ['All Roles'],
    targetSkills: ['Behavioral Interviews', 'Communication'],
    reviewStatus: 'approved'
  },
  {
    category: 'communication',
    topic: 'Situational Judgment',
    subTopic: 'Stakeholder Management',
    questionType: 'scenario',
    difficulty: 'medium',
    prompt: 'You notice that a critical feature delivery deadline will be missed by 2 days due to an unexpected third-party API outage. What is the most professional immediate course of action?',
    scenarioContext: 'You are leading a project deliverable for a campus hiring trial test with a mentor who expects weekly updates.',
    options: [
      { optionId: 'A', text: 'Work late silently and inform the team only after the deadline has passed' },
      { optionId: 'B', text: 'Proactively notify the manager with the root cause, revised ETA, and mitigation steps as soon as the blocker is confirmed' },
      { optionId: 'C', text: 'Blame the external API provider on social media to justify the delay' },
      { optionId: 'D', text: 'Omit the feature from the demo without notifying anyone' }
    ],
    correctOptionIds: ['B'],
    explanation: 'Proactive escalation with a clear root cause, recalculated timeline, and proposed mitigations demonstrates high professional ownership and dependability.',
    suggestedActionOnFailure: 'Review workplace communication and crisis mitigation frameworks.',
    targetRoles: ['All Roles'],
    targetSkills: ['Workplace Readiness', 'Communication'],
    reviewStatus: 'approved'
  }
];

const sampleCompanies = [
  {
    name: 'Google',
    slug: 'google',
    industry: 'Technology / Cloud / Search',
    overview: 'Global technology leader hiring Software Engineers, Product Managers, and Solution Consultants.',
    hiringWorkflow: [
      { roundIndex: 1, roundName: 'Online Coding Assessment', roundType: 'online_assessment', durationMinutes: 60, focusAreas: ['DSA', 'Algorithms'] },
      { roundIndex: 2, roundName: 'Technical Interview 1', roundType: 'technical_interview', durationMinutes: 45, focusAreas: ['Data Structures', 'Problem Solving'] },
      { roundIndex: 3, roundName: 'Technical Interview 2', roundType: 'technical_interview', durationMinutes: 45, focusAreas: ['System Design', 'Clean Code'] },
      { roundIndex: 4, roundName: 'Googliness & Leadership', roundType: 'hr_interview', durationMinutes: 45, focusAreas: ['STAR method', 'Leadership', 'Ethics'] }
    ],
    expectedSkills: [
      { skill: 'Data Structures & Algorithms', importanceWeight: 5, minimumProficiency: 4 },
      { skill: 'System Design', importanceWeight: 4, minimumProficiency: 3 },
      { skill: 'Communication & Problem Breakdown', importanceWeight: 5, minimumProficiency: 4 }
    ],
    preparationTips: [
      'Focus heavily on time and space complexity explanations before typing code.',
      'Always test edge cases (null inputs, empty arrays, integer overflows) proactively.'
    ]
  },
  {
    name: 'Microsoft',
    slug: 'microsoft',
    industry: 'Software & Cloud Computing',
    overview: 'Pioneer in operating systems, cloud (Azure), developer tools, and AI enterprise solutions.',
    hiringWorkflow: [
      { roundIndex: 1, roundName: 'Codility OA', roundType: 'online_assessment', durationMinutes: 75, focusAreas: ['Algorithms', 'Logic'] },
      { roundIndex: 2, roundName: 'Technical Rounds (2-3)', roundType: 'technical_interview', durationMinutes: 60, focusAreas: ['OOP', 'DSA', 'Databases'] },
      { roundIndex: 3, roundName: 'AA (As Appropriate / Manager) Round', roundType: 'hr_interview', durationMinutes: 45, focusAreas: ['Cultural Fit', 'Growth Mindset'] }
    ],
    expectedSkills: [
      { skill: 'Data Structures', importanceWeight: 5, minimumProficiency: 4 },
      { skill: 'Object-Oriented Design', importanceWeight: 4, minimumProficiency: 4 },
      { skill: 'Growth Mindset', importanceWeight: 4, minimumProficiency: 4 }
    ],
    preparationTips: [
      'Demonstrate a Growth Mindset: be receptive to interviewer hints and iterate on your solution.'
    ]
  },
  {
    name: 'Amazon',
    slug: 'amazon',
    industry: 'E-commerce & Cloud Computing',
    overview: 'Customer-obsessed technology and e-commerce giant with 16 Leadership Principles.',
    hiringWorkflow: [
      { roundIndex: 1, roundName: 'Online Assessment (Part 1, 2, 3)', roundType: 'online_assessment', durationMinutes: 90, focusAreas: ['DSA', 'Work Styles Assessment'] },
      { roundIndex: 2, roundName: 'Technical Loop', roundType: 'technical_interview', durationMinutes: 60, focusAreas: ['Trees, Graphs, DP', 'LP Questions'] },
      { roundIndex: 3, roundName: 'Bar Raiser Round', roundType: 'hr_interview', durationMinutes: 60, focusAreas: ['Amazon Leadership Principles', 'Customer Obsession'] }
    ],
    expectedSkills: [
      { skill: 'Amazon Leadership Principles', importanceWeight: 5, minimumProficiency: 5 },
      { skill: 'Algorithms & Coding', importanceWeight: 5, minimumProficiency: 4 }
    ],
    preparationTips: [
      'Map at least two detailed STAR stories to each of the 16 Amazon Leadership Principles.'
    ]
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('[Seed] Seeding PlacementOS baseline dataset...');

    // 1. Seed Questions
    await Question.deleteMany({});
    await Question.insertMany(sampleQuestions);
    console.log(`[Seed] Successfully seeded ${sampleQuestions.length} curated assessment questions.`);

    // 2. Seed Companies
    await Company.deleteMany({});
    await Company.insertMany(sampleCompanies);
    console.log(`[Seed] Successfully seeded ${sampleCompanies.length} company profiles.`);

    if (config.env === 'production') {
      console.log('[Seed] Skipping demo accounts in production.');
      await disconnectDB();
      console.log('[Seed] Database seeding completed successfully.');
      process.exit(0);
    }

    // 3. Seed Default Test User: student@placementos.com
    await User.deleteMany({ email: { $in: ['student@placementos.com', 'admin@placementos.com'] } });

    const studentPass = await hashPassword('Placement@123');
    const studentUser = await User.create({
      fullName: 'Rahul Sharma',
      email: 'student@placementos.com',
      passwordHash: studentPass,
      role: 'student',
      status: 'active',
      isEmailVerified: true
    });

    const adminPass = await hashPassword('Placement@123');
    await User.create({
      fullName: 'PlacementOS Admin',
      email: 'admin@placementos.com',
      passwordHash: adminPass,
      role: 'admin',
      status: 'active',
      isEmailVerified: true
    });

    // Create Initial StudentProfile
    await StudentProfile.deleteMany({ user: studentUser._id });
    const profile = await StudentProfile.create({
      user: studentUser._id,
      degree: 'B.Tech Computer Science & Engineering',
      college: 'National Institute of Technology',
      graduationYear: 2026,
      currentSemester: 7,
      skills: [
        { name: 'Data Structures', category: 'technical', proficiency: 4, verifiedScore: 75 },
        { name: 'JavaScript / TypeScript', category: 'technical', proficiency: 4, verifiedScore: 80 },
        { name: 'React', category: 'technical', proficiency: 4, verifiedScore: 70 },
        { name: 'Node.js', category: 'technical', proficiency: 3, verifiedScore: 65 },
        { name: 'SQL', category: 'technical', proficiency: 3, verifiedScore: 60 }
      ],
      interests: ['Web Development', 'Distributed Systems'],
      targetRoles: ['Full Stack Developer', 'Software Engineer'],
      targetCompanies: ['Google', 'Microsoft', 'Razorpay'],
      expectedPackageLPA: 16,
      experienceLevel: 'fresher',
      dailyPrepTimeMinutes: 60,
      placementDeadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      projects: [
        {
          title: 'Campus Placement Portal',
          description: 'Full-stack portal for placement tracking with real-time analytics.',
          techStack: ['React', 'Node.js', 'MongoDB'],
          liveUrl: 'https://demo.placementos.dev',
          githubUrl: 'https://github.com/rahul/placementos'
        }
      ],
      certifications: [
        {
          title: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          issueDate: new Date('2025-01-15')
        }
      ],
      onboardingCompleted: true,
      currentReadinessScore: 68
    });

    // Create Gamification profile
    await Gamification.deleteMany({ student: studentUser._id });
    await Gamification.create({
      student: studentUser._id,
      totalXP: 250,
      currentStreakDays: 4,
      longestStreakDays: 7,
      lastActiveDate: new Date().toISOString().split('T')[0],
      readinessLevel: 'Job_Ready',
      unlockedBadges: [
        { badgeId: 'pioneer', badgeName: 'Placement Journey Started', unlockedAt: new Date() },
        { badgeId: 'profile_ready', badgeName: 'Profile Complete', unlockedAt: new Date() }
      ]
    });

    console.log('[Seed] Default test credentials created:');
    console.log('       Student: student@placementos.com / Placement@123');
    console.log('       Admin:   admin@placementos.com / Placement@123');

    await disconnectDB();
    console.log('[Seed] Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Database seeding error:', error);
    process.exit(1);
  }
}

seed();
