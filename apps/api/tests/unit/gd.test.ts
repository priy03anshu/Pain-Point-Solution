import { GDService } from '../../src/modules/gd/gd.service';
import { connectDB, disconnectDB } from '../../src/config/database';

describe('AI Group Discussion Practice Room Engine (Unit Tests)', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test('Returns curated high-frequency campus placement GD topics', () => {
    const topics = GDService.getTopics();
    expect(topics.length).toBeGreaterThanOrEqual(4);
    expect(topics[0].title).toBeDefined();
    expect(topics[0].category).toBeDefined();
  });

  test('Creates live GD room with diverse AI participants and moderator opening', async () => {
    const session = await GDService.createSession(
      '6ac74980a49c849930ca23a2',
      'Will Generative AI Eliminate Entry-Level Engineering Roles?',
      10
    );

    expect(session.id).toBeDefined();
    expect(session.status).toBe('active');
    expect(session.aiParticipants.length).toBe(5);

    // Verify presence of diverse personas
    const personas = session.aiParticipants.map((p) => p.persona);
    expect(personas).toContain('aggressive');
    expect(personas).toContain('logical');
    expect(personas).toContain('fact_based');
    expect(personas).toContain('quiet');

    // Moderator opening exists
    expect(session.transcript.length).toBeGreaterThanOrEqual(2);
    expect(session.transcript[0].speakerName).toContain('Moderator');
  });

  test('Processes student intervention and triggers responsive AI peer debate', async () => {
    const session = await GDService.createSession(
      '6ac74980a49c849930ca23a2',
      'Should degrees be replaced by micro-credentials?',
      10
    );

    const result = await GDService.processStudentTurn(
      session.id,
      'Building on Priya’s point, while foundational degrees provide network rigor, micro-credentials allow rapid upskilling for modern tech requirements.',
      18
    );

    expect(result.studentTurn.isStudent).toBe(true);
    expect(result.studentTurn.message).toContain('Building on Priya’s point');
    expect(result.aiResponses.length).toBeGreaterThanOrEqual(1);

    // AI peers debate student & each other
    expect(result.aiResponses[0].isStudent).toBe(false);
  });

  test('Concludes session and generates 11-dimension scored feedback report', async () => {
    const session = await GDService.createSession(
      '6ac74980a49c849930ca23a2',
      'Moonlighting: Ethical violation or free-market right?',
      10
    );

    // Record two student turns
    await GDService.processStudentTurn(
      session.id,
      'First, from an intellectual property perspective, moonlighting creates conflicts of interest if working for competitors.',
      20
    );
    await GDService.processStudentTurn(
      session.id,
      'In conclusion, to summarize both sides, companies need transparent contracts rather than blanket bans.',
      25
    );

    const report = await GDService.concludeSession(session.id, '6ac74980a49c849930ca23a2');

    expect(report.overallScore).toBeGreaterThan(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);
    expect(report.tier).toBeDefined();

    // Verify all 11 metrics are scored
    expect(report.metrics.communication).toBeDefined();
    expect(report.metrics.confidence).toBeDefined();
    expect(report.metrics.clarity).toBeDefined();
    expect(report.metrics.relevance).toBeDefined();
    expect(report.metrics.leadership).toBeDefined();
    expect(report.metrics.listening).toBeDefined();
    expect(report.metrics.interruptionControl).toBeDefined();
    expect(report.metrics.vocabulary).toBeDefined();
    expect(report.metrics.argumentQuality).toBeDefined();
    expect(report.metrics.reasoning).toBeDefined();
    expect(report.metrics.conclusionQuality).toBeDefined();

    // Share of voice & strengths
    expect(report.speakingTimePercentage).toBeGreaterThan(0);
    expect(report.keyStrengths.length).toBeGreaterThan(0);
    expect(report.priorityFixes.length).toBeGreaterThan(0);
    expect(report.coachingAction).toBeDefined();
  });
});
