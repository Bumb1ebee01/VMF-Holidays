// Rate limiting. Uses Upstash Redis over its REST API (no SDK → no extra
// dependency) when configured; otherwise falls back to a per-instance in-memory
// limiter. Fixed window: at most `max` requests per `windowSec` seconds per key.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (memory.size > 10_000) memory.clear();
  const entry = memory.get(key);
  if (!entry || now > entry.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

async function upstashLimited(key: string, max: number, windowSec: number): Promise<boolean> {
  const headers = { Authorization: `Bearer ${UPSTASH_TOKEN}` };
  const k = encodeURIComponent(`ratelimit:${key}`);
  const res = await fetch(`${UPSTASH_URL}/incr/${k}`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`upstash incr ${res.status}`);
  const { result } = (await res.json()) as { result: number };
  if (result === 1) {
    // First hit in this window — set the TTL.
    await fetch(`${UPSTASH_URL}/expire/${k}/${windowSec}`, { headers, cache: "no-store" });
  }
  return result > max;
}

/** True if `key` has exceeded `max` requests in the last `windowSec` seconds. */
export async function isRateLimited(key: string, max = 5, windowSec = 60): Promise<boolean> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      return await upstashLimited(key, max, windowSec);
    } catch (err) {
      console.error("[ratelimit] Upstash error, falling back to memory:", err);
      return memoryLimited(key, max, windowSec * 1000);
    }
  }
  return memoryLimited(key, max, windowSec * 1000);
}
