import { mkdir, writeFile } from "node:fs/promises";
import fixture from "../fixtures/process-exception-latency.json" with { type: "json" };
import { renderApp } from "../src/app.js";
import type { ProcessExceptionInput } from "../src/index.js";

await mkdir("site", { recursive: true });
await writeFile("site/index.html", renderApp(fixture as ProcessExceptionInput));
