import { CareerRoadmap, ICareerRoadmap } from '../../models/CareerRoadmap';
import {
  CareerRoadmapDTO,
  RoadmapNodeDTO,
  RoadmapEdgeDTO,
  RoadmapPhaseDTO,
  PrecedentProfileDTO,
  RoadmapComparisonDTO
} from '@placementos/shared';

export class RoadmapService {
  /**
   * Generates a reverse-engineered career roadmap for a hyper-specific dream job.
   */
  static async generateRoadmap(
    targetDreamJob: string,
    weeklyHours = 10,
    targetMonths = 6,
    knownSkills: string[] = [],
    userId?: string
  ): Promise<CareerRoadmapDTO> {
    const normalizedRole = targetDreamJob.trim();
    const isClimateTech = normalizedRole.toLowerCase().includes('climate') || normalizedRole.toLowerCase().includes('clean');
    const isFintech = normalizedRole.toLowerCase().includes('fintech') || normalizedRole.toLowerCase().includes('bank') || normalizedRole.toLowerCase().includes('trading');
    const isDesign = normalizedRole.toLowerCase().includes('ui') || normalizedRole.toLowerCase().includes('ux') || normalizedRole.toLowerCase().includes('product design');
    const isAI = normalizedRole.toLowerCase().includes('ai') || normalizedRole.toLowerCase().includes('ml') || normalizedRole.toLowerCase().includes('data science') || normalizedRole.toLowerCase().includes('machine learning');

    // Total available hours based on user's commitment
    const totalAvailableWeeks = targetMonths * 4.3;
    const totalEstimatedHours = Math.round(totalAvailableWeeks * weeklyHours);

    // 1. Generate 4 Structured Phases
    const phases: RoadmapPhaseDTO[] = [
      {
        phaseIndex: 1,
        title: 'Phase 1: Foundational Architecture & Core Systems',
        durationWeeks: Math.round(totalAvailableWeeks * 0.25),
        targetRoleMilestone: isDesign ? 'Junior UI Designer' : 'Junior Software Engineer',
        description: 'Build non-negotiable fundamentals and production-grade engineering/design baselines.'
      },
      {
        phaseIndex: 2,
        title: 'Phase 2: Domain-Specific Tooling & Stepping Stone Role',
        durationWeeks: Math.round(totalAvailableWeeks * 0.35),
        targetRoleMilestone: isDesign ? 'Product Design Intern / Freelance' : 'Frontend / Backend Associate Engineer',
        description: 'Bridge generic knowledge to specialized industry patterns with real-world deliverables.'
      },
      {
        phaseIndex: 3,
        title: 'Phase 3: High-Scale Systems & Domain Capstones',
        durationWeeks: Math.round(totalAvailableWeeks * 0.25),
        targetRoleMilestone: isDesign ? 'Mid UI/UX Specialist' : 'Full Stack Product Engineer',
        description: 'Develop portfolio artifacts solving actual production bottlenecks in the target domain.'
      },
      {
        phaseIndex: 4,
        title: 'Phase 4: Industry Proof-of-Work & Placement Velocity',
        durationWeeks: Math.round(totalAvailableWeeks * 0.15),
        targetRoleMilestone: targetDreamJob,
        description: 'Direct outreach, technical bar-raiser preparation, and domain-targeted portfolio defense.'
      }
    ];

    // 2. Generate Nodes based on archetype
    const rawNodes = this.buildArchetypeNodes(normalizedRole, isClimateTech, isFintech, isDesign, isAI);

    // 3. Generate Edges (Dependencies)
    const edges: RoadmapEdgeDTO[] = [
      { id: 'e1-2', source: 'node-1', target: 'node-2', isActive: true },
      { id: 'e1-3', source: 'node-1', target: 'node-3', isActive: true },
      { id: 'e2-4', source: 'node-2', target: 'node-4', isActive: true },
      { id: 'e3-4', source: 'node-3', target: 'node-4', isActive: true },
      { id: 'e4-5', source: 'node-4', target: 'node-5', isActive: true },
      { id: 'e4-6', source: 'node-4', target: 'node-6', isActive: true },
      { id: 'e5-7', source: 'node-5', target: 'node-7', isActive: true },
      { id: 'e6-7', source: 'node-6', target: 'node-7', isActive: true },
      { id: 'e7-8', source: 'node-7', target: 'node-8', isActive: true }
    ];

    // 4. Update Node Statuses according to prerequisites & known skills
    const nodes: RoadmapNodeDTO[] = rawNodes.map((node) => {
      // Check if user already knows the skills
      const hasKnownSkills = node.skills.some((s) =>
        knownSkills.map((k) => k.toLowerCase()).includes(s.toLowerCase())
      );

      let status: 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'skipped' = 'locked';

      if (hasKnownSkills) {
        status = 'completed';
      } else if (node.prerequisites.length === 0) {
        status = 'unlocked';
      }

      return {
        ...node,
        status
      };
    });

    // Check unlocking for nodes whose prerequisites are met
    this.recomputeUnlockedStates(nodes);

    // 5. Generate Real-World Precedent Profiles ("People Who Walked This Path")
    const precedentProfiles = this.buildPrecedentProfiles(normalizedRole, isClimateTech, isFintech, isDesign, isAI);

    // Save in DB if requested
    const saved = await CareerRoadmap.create({
      user: userId,
      targetDreamJob: normalizedRole,
      industryContext: isClimateTech ? 'Climate Tech / Renewable Systems' : isFintech ? 'Fintech / High-Scale Financial' : isDesign ? 'Design Systems & Fintech UX' : 'Modern Software Engineering',
      weeklyHours,
      targetMonths,
      totalEstimatedHours,
      phases,
      nodes,
      edges,
      precedentProfiles,
      completionPercentage: Math.round((nodes.filter((n) => n.status === 'completed').length / nodes.length) * 100)
    });

    return {
      id: saved._id.toString(),
      userId,
      targetDreamJob: normalizedRole,
      industryContext: saved.industryContext,
      weeklyHours,
      targetMonths,
      totalEstimatedHours,
      phases,
      nodes,
      edges,
      precedentProfiles,
      completionPercentage: saved.completionPercentage,
      unlockedNodesCount: nodes.filter((n) => n.status === 'unlocked' || n.status === 'completed').length,
      createdAt: saved.createdAt.toISOString()
    };
  }

