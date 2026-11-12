import { createHash, timingSafeEqual } from "node:crypto";

export function sameSecret(given: string, expected: string) {
  if (!expected) return false;
  const a = createHash("sha256").update(`vpn\0${given}`).digest();
  const b = createHash("sha256").update(`vpn\0${expected}`).digest();
  return timingSafeEqual(a, b);
}

export function gateValue(password: string) {
  return createHash("sha256").update(`vpn-gate\0${password}`).digest("hex");
}

export function gateMatches(cookie: string | undefined, password: string) {
  if (!cookie || !password) return false;
  const expected = gateValue(password);
  const a = Buffer.from(cookie);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
