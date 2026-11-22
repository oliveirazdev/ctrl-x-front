import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDirectory = fileURLToPath(new URL("../tests/", import.meta.url));
const testFiles = readdirSync(testsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.test\.mts$/u.test(entry.name))
  .map((entry) => join(testsDirectory, entry.name));
const skippedTestPatterns = [
  /\b(?:test|it|describe|suite)\s*\.\s*(?:skip|todo|skipIf|todoIf)\b/u,
  /\b(?:skip|todo)\s*:/u,
  /\b(?:xit|xtest|xdescribe|xsuite)\s*\(/u,
];
const violations = [];

for (const file of testFiles) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/u);
  for (const [index, line] of lines.entries()) {
    if (skippedTestPatterns.some((pattern) => pattern.test(line))) {
      violations.push(`${file}:${index + 1}: ${line.trim()}`);
    }
  }
}

if (violations.length > 0) {
  console.error("Skipped or pending frontend tests are not allowed:");
  for (const violation of violations) console.error(violation);
  process.exitCode = 1;
} else {
  console.log(`Checked ${testFiles.length} frontend test files: no skipped or pending tests.`);
}
