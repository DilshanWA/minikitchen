import "server-only";

import { SignJWT, jwtVerify } from "jose";

function getKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured securely");
  }
  return new TextEncoder().encode(secret);
}

export async function createToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("1h")
    .setIssuer("your-app")
    .setAudience("your-app-users")
    .sign(getKey());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
      issuer: "your-app",
      audience: "your-app-users",
    });

    if (
      typeof payload.sub !== "string" ||
      !payload.sub
    ) {
      return null;
    }

    return { userId: payload.sub };
  } catch {
    return null;
  }
}