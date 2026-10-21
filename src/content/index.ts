import type { Topic } from "./types";
import { TOPICS_A } from "./topic-a";
import { TOPICS_B } from "./topic-b";
import { TOPICS_C } from "./topic-c";
import { TOPICS_D } from "./topic-d";
import { TOPICS_E } from "./topic-e";
import { TOPICS_F } from "./topic-f";
import { TOPICS_G } from "./topic-g";
import { TOPICS_H, TOPICS_I } from "./topic-hi";

export const TOPICS: Topic[] = [
  ...TOPICS_A, ...TOPICS_B, ...TOPICS_C, ...TOPICS_D,
  ...TOPICS_E, ...TOPICS_F, ...TOPICS_G, ...TOPICS_H, ...TOPICS_I,
];

export const topicById = (id: string) => TOPICS.find((t) => t.id === id);
export const topicsByDomain = (domainId: string) => TOPICS.filter((t) => t.domainId === domainId);
