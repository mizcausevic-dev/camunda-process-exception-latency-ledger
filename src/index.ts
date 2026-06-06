export type ProcessExceptionLane = {
  laneId: string;
  process: string;
  monthlyInstances: number;
  activeIncidents: number;
  overdueHumanTasks: number;
  retryLoopCount: number;
  avgDecisionLatencyHours: number;
  slaBreachRatePercent: number;
  unresolvedEscalations: number;
  owner: string;
  nextAction: string;
};

export type ProcessExceptionInput = {
  asOf: string;
  estate: string;
  lanes: ProcessExceptionLane[];
};

export type ProcessExceptionFinding = ProcessExceptionLane & {
  latencyScore: number;
  impactedWorkflowEstimate: number;
  posture: "escalate" | "watch" | "contained";
};

export type ProcessExceptionSummary = {
  asOf: string;
  estate: string;
  aggregateLatencyScore: number;
  escalationLanes: number;
  impactedWorkflowEstimate: number;
  primaryRecommendation: string;
  findings: ProcessExceptionFinding[];
};

const round = (value: number, digits = 2): number => Number(value.toFixed(digits));
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function scoreLane(lane: ProcessExceptionLane): ProcessExceptionFinding {
  const latencyScore = clamp(
    lane.activeIncidents * 4 +
      lane.overdueHumanTasks * 3.5 +
      lane.retryLoopCount * 5 +
      lane.avgDecisionLatencyHours * 0.9 +
      lane.slaBreachRatePercent * 1.2 +
      lane.unresolvedEscalations * 6,
    0,
    100
  );

  const impactedWorkflowEstimate = Math.round(
    lane.monthlyInstances * (lane.slaBreachRatePercent / 100) * 0.5 +
      lane.activeIncidents * 3 +
      lane.overdueHumanTasks * 2
  );

  return {
    ...lane,
    latencyScore: round(latencyScore),
    impactedWorkflowEstimate,
    posture: latencyScore >= 70 ? "escalate" : latencyScore >= 40 ? "watch" : "contained"
  };
}

export function buildProcessExceptionSummary(input: ProcessExceptionInput): ProcessExceptionSummary {
  if (!input.lanes.length) {
    throw new Error("At least one Camunda process exception lane is required.");
  }

  const findings = input.lanes.map(scoreLane).sort((a, b) => b.latencyScore - a.latencyScore);
  const aggregateLatencyScore = round(findings.reduce((sum, lane) => sum + lane.latencyScore, 0) / findings.length);
  const escalationLanes = findings.filter((lane) => lane.posture === "escalate").length;
  const impactedWorkflowEstimate = findings.reduce((sum, lane) => sum + lane.impactedWorkflowEstimate, 0);
  const top = findings[0];

  return {
    asOf: input.asOf,
    estate: input.estate,
    aggregateLatencyScore,
    escalationLanes,
    impactedWorkflowEstimate,
    primaryRecommendation: `${top.laneId}: ${top.nextAction}`,
    findings
  };
}
