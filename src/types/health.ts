import { z } from "zod";

// Matches GET /health in ctrl-x-backend/app/main.py.
export const healthSchema = z.object({ status: z.literal("ok") });
export type HealthResponse = z.infer<typeof healthSchema>;
