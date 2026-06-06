import { readFileSync } from "node:fs";

const bpmn = readFileSync("bpmn/payment-exception-resolution.bpmn", "utf8");
const required = ["<process", "payment-exception-resolution", "<userTask", "<exclusiveGateway", "<serviceTask"];
const missing = required.filter((token) => !bpmn.includes(token));

if (missing.length) {
  throw new Error(`BPMN contract missing: ${missing.join(", ")}`);
}

console.log("bpmn contract ok");
