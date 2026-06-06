import { readFileSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
const markers = [
  "Camunda Process Exception Latency Ledger",
  "Process exceptions become board-visible",
  "payment-exception-resolution",
  "vendor-onboarding-review"
];
const missing = markers.filter((marker) => !html.includes(marker));

if (missing.length) {
  throw new Error(`Rendered site missing markers: ${missing.join(", ")}`);
}

console.log("smoke ok");
