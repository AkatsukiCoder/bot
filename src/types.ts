export type RobotType = "Bravo" | "Charlie" | "Delta";

export type RobotCounts = Record<RobotType, number>;

export type Inventory = RobotCounts;

export interface RobotSpec {
  workingHoursPerDay: number;
  chargingCostPerDay: number;
  level: number;
}

export interface AssignmentResult {
  counts: RobotCounts;
  provided: number;
  requested: number;
  excess: number;
  level: number;
}

export interface Candidate {
  counts: RobotCounts;
  level: number;
  name: string;
}

export interface EvaluatedCandidate extends Candidate {
  provided: number;
  excess: number;
  selectedLevel?: number;
}
