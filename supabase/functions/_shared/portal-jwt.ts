// Shared HS256 signing/verification helpers for Alazab Portal JWTs (Outpost).

const encoder = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(input: string): Uint8Array {
  const pad = input.length % 4 ? "=".repeat(4 - (input.length % 4)) : "";
  const bin = atob(input.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function key(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export type PortalClaims = {
  iss: string;
  aud: string;
  sub: string;
  jti: string;
  email?: string | null;
  name?: string | null;
  roles: string[];
  app: string;
  iat: number;
  exp: number;
  nbf: number;
  [k: string]: unknown;
};

export async function signPortalJwt(claims: PortalClaims, secret: string): Promise<string> {
  const header = b64url(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payload = b64url(encoder.encode(JSON.stringify(claims)));
  const data = `${header}.${payload}`;
  const sig = await crypto.subtle.sign("HMAC", await key(secret), encoder.encode(data));
  return `${data}.${b64url(new Uint8Array(sig))}`;
}

export async function verifyPortalJwt(
  token: string,
  secret: string,
): Promise<{ valid: boolean; reason?: string; claims?: PortalClaims }> {
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "malformed" };
  const data = `${parts[0]}.${parts[1]}`;
  const ok = await crypto.subtle.verify(
    "HMAC",
    await key(secret),
    b64urlDecode(parts[2]),
    encoder.encode(data),
  );
  if (!ok) return { valid: false, reason: "bad_signature" };
  let claims: PortalClaims;
  try {
    claims = JSON.parse(new TextDecoder().decode(b64urlDecode(parts[1])));
  } catch {
    return { valid: false, reason: "bad_payload" };
  }
  const now = Math.floor(Date.now() / 1000);
  if (claims.exp && now >= claims.exp) return { valid: false, reason: "expired", claims };
  if (claims.nbf && now + 60 < claims.nbf) return { valid: false, reason: "not_yet_valid", claims };
  return { valid: true, claims };
}