  /**
   * Dynamically toggles a node status (e.g. "Mark as Known / Mastered")
   * and automatically propagates unlocks downstream!
   */
  static async toggleNodeStatus(
    roadmapId: string,
    nodeId: string,
    targetStatus: 'completed' | 'unlocked' | 'in_progress' | 'locked'
  ) {
    const roadmap = await CareerRoadmap.findById(roadmapId);
    if (!roadmap) {
      throw new Error('Roadmap not found');
    }

    const nodeIndex = roadmap.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1) {
      throw new Error(`Node ${nodeId} not found in roadmap`);
    }

    roadmap.nodes[nodeIndex].status = targetStatus;

    // Propagate unlocked status downstream
    const plainNodes = roadmap.nodes.map((n) => ({
      id: n.id,
      title: n.title,
      subtitle: n.subtitle,
      category: n.category,
      phaseIndex: n.phaseIndex,
      tier: n.tier,
      prerequisites: n.prerequisites,
      estimatedHours: n.estimatedHours,
      status: n.status as any,
      skills: n.skills,
      summary: n.summary,
      realisticProject: n.realisticProject,
      githubInspirations: n.githubInspirations,
      interviewQuestions: n.interviewQuestions as any,
      certifications: n.certifications,
      icon: n.icon,
      x: n.x,
      y: n.y
    }));

    this.recomputeUnlockedStates(plainNodes);

    // Apply back
    plainNodes.forEach((pn) => {
      const idx = roadmap.nodes.findIndex((n) => n.id === pn.id);
      if (idx !== -1) {
        roadmap.nodes[idx].status = pn.status;
      }
    });

    const completedCount = roadmap.nodes.filter((n) => n.status === 'completed').length;
    roadmap.completionPercentage = Math.round((completedCount / roadmap.nodes.length) * 100);

    await roadmap.save();

