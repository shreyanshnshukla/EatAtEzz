import { z } from "zod";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export const ok = (message?: string): ActionResult => ({ ok: true, message });
export const fail = (error: string): ActionResult => ({ ok: false, error });
export const idle: ActionResult = { ok: true };

export const SIGN_IN_REQUIRED = "Sign in first.";

const Uuid = z.string().uuid();
export const isUuid = (...ids: string[]) => ids.every((id) => Uuid.safeParse(id).success);

/** Database rate-limit / size triggers raise P0001 with a readable message. */
export const dbLimitMessage = (error: { code?: string; message: string } | null) =>
  error?.code === "P0001" ? `${error.message}. Try again tomorrow.` : null;
