import { env } from "./env";

// Kit (ConvertKit) v4 API. We use the v4 API key server-side only.
const KIT_BASE = "https://api.kit.com/v4";

function kitHeaders(): Record<string, string> {
  return {
    "X-Kit-Api-Key": env.kitApiKey ?? "",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * Create or update a subscriber in Kit. Idempotent — Kit upserts on email.
 * Returns true on success.
 */
export async function upsertKitSubscriber(email: string): Promise<boolean> {
  const res = await fetch(`${KIT_BASE}/subscribers`, {
    method: "POST",
    headers: kitHeaders(),
    body: JSON.stringify({ email_address: email }),
  });
  return res.ok;
}

// Soft per-instance cache so we don't re-list tags on every request.
const tagIdCache = new Map<string, number>();

/**
 * Find a tag by name (case-insensitive) or create it. Returns the tag id.
 */
export async function ensureKitTag(name: string): Promise<number | null> {
  const key = name.toLowerCase();
  const cached = tagIdCache.get(key);
  if (cached) return cached;

  const list = await fetch(`${KIT_BASE}/tags?per_page=200`, {
    headers: kitHeaders(),
  });
  if (list.ok) {
    const json = await list.json().catch(() => ({}));
    const found = (json.tags ?? []).find(
      (t: { id: number; name: string }) => t.name?.toLowerCase() === key,
    );
    if (found?.id) {
      tagIdCache.set(key, found.id);
      return found.id;
    }
  }

  const create = await fetch(`${KIT_BASE}/tags`, {
    method: "POST",
    headers: kitHeaders(),
    body: JSON.stringify({ name }),
  });
  if (create.ok) {
    const json = await create.json().catch(() => ({}));
    const id = json.tag?.id;
    if (id) {
      tagIdCache.set(key, id);
      return id;
    }
  }
  return null;
}

/**
 * Attach an existing tag to a subscriber by email.
 */
export async function tagKitSubscriber(
  email: string,
  tagId: number,
): Promise<boolean> {
  const res = await fetch(`${KIT_BASE}/tags/${tagId}/subscribers`, {
    method: "POST",
    headers: kitHeaders(),
    body: JSON.stringify({ email_address: email }),
  });
  return res.ok;
}

/**
 * Add an email to Kit and optionally tag it. Used by the /api/kit/subscribe
 * endpoint that ManyChat (and our own flows) call.
 */
export async function addToKit(
  email: string,
  tag?: string | null,
): Promise<{ ok: boolean; tagged: boolean }> {
  const ok = await upsertKitSubscriber(email);
  if (!ok) return { ok: false, tagged: false };

  let tagged = false;
  if (tag) {
    const tagId = await ensureKitTag(tag);
    if (tagId) tagged = await tagKitSubscriber(email, tagId);
  }
  return { ok: true, tagged };
}
