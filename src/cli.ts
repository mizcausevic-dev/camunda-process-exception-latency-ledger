#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { buildProcessExceptionSummary, type ProcessExceptionInput } from "./index.js";

const file = process.argv[2];
const format = process.argv.includes("--format=json") ? "json" : "text";

if (!file) {
  console.error("Usage: camunda-process-exception-latency-ledger <fixture.json> [--format=json]");
  process.exit(1);
}

const input = JSON.parse(await readFile(file, "utf8")) as ProcessExceptionInput;
const summary = buildProcessExceptionSummary(input);

if (format === "json") {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`estate=${summary.estate}`);
  console.log(`latency=${summary.aggregateLatencyScore}`);
  console.log(`escalation=${summary.escalationLanes}`);
  console.log(`impacted=${summary.impactedWorkflowEstimate}`);
  console.log(`recommendation=${summary.primaryRecommendation}`);
}
