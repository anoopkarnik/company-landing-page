import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "./redis";

let ratelimit: Ratelimit | null = null;
let chatRateLimit: Ratelimit | null = null;

export function getRatelimit() {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  ratelimit ??= new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
    analytics: true,
    prefix: "saas-forge:ratelimit",
  });

  return ratelimit;
}

export function getChatRateLimit() {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  chatRateLimit ??= new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "60 s"), // 20 requests per minute
    analytics: true,
    prefix: "saas-forge:chat-ratelimit",
  });

  return chatRateLimit;
}
