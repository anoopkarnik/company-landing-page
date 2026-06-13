import "server-only";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function hasRedisConfig() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

export function getRedis() {
  if (!hasRedisConfig()) {
    return null;
  }

  redis ??= new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  return redis;
}
