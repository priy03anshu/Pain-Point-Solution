import { RoadmapService } from '../../src/modules/roadmap/roadmap.service';
import { connectDB, disconnectDB } from '../../src/config/database';

describe('Reverse-Engineered Career Roadmapper Engine (Unit Tests)', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test('Generates structured roadmap with 4 phases and realistic nodes for Climate Tech target', async () => {
    const roadmap = await RoadmapService.generateRoadmap(
      'Full Stack Developer at a climate tech startup',
      15,
      6
    );

    expect(roadmap).toBeDefined();
    expect(roadmap.targetDreamJob).toBe('Full Stack Developer at a climate tech startup');
    expect(roadmap.phases.length).toBe(4);
    expect(roadmap.nodes.length).toBeGreaterThanOrEqual(8);
    expect(roadmap.edges.length).toBeGreaterThanOrEqual(7);

    // Initial node should be unlocked
    const initialNode = roadmap.nodes.find((n) => n.id === 'node-1');
    expect(initialNode).toBeDefined();
    expect(initialNode?.status).toBe('unlocked');

    // Deep-dive node contains realistic non-generic projects and github inspirations
    expect(initialNode?.realisticProject.title).toContain('Solar Grid');
    expect(initialNode?.realisticProject.techStack.length).toBeGreaterThan(0);
    expect(initialNode?.githubInspirations.length).toBeGreaterThan(0);
    expect(initialNode?.interviewQuestions.length).toBeGreaterThan(0);

    // Downstream nodes with prerequisites must be locked initially
    const downstreamNode = roadmap.nodes.find((n) => n.id === 'node-2');
    expect(downstreamNode?.status).toBe('locked');
    expect(downstreamNode?.prerequisites).toContain('node-1');

    // Precedent profiles ("People Who Walked This Path") must be generated
    expect(roadmap.precedentProfiles.length).toBeGreaterThanOrEqual(2);
    expect(roadmap.precedentProfiles[0].name).toBeDefined();
    expect(roadmap.precedentProfiles[0].keyBreakthroughProject).toBeDefined();
  });

  test('Dynamically propagates unlocks when a prerequisite node is completed', async () => {
    const roadmap = await RoadmapService.generateRoadmap(
      'Full Stack Developer at a climate tech startup',
      10,
      6
    );

    expect(roadmap.completionPercentage).toBe(0);

    // Toggle node-1 to completed
    const result = await RoadmapService.toggleNodeStatus(roadmap.id, 'node-1', 'completed');
    expect(result.completionPercentage).toBeGreaterThan(0);

    // node-2 and node-3 had only node-1 as a prerequisite; they should now be UNLOCKED!
    const updatedNode2 = result.nodes.find((n: any) => n.id === 'node-2');
    const updatedNode3 = result.nodes.find((n: any) => n.id === 'node-3');

    expect(updatedNode2?.status).toBe('unlocked');
    expect(updatedNode3?.status).toBe('unlocked');
  });

  test('Side-by-side role overlap analysis computes shared core and pivot timeline', () => {
    const comparison = RoadmapService.compareRoles(
      'Full Stack Developer at a climate tech startup',
      'UI/UX Designer for high-frequency fintech apps'
    );

    expect(comparison.overlapPercentage).toBeGreaterThan(0);
    expect(comparison.overlapPercentage).toBeLessThanOrEqual(100);
    expect(comparison.commonCoreSkills.length).toBeGreaterThan(0);
    expect(comparison.sharedFoundations.length).toBeGreaterThan(0);
    expect(comparison.pivotEstimatedWeeks).toBeGreaterThan(0);
    expect(comparison.recommendation).toContain('foundation');
  });
});
