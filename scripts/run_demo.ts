import fixture from "../fixtures/process-exception-latency.json" with { type: "json" };
import { buildProcessExceptionSummary, type ProcessExceptionInput } from "../src/index.js";

const summary = buildProcessExceptionSummary(fixture as ProcessExceptionInput);
console.log(`estate=${summary.estate}`);
console.log(`latency=${summary.aggregateLatencyScore}`);
console.log(`escalation=${summary.escalationLanes}`);
console.log(`impacted=${summary.impactedWorkflowEstimate}`);
console.log(`recommendation=${summary.primaryRecommendation}`);
