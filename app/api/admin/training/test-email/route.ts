import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getActiveTrainingEvent } from "@/lib/training";
import {
  sendTrainingRegistrationEmail,
  sendTraining24hReminder,
  sendTraining1hReminder,
  sendTrainingReplayDelivery,
  sendTrainingKitPitch,
} from "@/lib/training-emails";

export const runtime = "nodejs";

type Kind =
  | "registration"
  | "reminder_24h"
  | "reminder_1h"
  | "replay_delivery"
  | "kit_pitch";

const ALLOWED: Set<Kind> = new Set([
  "registration",
  "reminder_24h",
  "reminder_1h",
  "replay_delivery",
  "kit_pitch",
]);

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const kind = String(body.kind ?? "") as Kind;
  const name = String(body.name ?? "Oge").trim().slice(0, 200);
  const vip = body.vip === true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!ALLOWED.has(kind)) {
    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  }

  const event = await getActiveTrainingEvent();
  if (!event && kind !== "kit_pitch") {
    return NextResponse.json(
      {
        error:
          "No active training event configured. Set one up in /admin/training first.",
      },
      { status: 400 },
    );
  }

  try {
    if (kind === "registration") {
      await sendTrainingRegistrationEmail(email, name, event!);
    } else if (kind === "reminder_24h") {
      await sendTraining24hReminder(email, name, event!);
    } else if (kind === "reminder_1h") {
      await sendTraining1hReminder(email, name, event!);
    } else if (kind === "replay_delivery") {
      await sendTrainingReplayDelivery(email, name, event!, vip);
    } else if (kind === "kit_pitch") {
      await sendTrainingKitPitch(email, name);
    }
    return NextResponse.json({ ok: true, kind, email });
  } catch (err) {
    console.error("Test email failed:", err);
    return NextResponse.json(
      { error: String(err instanceof Error ? err.message : err) },
      { status: 500 },
    );
  }
}