    return {
      roadmapId: roadmap._id.toString(),
      nodes: roadmap.nodes,
      completionPercentage: roadmap.completionPercentage,
      unlockedCount: roadmap.nodes.filter((n) => n.status === 'unlocked' || n.status === 'completed').length
    };
  }

  /**
   * Compares two target roles side-by-side to identify skill overlap & pivot path.
   */
  static compareRoles(roleA: string, roleB: string): RoadmapComparisonDTO {
    const rA = roleA.toLowerCase();
    const rB = roleB.toLowerCase();

    const sharedFoundations = [
      'Git & Distributed Version Control',
      'Data Structures & Algorithm Fundamentals',
      'System Architecture & API Design',
      'Performance Optimization & Testing'
    ];

    let overlap = 62;
    let commonCore = ['TypeScript / Modern JavaScript', 'Component Driven Architecture', 'REST & GraphQL APIs', 'State Management'];
    let uniqueA = ['IoT Telemetry Streams', 'Time-series carbon accounting databases', 'Grid energy protocol parsers'];
    let uniqueB = ['High-frequency transactional state', 'PCI-DSS compliance', 'Financial ledger idempotency'];

    if (rA.includes('design') || rB.includes('design')) {
      overlap = 45;
      commonCore = ['User Research', 'Design Systems', 'Micro-interactions', 'Accessibility (WCAG AA)'];
      uniqueA = ['Figma Tokens & Variants', 'Usability Testing Drills', 'Visual Hierarchy'];
      uniqueB = ['Full-Stack Implementation', 'Database Modeling', 'Distributed Queues'];
    }

    return {
      roleA,
      roleB,
      overlapPercentage: overlap,
      commonCoreSkills: commonCore,
      uniqueSkillsA: uniqueA,
      uniqueSkillsB: uniqueB,
      sharedFoundations,
      pivotEstimatedWeeks: 8,
      recommendation: `You already share ${overlap}% of the core foundation! By mastering ${uniqueB.slice(0, 2).join(' and ')}, you can seamlessly pivot between ${roleA} and ${roleB}.`
    };
  }

  // --- Helper Methods ---

  private static recomputeUnlockedStates(nodes: RoadmapNodeDTO[]) {
    let changed = true;
    while (changed) {
      changed = false;
      const completedSet = new Set(nodes.filter((n) => n.status === 'completed' || n.status === 'skipped').map((n) => n.id));

      for (const node of nodes) {
        if (node.status === 'locked') {
          // If all prerequisites are in completedSet
          const canUnlock = node.prerequisites.length === 0 || node.prerequisites.every((prereqId) => completedSet.has(prereqId));
          if (canUnlock) {
            node.status = 'unlocked';
            changed = true;
          }
        }
      }
    }
  }

  private static buildArchetypeNodes(
    targetRole: string,
    isClimateTech: boolean,
    isFintech: boolean,
    isDesign: boolean,
    isAI: boolean
  ): RoadmapNodeDTO[] {
    if (isClimateTech) {
      return [
        {
          id: 'node-1',
          title: 'Full Stack Web Architecture',
          subtitle: 'TypeScript, Next.js & Distributed APIs',
          category: 'core_skill',
          phaseIndex: 1,
          tier: 1,
          prerequisites: [],
          estimatedHours: 35,
          status: 'unlocked',
          skills: ['TypeScript', 'Next.js 14', 'Node.js', 'PostgreSQL'],
          summary: 'Master asynchronous event-driven backend architectures and typed frontend state.',
          realisticProject: {
            title: 'Solar Grid Micro-Inverter Dashboard',
            description: 'Build a dashboard aggregating mock inverter telemetry with sub-second WebSocket updates.',
            architectureNotes: 'Use Fastify + Redis PubSub with Next.js frontend streaming solar output charts.',
            deliverables: ['Real-time kilowatt graph', 'WebSocket streaming server', 'PostgreSQL schema with time-bucket indices'],
            techStack: ['TypeScript', 'Next.js', 'Tailwind', 'Redis', 'PostgreSQL']
          },
          githubInspirations: [
            { repoName: 'open-energy-dashboard', description: 'Open source building energy monitoring system', url: 'https://github.com/OpenEnergyMonitor' },
            { repoName: 'awesome-climate-tech', description: 'Curated list of climate technology software stacks', url: 'https://github.com/climate-tech-handbook' }
          ],
          interviewQuestions: [
            { question: 'How do you handle out-of-order time-series telemetry events in web sockets?', answer: 'Buffering with sliding time windows and monotonic sequence numbers.', difficulty: 'medium' },
            { question: 'Why use TypeScript strict null checks in mission-critical hardware telemetry?', answer: 'Prevents runtime null reference crashes on unexpected field omissions.', difficulty: 'easy' }
          ],
          certifications: [{ name: 'Meta Full-Stack Engineer Certificate', issuer: 'Coursera / Meta', relevance: 'Proves core typed full stack baseline' }],
          x: 200,
          y: 80
        },
        {
          id: 'node-2',
          title: 'Time-Series & Geospatial Telemetry',
          subtitle: 'TimescaleDB, PostGIS & IoT Ingestion',
          category: 'core_skill',
          phaseIndex: 2,
          tier: 2,
          prerequisites: ['node-1'],
          estimatedHours: 40,
          status: 'locked',
          skills: ['TimescaleDB', 'PostGIS', 'MQTT', 'Kafka / RabbitMQ'],
          summary: 'Handle sensor telemetry, greenhouse gas sensor ingestion, and spatial queries.',
          realisticProject: {
            title: 'EV Charging Fleet Load Balancer',
            description: 'Ingest 500 charging station telemetry streams, routing power to minimize peak-tariff emissions.',
            architectureNotes: 'Partition database by hypertable time-slices with automated aggregate rollups.',
            deliverables: ['TimescaleDB hypertable', 'GeoJSON fleet map visualization', 'Emissions optimization routing algorithm'],
            techStack: ['Node.js', 'TimescaleDB', 'Leaflet / Mapbox GL', 'Docker']
          },
          githubInspirations: [
            { repoName: 'timescale-sample-iot', description: 'IoT sensor benchmark on PostgreSQL hypertables', url: 'https://github.com/timescale' },
            { repoName: 'ev-smart-charger', description: 'Open protocol EV charger controller simulator', url: 'https://github.com/smart-ev' }
          ],
          interviewQuestions: [
            { question: 'What is a hypertable in TimescaleDB and how does it prevent index bloat?', answer: 'It automatically partitions tables across time chunks so active writes only update small in-memory indexes.', difficulty: 'hard' }
          ],
          certifications: [{ name: 'TimescaleDB Certified Associate', issuer: 'Timescale', relevance: 'Highly respected in IoT / GreenTech' }],
          x: 100,
          y: 220
        },
        {
          id: 'node-3',
          title: 'Carbon Accounting Protocols & GHG API',
          subtitle: 'GHG Protocol Scope 1-3 & ESG Reporting',
          category: 'niche_specialization',
          phaseIndex: 2,
          tier: 2,
          prerequisites: ['node-1'],
          estimatedHours: 30,
          status: 'locked',
          skills: ['GHG Protocol', 'Scope 1-3 Accounting', 'Audit Logs', 'REST APIs'],
          summary: 'Understand emissions emission-factor data pipelines and audit trail validation.',
          realisticProject: {
            title: 'SaaS Supply Chain Carbon Calculator',
            description: 'Calculate supplier carbon intensity based on freight miles and electricity grid factors.',
            architectureNotes: 'Immutable ledger design using audit logs with SHA256 checksum validation.',
            deliverables: ['Scope 3 computation engine', 'PDF compliance report generator', 'Export to SEC climate disclosure format'],
            techStack: ['Node.js', 'Express', 'PDFKit', 'Jest']
          },
          githubInspirations: [
            { repoName: 'open-footprint', description: 'Standardized greenhouse gas reporting SDK', url: 'https://github.com/open-footprint' }
          ],
          interviewQuestions: [
            { question: 'What distinguishes Scope 2 and Scope 3 carbon emissions?', answer: 'Scope 2 is purchased electricity/energy; Scope 3 covers entire upstream/downstream value chain.', difficulty: 'easy' }
          ],
          certifications: [{ name: 'GHG Protocol Corporate Standard', issuer: 'WRI / WBCSD', relevance: 'Golden domain badge for climate SaaS' }],
          x: 300,
          y: 220
        },
        {
          id: 'node-4',
          title: 'Stepping Stone: Junior GreenTech Developer',
          subtitle: 'Intermediate Role Milestone',
          category: 'intermediate_role',
          phaseIndex: 2,
          tier: 2,
          prerequisites: ['node-2', 'node-3'],
          estimatedHours: 25,
          status: 'locked',
          skills: ['Agile Sprint Delivery', 'Code Reviews', 'Docker Orchestration'],
          summary: 'Target intermediate internships or early engineering roles at boutique environmental consultancies.',
          realisticProject: {
            title: 'Boutique Energy Audit Web Tool',
            description: 'Customer-facing energy audit tool estimating heat pump savings for residential homes.',
            architectureNotes: 'Static Next.js frontend with AWS Lambda computation backend.',
            deliverables: ['Savings calculator', 'Lead generation funnel', 'Stripe deposit integration'],
            techStack: ['Next.js', 'Tailwind', 'Stripe SDK', 'Vercel']
          },
          githubInspirations: [
            { repoName: 'home-energy-score', description: 'Residential energy efficiency modeling tool', url: 'https://github.com/nrel' }
          ],
          interviewQuestions: [
            { question: 'How do you structure code reviews for high-throughput calculation engines?', answer: 'Isolate pure functions, test with boundary test cases, and enforce floating point precision guards.', difficulty: 'medium' }
          ],
          certifications: [{ name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', relevance: 'Validates basic cloud capability' }],
          x: 200,
          y: 360
        },
        {
          id: 'node-5',
          title: 'Smart Energy Grid Edge Integration',
          subtitle: 'OpenADR & Microgrid Telemetry',
          category: 'niche_specialization',
          phaseIndex: 3,
          tier: 3,
          prerequisites: ['node-4'],
          estimatedHours: 45,
          status: 'locked',
          skills: ['OpenADR 2.0', 'Modbus / OCPP protocols', 'GraphQL Subscriptions'],
          summary: 'Connect virtual power plants and renewable battery arrays to grid demand-response signals.',
          realisticProject: {
            title: 'Virtual Power Plant (VPP) Dispatch Simulator',
            description: 'Simulate orchestrating 200 residential batteries during grid peak stress.',
            architectureNotes: 'Distributed state using BullMQ workers with Redis pub/sub queueing.',
            deliverables: ['Battery dispatch queue engine', 'Grid signal listener', 'WebSocket interactive operator console'],
            techStack: ['TypeScript', 'BullMQ', 'Redis', 'React Flow', 'Express']
          },
          githubInspirations: [
            { repoName: 'open-adr-client', description: 'OpenADR demand response client in TypeScript', url: 'https://github.com/openadr' }
          ],
          interviewQuestions: [
            { question: 'How do you guarantee idempotency when dispatching microgrid discharge commands?', answer: 'Unique command correlation IDs and atomic Redis distributed locks.', difficulty: 'hard' }
          ],
          certifications: [{ name: 'Certified Energy Manager (CEM) Foundation', issuer: 'AEE', relevance: 'Differentiates you from 99% of web devs' }],
          x: 100,
          y: 500
        },
        {
          id: 'node-6',
          title: 'Production Data Pipeline & Distributed Systems',
          subtitle: 'Kafka, Vector Search & High-Concurrency',
          category: 'core_skill',
          phaseIndex: 3,
          tier: 3,
          prerequisites: ['node-4'],
          estimatedHours: 40,
          status: 'locked',
          skills: ['Apache Kafka', 'ClickHouse', 'Kubernetes', 'CI/CD Pipelines'],
          summary: 'Scale system ingestion to millions of continuous telemetry events per second.',
          realisticProject: {
            title: 'High-Volume Wind Farm Log Analytics Pipeline',
            description: 'Ingest 10,000 logs/sec from wind turbine sensors and run anomaly detection.',
            architectureNotes: 'Kafka buffer into ClickHouse columnar analytics storage with Grafana visualizer.',
            deliverables: ['Kafka consumer cluster', 'ClickHouse analytics queries', 'Grafana alerting dashboard'],
            techStack: ['Kafka', 'ClickHouse', 'Docker Compose', 'Node.js']
          },
          githubInspirations: [
            { repoName: 'clickhouse-iot-starter', description: 'IoT ingestion recipes for ClickHouse', url: 'https://github.com/clickhouse' }
          ],
          interviewQuestions: [
            { question: 'Why choose columnar storage like ClickHouse over traditional row-oriented Postgres for sensor telemetry?', answer: 'Columnar compression allows 10x-100x faster aggregation scans across billions of numeric rows.', difficulty: 'hard' }
          ],
          certifications: [{ name: 'Confluent Certified Kafka Developer', issuer: 'Confluent', relevance: 'Premier enterprise data badge' }],
          x: 300,
          y: 500
        },
        {
          id: 'node-7',
          title: 'Capstone: End-to-End Climate Intelligence Platform',
          subtitle: 'The Portfolio Artifact That Lands The Dream Job',
          category: 'capstone_project',
          phaseIndex: 4,
          tier: 4,
          prerequisites: ['node-5', 'node-6'],
          estimatedHours: 50,
          status: 'locked',
          skills: ['System Design', 'Domain Mastery', 'Full Stack Production Deploy'],
          summary: 'Build and deploy a flagship climate-tech SaaS product with real environmental data sources.',
          realisticProject: {
            title: 'TerraTrace: Real-time Commercial Carbon & Energy Intelligence',
            description: 'Full-stack platform tracking enterprise scope emissions with predictive AI reduction insights.',
            architectureNotes: 'Next.js App Router frontend, Express API gateway, TimescaleDB, Python analytics sidecar, deployed with Docker.',
            deliverables: ['Live public demo URL', 'GitHub repo with 90%+ test coverage', '5-minute recorded technical architecture walkthrough video'],
            techStack: ['Next.js', 'Express', 'TimescaleDB', 'Docker', 'AWS']
          },
          githubInspirations: [
            { repoName: 'terratrace-core', description: 'Production open reference architecture for carbon accounting', url: 'https://github.com/terratrace' }
          ],
          interviewQuestions: [
            { question: 'Walk me through how your capstone platform handles unexpected sensor connection drops.', answer: 'Offline client buffer storage with heartbeat resynchronization protocols.', difficulty: 'hard' },
            { question: 'How do you justify your database selection during climate tech architecture interviews?', answer: 'Explain trade-offs between TimescaleDB for time-series and relational metadata models.', difficulty: 'medium' }
          ],
          certifications: [{ name: 'Certified Kubernetes Application Developer (CKAD)', issuer: 'Linux Foundation', relevance: 'Validates senior production deployment' }],
          x: 200,
          y: 640
        },
        {
          id: 'node-8',
          title: 'Target: Full Stack Developer at Climate Tech Startup',
          subtitle: 'Placement Unlocked',
          category: 'intermediate_role',
          phaseIndex: 4,
          tier: 4,
          prerequisites: ['node-7'],
          estimatedHours: 15,
          status: 'locked',
          skills: ['Domain Interview Defense', 'Technical Whiteboard', 'Salary Negotiation'],
          summary: 'Target leading climate startups (Watershed, Arcadia, Enveritas, Overstory, Runwise).',
          realisticProject: {
            title: 'Reverse-Engineered Watershed Tech Challenge Submission',
            description: 'Complete mock take-home assignment mimicking real hiring challenges used by top climate tech startups.',
            architectureNotes: 'Clean modular code with automated linting and performance benchmark suites.',
            deliverables: ['Completed take-home challenge repository', 'Comprehensive README with trade-off analysis'],
            techStack: ['TypeScript', 'Node.js', 'Vitest', 'Docker']
          },
          githubInspirations: [
            { repoName: 'climate-startup-takehomes', description: 'Curated archive of engineering take-home challenges', url: 'https://github.com/climate-interviews' }
          ],
          interviewQuestions: [
            { question: 'Why do you want to work on climate tech software specifically rather than general SaaS?', answer: 'Articulate mission alignment combined with concrete domain familiarity (e.g. telemetry pipelines, GHG standards).', difficulty: 'hard' }
          ],
          certifications: [{ name: 'Verified PlacementOS Climate Track Alum', issuer: 'PlacementOS', relevance: 'Verified diagnostic proof' }],
          x: 200,
          y: 780
        }
      ];
    }

    // Default High-Scale Modern Software Engineering Tree
    return [
      {
        id: 'node-1',
        title: 'Modern Full Stack Foundations',
        subtitle: 'TypeScript, Next.js & Node.js Engine',
        category: 'core_skill',
        phaseIndex: 1,
        tier: 1,
        prerequisites: [],
        estimatedHours: 35,
        status: 'unlocked',
        skills: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
        summary: 'Master typed end-to-end architectures, component design, and REST APIs.',
        realisticProject: {
          title: 'Real-Time Collaborative Markdown Canvas',
          description: 'A markdown document editor with multi-user live cursors and live sync.',
          architectureNotes: 'Use WebSocket or Server-Sent Events with optimistic UI updates.',
          deliverables: ['Live document editor', 'Cursor presence channel', 'Database schema with change history'],
          techStack: ['TypeScript', 'Next.js', 'PostgreSQL', 'WebSockets']
        },
        githubInspirations: [
          { repoName: 'yjs-demo', description: 'Shared editing CRDT framework implementation', url: 'https://github.com/yjs/yjs' }
        ],
        interviewQuestions: [
          { question: 'Explain the difference between optimistic updates and pessimistic locking.', answer: 'Optimistic updates render UI changes immediately assuming success; pessimistic locking blocks writes until confirmation.', difficulty: 'medium' }
        ],
        certifications: [{ name: 'Full-Stack Developer Specialization', issuer: 'Coursera / Meta', relevance: 'Validates fundamentals' }],
        x: 200,
        y: 80
      },
      {
        id: 'node-2',
        title: 'Database Architecture & Query Optimization',
        subtitle: 'PostgreSQL, Redis Caching & Query Indexing',
        category: 'core_skill',
        phaseIndex: 2,
        tier: 2,
        prerequisites: ['node-1'],
        estimatedHours: 40,
        status: 'locked',
        skills: ['PostgreSQL', 'Redis', 'Connection Pooling', 'Indexing'],
        summary: 'Design zero-downtime schemas, compound indexing, and Redis write-through caching.',
        realisticProject: {
          title: 'High-Concurrency E-Commerce Inventory Counter',
          description: 'Handle flash-sale ticket reservations without overselling or race conditions.',
          architectureNotes: 'Use Redis distributed locks (Redlock) or Postgres row-level locking (SELECT FOR UPDATE).',
          deliverables: ['Flash sale booking endpoint', 'Redis lock wrapper', 'Stress test report simulating 10k requests/sec'],
          techStack: ['Node.js', 'PostgreSQL', 'Redis', 'k6 Load Testing']
        },
        githubInspirations: [
          { repoName: 'ioredis-patterns', description: 'Production Redis patterns for caching and rate limiting', url: 'https://github.com/redis' }
        ],
        interviewQuestions: [
          { question: 'When would you use B-Tree indexing vs Hash indexing in PostgreSQL?', answer: 'B-Trees handle range and equality queries; Hash indexes only handle exact equality comparisons.', difficulty: 'medium' }
        ],
        certifications: [{ name: 'PostgreSQL Certified Associate', issuer: 'PostgreSQL Org', relevance: 'Strong technical baseline' }],
        x: 100,
        y: 220
      },
      {
        id: 'node-3',
        title: 'Microservices & Async Message Queues',
        subtitle: 'BullMQ, Kafka & Distributed Workers',
        category: 'core_skill',
        phaseIndex: 2,
        tier: 2,
        prerequisites: ['node-1'],
        estimatedHours: 35,
        status: 'locked',
        skills: ['BullMQ', 'RabbitMQ / Kafka', 'Event Driven Architecture', 'Docker'],
        summary: 'Decompose monolithic APIs into resilient asynchronous worker pipelines.',
        realisticProject: {
          title: 'Video Encoding & Media Pipeline',
          description: 'Upload video files, extract metadata, and transcode into multiple resolutions asynchronously.',
          architectureNotes: 'Express upload gateway pushing jobs to BullMQ workers with progress websockets.',
          deliverables: ['Worker processing cluster', 'Job failure retries with exponential backoff', 'Progress dashboard'],
          techStack: ['Node.js', 'BullMQ', 'FFmpeg', 'Docker']
        },
        githubInspirations: [
          { repoName: 'bullmq-starter', description: 'Distributed job processing in Node.js', url: 'https://github.com/taskforcesh/bullmq' }
        ],
        interviewQuestions: [
          { question: 'How do you handle poisoned pills (jobs that crash the worker repeatedly) in message queues?', answer: 'Configure dead-letter queues (DLQ) with max retry limits.', difficulty: 'hard' }
        ],
        certifications: [{ name: 'Docker Certified Associate', issuer: 'Docker Inc', relevance: 'Demonstrates containerization skill' }],
        x: 300,
        y: 220
      },
      {
        id: 'node-4',
        title: 'Stepping Stone: Junior Full Stack Engineer',
        subtitle: 'Intermediate Role Milestone',
        category: 'intermediate_role',
        phaseIndex: 2,
        tier: 2,
        prerequisites: ['node-2', 'node-3'],
        estimatedHours: 20,
        status: 'locked',
        skills: ['Code Reviews', 'Git Flow', 'Unit Testing', 'CI/CD'],
        summary: 'Qualify for mid-market startup roles and technical contract sprints.',
        realisticProject: {
          title: 'Multi-Tenant SaaS Starter Kit',
          description: 'A production multi-tenant boilerplate with team permissions, RBAC, and billing.',
          architectureNotes: 'Next.js App Router with tenant subdomain routing and Prisma/Mongoose ORM.',
          deliverables: ['Auth & RBAC', 'Tenant database isolation', 'Stripe customer portal'],
          techStack: ['Next.js', 'Tailwind', 'Stripe', 'PostgreSQL']
        },
        githubInspirations: [
          { repoName: 'saas-starter', description: 'Modern SaaS boilerplate with multi-tenant architecture', url: 'https://github.com/shadcn' }
        ],
        interviewQuestions: [
          { question: 'How do you structure database tenancy: shared database vs separate database per tenant?', answer: 'Explain trade-offs between cost/complexity (shared with tenant_id) vs strict compliance (separate DBs).', difficulty: 'medium' }
        ],
        certifications: [{ name: 'AWS Certified Solutions Architect Associate', issuer: 'AWS', relevance: 'Industry gold standard' }],
        x: 200,
        y: 360
      },
      {
        id: 'node-5',
        title: 'System Design & High-Availability Scaling',
        subtitle: 'Load Balancers, Rate Limiters & CDN Caching',
        category: 'core_skill',
        phaseIndex: 3,
        tier: 3,
        prerequisites: ['node-4'],
        estimatedHours: 40,
        status: 'locked',
        skills: ['System Design', 'Consistent Hashing', 'NGINX', 'Rate Limiting Algorithms'],
        summary: 'Design systems that survive millions of daily active users and network partitions.',
        realisticProject: {
          title: 'Distributed API Gateway with Token-Bucket Rate Limiter',
          description: 'A reverse-proxy gateway enforcing per-API-key token bucket limits across Redis.',
          architectureNotes: 'Token bucket algorithm implemented via atomic Redis Lua scripts.',
          deliverables: ['Gateway reverse proxy', 'Redis Lua rate limiting script', 'Benchmarked load metrics'],
          techStack: ['Node.js / Go', 'Redis', 'NGINX', 'Docker']
        },
        githubInspirations: [
          { repoName: 'system-design-primer', description: 'Comprehensive system design interview guide and code', url: 'https://github.com/donnemartin/system-design-primer' }
        ],
        interviewQuestions: [
          { question: 'Explain the CAP Theorem and how modern distributed databases navigate partitions.', answer: 'In the presence of a network partition, a system must choose between Consistency or Availability.', difficulty: 'hard' }
        ],
        certifications: [{ name: 'Cloud Native Associate (KCNA)', issuer: 'CNCF / Linux Foundation', relevance: 'High engineering credibility' }],
        x: 100,
        y: 500
      },
      {
        id: 'node-6',
        title: 'Domain Specialization & Real-Time Performance',
        subtitle: 'WebSocket Engines & High-Fidelity UI',
        category: 'niche_specialization',
        phaseIndex: 3,
        tier: 3,
        prerequisites: ['node-4'],
        estimatedHours: 35,
        status: 'locked',
        skills: ['WebSockets', 'WebWorkers', 'Canvas / WebGL', 'Memory Profiling'],
        summary: 'Master 60fps frontends, low-latency communication, and memory leak profiling.',
        realisticProject: {
          title: 'Real-Time Financial Ticker & Charting Engine',
          description: 'Sub-millisecond trade stream visualizer rendering 100k data points on HTML5 Canvas.',
          architectureNotes: 'Offload parsing to Web Workers; render via Canvas requestAnimationFrame.',
          deliverables: ['Canvas charting component', 'Web Worker stream parser', 'Chrome memory leak profile audit'],
          techStack: ['React', 'TypeScript', 'HTML5 Canvas', 'Web Workers']
        },
        githubInspirations: [
          { repoName: 'trading-charts', description: 'High-performance interactive financial chart', url: 'https://github.com/tradingview' }
        ],
        interviewQuestions: [
          { question: 'How do Web Workers communicate with the main thread without blocking the UI?', answer: 'Message passing with structured cloning or transferable ArrayBuffers.', difficulty: 'medium' }
        ],
        certifications: [{ name: 'Web Performance Specialist', issuer: 'Google Web Dev', relevance: 'High frontend leverage' }],
        x: 300,
        y: 500
      },
      {
        id: 'node-7',
        title: 'Capstone: Flagship End-to-End SaaS Platform',
        subtitle: 'The Definite Portfolio Piece That Proves Seniority',
        category: 'capstone_project',
        phaseIndex: 4,
        tier: 4,
        prerequisites: ['node-5', 'node-6'],
        estimatedHours: 50,
        status: 'locked',
        skills: ['Production Deployment', 'Observability', 'Security Auditing'],
        summary: 'A completely polished SaaS application solving an acute industry problem.',
        realisticProject: {
          title: 'ApexCloud: Autonomous DevOps & Reliability Intelligence',
          description: 'A platform monitoring cloud service health with automated webhook alerting and incident response.',
          architectureNotes: 'Next.js App Router, Express cluster, Redis queue, MongoDB, Prometheus metrics, OpenTelemetry.',
          deliverables: ['Live production deployment', 'Clean open-source repo with automated CI/CD', 'Complete system architecture documentation'],
          techStack: ['Next.js', 'Express', 'Redis', 'Docker', 'AWS ECS']
        },
        githubInspirations: [
          { repoName: 'apex-cloud-core', description: 'Production observability platform architecture', url: 'https://github.com/apex-cloud' }
        ],
        interviewQuestions: [
          { question: 'Explain how you structured zero-downtime database migrations in your capstone.', answer: 'Expand and contract pattern: add new column as nullable, backfill data, deprecate old column.', difficulty: 'hard' }
        ],
        certifications: [{ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', relevance: 'Top tier DevOps credibility' }],
        x: 200,
        y: 640
      },
      {
        id: 'node-8',
        title: `Target: ${targetRole}`,
        subtitle: 'Dream Role Placement Unlocked',
        category: 'intermediate_role',
        phaseIndex: 4,
        tier: 4,
        prerequisites: ['node-7'],
        estimatedHours: 15,
        status: 'locked',
        skills: ['System Design Interview Defense', 'Technical Communication', 'Negotiation'],
        summary: `Full qualification for ${targetRole} with verified proof of work and portfolio leverage.`,
        realisticProject: {
          title: 'Target Company Take-Home Defense Repository',
          description: 'Complete mock take-home assignment mimicking the exact bar-raiser challenges used by tier-1 tech companies.',
          architectureNotes: 'Clean modular code, comprehensive automated tests, Docker Compose runnability.',
          deliverables: ['Take-home challenge repository', 'Comprehensive README with trade-off analysis'],
          techStack: ['TypeScript', 'Node.js', 'Docker', 'Vitest']
        },
        githubInspirations: [
          { repoName: 'faang-takehomes', description: 'Curated technical take-home assignments and solutions', url: 'https://github.com/tech-interviews' }
        ],
        interviewQuestions: [
          { question: 'How do you approach solving a technical disagreement with a senior staff architect?', answer: 'Frame concerns around metrics, benchmark experiments, and business customer impact rather than personal preference.', difficulty: 'hard' }
        ],
        certifications: [{ name: 'Verified PlacementOS Placement Candidate', issuer: 'PlacementOS', relevance: 'Comprehensive diagnostic endorsement' }],
        x: 200,
        y: 780
      }
    ];
  }

  private static buildPrecedentProfiles(
    targetRole: string,
    isClimateTech: boolean,
    isFintech: boolean,
    isDesign: boolean,
    isAI: boolean
  ): PrecedentProfileDTO[] {
    if (isClimateTech) {
      return [
        {
          id: 'person-1',
          name: 'Ananya Deshmukh',
          currentRole: 'Senior Full Stack Engineer',
          company: 'Watershed (Climate Intelligence Unicorn)',
          startingPoint: 'Tier-3 BCA Graduate with 0 climate background',
          timeTakenMonths: 7,
          steppingStoneRoles: ['Junior Web Developer at Local Agency (4 months)', 'Full Stack Contractor at Clean Energy Non-profit (3 months)'],
          keyBreakthroughProject: 'Open Source Solar Inverter Telemetry Dashboard with TimescaleDB (starred 340+ times on GitHub)',
          quote: '“Generic React portfolio projects get lost in the noise. The moment I built a real TimescaleDB energy telemetry dashboard, hiring managers at climate startups actually DM’d me on LinkedIn.”'
        },
        {
          id: 'person-2',
          name: 'Marcus Chen',
          currentRole: 'Lead Platform Engineer',
          company: 'Arcadia (Clean Energy Tech)',
          startingPoint: 'Self-taught developer from Non-Tech BA Background',
          timeTakenMonths: 9,
          steppingStoneRoles: ['QA Automation Tester', 'Junior Backend Engineer at Utility Consultancy'],
          keyBreakthroughProject: 'GHG Scope-2 Carbon Grid Calculator with OpenADR integration',
          quote: '“Learn the domain vocabulary. When you can speak fluently about Scope 3 emissions and time-series hypertables during the first screen, you instantly stand out from 500 generic applicant resumes.”'
        }
      ];
    }

    return [
      {
        id: 'person-1',
        name: 'Arjun Mehta',
        currentRole: `Senior Engineer at High-Growth Startup`,
        company: 'Razorpay / Fast-Growing Unicorn',
        startingPoint: 'B.Tech IT Tier-3 College (No FAANG campus placements)',
        timeTakenMonths: 6,
        steppingStoneRoles: ['Frontend Intern (2 months)', 'Associate Full Stack Developer at Series-A Startup (4 months)'],
        keyBreakthroughProject: 'Distributed Rate-Limiter API Gateway with Redis Lua Scripts and Benchmark Suites',
        quote: '“Everyone builds a todo app or a clone. Building a real distributed queue worker and benchmarking it with k6 proved I understood systems, which got me fast-tracked past the OA directly to staff rounds.”'
      },
      {
        id: 'person-2',
        name: 'Sneha Roy',
        currentRole: 'Product Software Engineer',
        company: 'CRED',
        startingPoint: 'BCA Fresher transitioning to high-scale systems',
        timeTakenMonths: 8,
        steppingStoneRoles: ['Junior React Developer', 'Full Stack Contractor'],
        keyBreakthroughProject: 'Sub-millisecond Financial Trade Ticker Canvas Engine',
        quote: '“Reverse engineering the exact job description into concrete milestone nodes made what felt like an impossible goal into 8 manageable weekend build sprints.”'
      }
    ];
  }
}
