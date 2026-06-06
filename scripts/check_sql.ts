import { readFileSync } from "node:fs";

const sql = readFileSync("sql/process_exception_latency_contract.sql", "utf8");
const required = ["process_key", "active_incidents", "overdue_human_tasks", "retry_loop_count", "sla_breach_rate_percent"];
const missing = required.filter((token) => !sql.includes(token));

if (missing.length) {
  throw new Error(`SQL contract missing: ${missing.join(", ")}`);
}

console.log("sql contract ok");
