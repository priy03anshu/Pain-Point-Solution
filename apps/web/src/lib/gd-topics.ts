export interface GDTopic {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const DEFAULT_GD_TOPICS: GDTopic[] = [
  {
    id: 'topic-1',
    category: 'Technology & AI Ethics',
    title: 'Will Generative AI Eliminate Entry-Level Engineering Roles or Elevate Developer Productivity?',
    description: 'Debate impact on campus hiring, junior engineer career ladders, and shift from syntax to architecture.',
    difficulty: 'Medium'
  },
  {
    id: 'topic-2',
    category: 'Economy & Business Strategy',
    title: 'Is the Indian Startup Ecosystem Maturing or Overvalued: Growth vs Profitability?',
    description: 'Examine unit economics, venture funding winter, IPO readiness, and path-to-profitability mandates.',
    difficulty: 'Hard'
  },
  {
    id: 'topic-3',
    category: 'Work Culture & Ethics',
    title: 'Moonlighting: Ethical Violation of Company Trust or Employee Free-Market Right?',
    description: 'Explore dual employment in tech, IP security, conflict of interest, and sustainable work-life boundaries.',
    difficulty: 'Medium'
  },
  {
    id: 'topic-4',
    category: 'Campus & Career Readiness',
    title: 'Should College Degrees be Replaced by Skill-Based Micro-Credentials in Tech Placements?',
    description: 'Debate institutional pedagogy, peer networks, and rigorous foundations vs agile industry micro-skills.',
    difficulty: 'Easy'
  },
  {
    id: 'topic-5',
    category: 'Data & Privacy',
    title: 'Digital Personal Data Protection: Essential Citizen Right vs Friction for Tech Innovation?',
    description: 'Discuss user privacy rights, compliance overhead for startups, and cross-border AI training data.',
    difficulty: 'Hard'
  }
];
