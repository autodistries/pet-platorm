import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

async function getSessionFromRequest(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value
  
  if (!sessionCookie) {
    return null
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const session = await getSessionFromRequest(request)

  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/login?redirect=/admin", request.url))
    }

    if ((session.user as any).role !== "admin") {
      return NextResponse.redirect(new URL("/?error=unauthorized", request.url))
    }
  }

  // Protection des routes utilisateur (account, orders, etc.)
  if (
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/orders") ||
    request.nextUrl.pathname.startsWith("/checkout")
  ) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/orders/:path*", "/checkout/:path*"],
}
