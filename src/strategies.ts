import { ROBOT_ORDER, ROBOT_TYPES } from "./robots";
import type {
  Candidate,
  EvaluatedCandidate,
  Inventory,
  RobotCounts,
} from "./types";

export function emptyCounts(): RobotCounts {
  return { Bravo: 0, Charlie: 0, Delta: 0 };
}

function cloneCounts(counts: RobotCounts): RobotCounts {
  return { ...counts };
}

export function totalRobots(counts: RobotCounts): number {
  return ROBOT_ORDER.reduce((sum, type) => sum + counts[type], 0);
}

export function capacityForCounts(counts: RobotCounts): number {
  return ROBOT_ORDER.reduce(
    (total, type) =>
      total + counts[type] * ROBOT_TYPES[type].workingHoursPerDay,
    0,
  );
}

function strategyLevel(counts: RobotCounts): number {
  const usedTypes = ROBOT_ORDER.filter((type) => counts[type] > 0);

  if (usedTypes.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const hasTeam =
    counts.Bravo >= 1 && counts.Charlie >= 1 && counts.Delta >= 1;

  if (usedTypes.length === 3 && hasTeam) {
    return 4;
  }

  if (usedTypes.length === 1) {
    return ROBOT_TYPES[usedTypes[0]].level;
  }

  return 5;
}

function generateLevel1Candidates(inventory: Inventory): Candidate[] {
  const candidates: Candidate[] = [];

  for (let bravo = 0; bravo <= inventory.Bravo; bravo += 1) {
    const counts = emptyCounts();
    counts.Bravo = bravo;
    if (totalRobots(counts) > 0) {
      candidates.push({ counts, level: 1, name: "Bravo-only" });
    }
  }

  return candidates;
}

function generateLevel2Candidates(inventory: Inventory): Candidate[] {
  const candidates: Candidate[] = [];

  for (let charlie = 0; charlie <= inventory.Charlie; charlie += 1) {
    const counts = emptyCounts();
    counts.Charlie = charlie;
    if (totalRobots(counts) > 0) {
      candidates.push({ counts, level: 2, name: "Charlie-only" });
    }
  }

  return candidates;
}

function generateLevel3Candidates(inventory: Inventory): Candidate[] {
  const candidates: Candidate[] = [];

  for (let delta = 0; delta <= inventory.Delta; delta += 1) {
    const counts = emptyCounts();
    counts.Delta = delta;
    if (totalRobots(counts) > 0) {
      candidates.push({ counts, level: 3, name: "Delta-only" });
    }
  }

  return candidates;
}

function generateLevel4Candidates(inventory: Inventory): Candidate[] {
  const candidates: Candidate[] = [];

  for (let bravo = 1; bravo <= inventory.Bravo; bravo += 1) {
    for (let charlie = 1; charlie <= inventory.Charlie; charlie += 1) {
      for (let delta = 1; delta <= inventory.Delta; delta += 1) {
        const counts = emptyCounts();
        counts.Bravo = bravo;
        counts.Charlie = charlie;
        counts.Delta = delta;
        candidates.push({ counts, level: 4, name: "Balanced team" });
      }
    }
  }

  return candidates;
}

function generateAllCandidates(inventory: Inventory): Candidate[] {
  const candidates: Candidate[] = [];

  for (let bravo = 0; bravo <= inventory.Bravo; bravo += 1) {
    for (let charlie = 0; charlie <= inventory.Charlie; charlie += 1) {
      for (let delta = 0; delta <= inventory.Delta; delta += 1) {
        if (bravo + charlie + delta === 0) {
          continue;
        }

        const counts = emptyCounts();
        counts.Bravo = bravo;
        counts.Charlie = charlie;
        counts.Delta = delta;

        candidates.push({
          counts,
          level: strategyLevel(counts),
          name: "Mixed",
        });
      }
    }
  }

  return candidates;
}

function evaluateCandidate(
  candidate: Candidate,
  requestedHours: number,
): EvaluatedCandidate | null {
  const provided = capacityForCounts(candidate.counts);

  if (provided < requestedHours) {
    return null;
  }

  return {
    ...candidate,
    counts: cloneCounts(candidate.counts),
    provided,
    excess: provided - requestedHours,
  };
}

function compareAssignments(a: EvaluatedCandidate, b: EvaluatedCandidate): number {
  if (a.excess !== b.excess) {
    return a.excess - b.excess;
  }

  const categoryCountA = ROBOT_ORDER.filter((type) => a.counts[type] > 0).length;
  const categoryCountB = ROBOT_ORDER.filter((type) => b.counts[type] > 0).length;

  if (categoryCountA !== categoryCountB) {
    return categoryCountB - categoryCountA;
  }

  const robotsA = totalRobots(a.counts);
  const robotsB = totalRobots(b.counts);

  if (robotsA !== robotsB) {
    return robotsA - robotsB;
  }

  if (a.level !== b.level) {
    return a.level - b.level;
  }

  for (const type of ROBOT_ORDER) {
    if (a.counts[type] !== b.counts[type]) {
      return a.counts[type] - b.counts[type];
    }
  }

  return 0;
}

function pickBest(
  candidates: Candidate[],
  requestedHours: number,
): EvaluatedCandidate | null {
  const viable = candidates
    .map((candidate) => evaluateCandidate(candidate, requestedHours))
    .filter((candidate): candidate is EvaluatedCandidate => candidate !== null)
    .sort(compareAssignments);

  return viable[0] ?? null;
}

export function assignByLevel(
  inventory: Inventory,
  requestedHours: number,
): EvaluatedCandidate | null {
  const levelGroups = [
    { level: 1, candidates: generateLevel1Candidates(inventory) },
    { level: 2, candidates: generateLevel2Candidates(inventory) },
    { level: 3, candidates: generateLevel3Candidates(inventory) },
    { level: 4, candidates: generateLevel4Candidates(inventory) },
  ];

  let best: EvaluatedCandidate | null = null;

  for (const group of levelGroups) {
    const winner = pickBest(group.candidates, requestedHours);

    if (!winner) {
      continue;
    }

    winner.selectedLevel = group.level;

    if (!best || compareAssignments(winner, best) < 0) {
      best = winner;
    }
  }

  if (best) {
    return best;
  }

  const fallback = pickBest(generateAllCandidates(inventory), requestedHours);

  if (fallback) {
    fallback.selectedLevel = fallback.level;
  }

  return fallback;
}
