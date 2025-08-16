// Imports
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { LocationData } from "./types";
import { SignJWT } from "jose";

//
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) {
    let token = await getToken({
      req,
      secret: process.env.NEXT_AUTH_KEY,
    });

    if (!token) {
      token = {
        guest: true,
        userId: `guest_${crypto.randomUUID()}`,
        createdAt: Date.now(),
      };

      const jwt = await new SignJWT(token)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(process.env.NEXT_AUTH_KEY));

      const res = NextResponse.next();
      res.cookies.set("next-auth.session-token", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    const headers = new Headers(req.headers);
    headers.set("x-user-id", token.userId as string);
    headers.set("x-guest", String(token.guest ?? false));
    headers.set("x-user-email", token.email ?? "");

    return NextResponse.next({ request: { headers } });
  }

  const cookieStore = await cookies();
  const locationRawCookie = cookieStore.get("user_location")?.value;

  if (locationRawCookie) return NextResponse.next();

  if (!process.env.IPGEOLOCATION_KEY) {
    return NextResponse.json(
      { success: false, error: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_KEY}`
    );
    if (!response.ok) {
      return NextResponse.next();
    }

    const data = await response.json();
    if (
      !data.country_name ||
      !data.country_code2 ||
      !data.latitude ||
      !data.longitude ||
      !data.country_capital
    ) {
      return NextResponse.next();
    }

    const userIpLocationInfo: LocationData = {
      country: data.country_name,
      countryCode: data.country_code2,
      lat: data.latitude,
      lng: data.longitude,
      capital: data.country_capital,
    };

    const res = NextResponse.next();
    res.cookies.set("user_location", JSON.stringify(userIpLocationInfo), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
