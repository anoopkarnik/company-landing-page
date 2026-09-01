import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "company_landing_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

interface AdminSessionPayload {
  version: 1;
  expiresAt: number;
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || null;
}

function sign(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function hasAdminAuthConfiguration() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim() && sessionSecret());
}

export function verifyAdminPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export function createAdminSessionToken() {
  const secret = sessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is required");
  }

  const payload: AdminSessionPayload = {
    version: 1,
    expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  const secret = sessionSecret();
  if (!secret || !token) return false;

  const [encodedPayload, providedSignature, ...extra] = token.split(".");
  if (!encodedPayload || !providedSignature || extra.length > 0) return false;
  if (!safeEqual(providedSignature, sign(encodedPayload, secret))) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<AdminSessionPayload>;
    return (
      payload.version === 1 &&
      typeof payload.expiresAt === "number" &&
      payload.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export async function hasValidAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
