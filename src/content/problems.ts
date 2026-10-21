import type { Problem } from "./types";
import { PROBLEMS_DSA } from "./problems-dsa";
import { PROBLEMS_SQL } from "./problems-sql";
import { PROBLEMS_WEB } from "./problems-web";

export const PROBLEMS: Problem[] = [...PROBLEMS_DSA, ...PROBLEMS_SQL, ...PROBLEMS_WEB];

export const problemById = (id: string) => PROBLEMS.find((p) => p.id === id);
