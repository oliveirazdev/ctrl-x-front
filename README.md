# Ctrl X Frontend

Windows / PowerShell:

```powershell
npx create-next-app@latest . --ts --eslint --app --src-dir --no-tailwind --use-npm
Copy-Item .env.example .env.local
npm run dev
```

If the CLI refuses a non-empty directory, generate Next.js in a temporary folder and merge its generated files here without overwriting `AGENTS.md`, `.env.example`, or `src/features`. Run Codex prompt 02 to do this safely.
