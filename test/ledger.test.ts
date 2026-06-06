import { describe, expect, it } from "vitest";
import fixture from "../fixtures/process-exception-latency.json" with { type: "json" };
import { buildProcessExceptionSummary, scoreLane, type ProcessExceptionInput, type ProcessExceptionLane } from "../src/index.js";

describe("camunda process exception latency ledger", () => {
  it("prioritizes the highest-latency process lane", () => {
    const summary = buildProcessExceptionSummary(fixture as ProcessExceptionInput);
    expect(summary.escalationLanes).toBe(1);
    expect(summary.findings[0].laneId).toBe("payment-exception-resolution");
    expect(summary.primaryRecommendation).toContain("Split approval ownership");
  });

  it("marks vendor onboarding as watch", () => {
    const finding = scoreLane((fixture as ProcessExceptionInput).lanes[1]);
    expect(finding.posture).toBe("watch");
    expect(finding.latencyScore).toBe(66.6);
  });

  it("keeps invoice reconciliation contained", () => {
    const finding = scoreLane((fixture as ProcessExceptionInput).lanes[2]);
    expect(finding.posture).toBe("contained");
  });

  it("requires at least one process lane", () => {
    expect(() => buildProcessExceptionSummary({ asOf: "2026-06-06T12:00:00Z", estate: "empty", lanes: [] })).toThrow(
      "At least one Camunda process exception lane is required."
    );
  });

  it("keeps a clean fulfilment process contained", () => {
    const lane: ProcessExceptionLane = {
      laneId: "fulfilment-handoff",
      process: "Fulfilment handoff",
      monthlyInstances: 900,
      activeIncidents: 0,
      overdueHumanTasks: 1,
      retryLoopCount: 0,
      avgDecisionLatencyHours: 4,
      slaBreachRatePercent: 1,
      unresolvedEscalations: 0,
      owner: "Operations",
      nextAction: "Keep proof attached."
    };
    expect(scoreLane(lane).posture).toBe("contained");
  });
});
