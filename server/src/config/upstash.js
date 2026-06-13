import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import "dotenv/config";

export const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 req per minute
});

export default ratelimit;
