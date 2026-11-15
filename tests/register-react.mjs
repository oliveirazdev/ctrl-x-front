// Keep the existing Node test runner. Compile JSX and resolve UI-only imports
// for server-rendered component tests, without changing application behavior.
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import ts from "typescript";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL?.startsWith("test:"))
      context = {
        ...context,
        parentURL: pathToFileURL(resolve("tests/register-react.mjs")).href,
      };
    if (specifier.startsWith("@/")) {
      const base = resolve("src", specifier.slice(2));
      for (const extension of ["", ".ts", ".tsx"]) {
        try {
          return nextResolve(pathToFileURL(base + extension).href, context);
        } catch (error) {
          if (error.code !== "ERR_MODULE_NOT_FOUND") throw error;
        }
      }
    }
    if (specifier === "next/link" || specifier === "next/navigation") {
      return { url: `test:${specifier}`, shortCircuit: true };
    }
    if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
      for (const extension of [".ts", ".tsx"]) {
        try {
          return nextResolve(specifier + extension, context);
        } catch (error) {
          if (error.code !== "ERR_MODULE_NOT_FOUND") throw error;
        }
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "test:next/link")
      return {
        format: "module",
        shortCircuit: true,
        source:
          'import { createElement } from "react"; export default function Link(props) { return createElement("a", props); }',
      };
    if (url === "test:next/navigation")
      return {
        format: "module",
        shortCircuit: true,
        source: 'export function usePathname() { return "/patient/profile"; }',
      };
    if (url.endsWith(".module.css"))
      return {
        format: "module",
        shortCircuit: true,
        source:
          "export default new Proxy({}, { get: (_, name) => String(name) });",
      };
    if (url.endsWith(".tsx")) {
      const source = ts.transpileModule(
        readFileSync(fileURLToPath(url), "utf8"),
        {
          compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        },
      ).outputText;
      return { format: "module", source, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
